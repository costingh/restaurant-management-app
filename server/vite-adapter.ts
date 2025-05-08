import { INestApplication } from '@nestjs/common';
import express, { Express } from 'express';
import { createServer as createViteServer } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

/**
 * Serves static Vite files and handles development mode for a NestJS app
 */
export async function serveStatic(app: INestApplication) {
  const expressApp = app.getHttpAdapter().getInstance() as Express;
  
  if (process.env.NODE_ENV === 'development') {
    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so the parent server
    // can take control
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    
    // Use vite's connect instance as middleware
    expressApp.use(vite.middlewares);
    
    expressApp.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      
      try {
        // API routes should pass through
        if (url.startsWith('/api')) {
          next();
          return;
        }
        
        // Static resource path
        const staticResourcePath = resolve('client', 'index.html');
        
        // Read the index.html file
        const template = readFileSync(staticResourcePath, 'utf-8');
        
        // Transform the HTML using Vite
        const transformedHtml = await vite.transformIndexHtml(url, template);
        
        // Send the transformed HTML to the client
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
      } catch (e) {
        // If an error occurs, pass it to the next middleware
        const error = e as Error;
        console.error(`Error processing request ${url}:`, error);
        vite.ssrFixStacktrace(error);
        next(error);
      }
    });
  } else {
    // Production mode
    const distPath = resolve('dist', 'client');
    expressApp.use(express.static(distPath));
    
    expressApp.get('*', (req, res) => {
      // API routes should pass through
      if (req.path.startsWith('/api')) {
        return;
      }
      
      res.sendFile(resolve(distPath, 'index.html'));
    });
  }
}