/**
 * Server Entry Point
 * 
 * This is the main entry file for the Express server that integrates with NestJS components.
 * It initializes the server with all necessary middleware, authentication strategies,
 * route handlers, and serves the frontend application.
 * 
 * The application uses a hybrid architecture, gradually migrating from Express to NestJS
 * for better structure and maintainability while ensuring backward compatibility.
 */

// Import Express types extension
import "./types";

import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { DatabaseService } from "./modules/database/database.service";
import { AuthService } from "./modules/auth/auth.service";
import { UsersService } from "./modules/users/users.service";
import { LocalStrategy } from "./modules/auth/strategies/local.strategy";
import { SessionSerializer } from "./modules/auth/session.serializer";
import { storage } from "./storage";

// Create Express app
const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create services (using NestJS services)
const databaseService = new DatabaseService();
const usersService = new UsersService(databaseService);
const authService = new AuthService(usersService);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    },
    store: storage.sessionStore
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Configure passport local strategy
const localStrategy = new LocalStrategy(authService);
passport.use(localStrategy);

// Configure session serializer
const sessionSerializer = new SessionSerializer(usersService);
passport.serializeUser((user: any, done: Function) => {
  sessionSerializer.serializeUser(user, done);
});
passport.deserializeUser((id: number, done: Function) => {
  sessionSerializer.deserializeUser(id, done);
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Start the application
(async () => {
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Setup Vite for development or serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
