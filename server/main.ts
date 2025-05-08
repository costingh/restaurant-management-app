import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
import { serveStatic } from './vite-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
    }
  }));
  
  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  
  // Prefix all API routes
  app.setGlobalPrefix('api');
  
  // Serve static files 
  await serveStatic(app);
  
  // Start application
  await app.listen(process.env.PORT || 5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();