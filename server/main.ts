import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
import { Express, Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance() as Express;
  
  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Important for cookies/session
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: 'lax', // Helps with CSRF
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    }
  }));
  
  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Express request logging middleware
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson: any) {
      capturedJsonResponse = bodyJson;
      return originalResJson.call(this, bodyJson);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      logger.log(logLine);
    });

    next();
  });
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  // Error handling
  expressApp.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    logger.error(`Error: ${message}`, err.stack);
    res.status(status).json({ message });
  });
  
  // Prefix all API routes
  app.setGlobalPrefix('api');
  
  // Start application on a different port than the frontend
  const port = process.env.API_PORT || 4000;
  await app.listen(port, '0.0.0.0');
  logger.log(`API server running on port ${port}`);
}

bootstrap();