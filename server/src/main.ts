import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
const session = require('express-session');
const passport = require('passport');
const connectPgSimple = require('connect-pg-simple');
const MemoryStore = require('memorystore')(session);
import { pool } from './database/db';
const dotenv = require('dotenv');

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for the frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'https://localhost:3000', "http://localhost:5173", '*'],
    credentials: true, // Important for cookies/session
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Use validation pipe for automatic DTO validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Set the global prefix for all endpoints
  app.setGlobalPrefix('api');

  // Setup session middleware
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

  await app.listen(process.env.PORT || 5001);
  console.log(`Server running on port ${process.env.PORT || 5001}`);
}
bootstrap();
