import { INestApplication } from '@nestjs/common';
import { Express } from 'express';
import { createServer as createViteServer } from 'vite';
import { resolve } from 'path';

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
        
        // Load the index.html file
        let template = vite.transformIndexHtml(url, await vite.ssrLoadModule(staticResourcePath));
        
        // Send the transformed HTML to the client
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        // If an error occurs, pass it to the next middleware
        console.error(`Error processing request ${url}:`, e);
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production mode
    const distPath = resolve('dist', 'client');
    expressApp.use(expressApp.static(distPath));
    
    expressApp.get('*', (req, res) => {
      // API routes should pass through
      if (req.path.startsWith('/api')) {
        return;
      }
      
      res.sendFile(resolve(distPath, 'index.html'));
    });
  }
}