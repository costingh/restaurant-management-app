import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { serveStatic } from './vite-adapter';
import { log } from './vite';
import session from 'express-session';
import passport from 'passport';
import memorystore from 'memorystore';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Use validation pipe for automatic DTO validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Set the global prefix for all endpoints
  app.setGlobalPrefix('api');

  // Setup session middleware
  const MemoryStore = memorystore(session);
  const PgStore = connectPgSimple(session);
  
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    store: process.env.DATABASE_URL 
      ? new PgStore({ pool }) // Use PostgreSQL if available
      : new MemoryStore({
          checkPeriod: 86400000 // prune expired entries every 24h
        }),
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  // Serve static files in development
  await serveStatic(app);

  await app.listen(process.env.PORT || 5000);
  log(`serving on port ${process.env.PORT || 5000}`);
}
bootstrap();