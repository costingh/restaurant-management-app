import { INestApplication } from '@nestjs/common';
import { setupVite, serveStatic as serveStaticFiles } from './vite';
import { Express } from 'express';

export async function serveStatic(app: INestApplication) {
  const server = app.getHttpServer();
  const expressApp = app.getHttpAdapter().getInstance() as Express;
  
  if (process.env.NODE_ENV !== 'production') {
    await setupVite(expressApp, server);
  } else {
    serveStaticFiles(expressApp);
  }
}