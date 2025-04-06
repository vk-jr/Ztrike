import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import { checkDatabaseConnection, runMigrations } from "./db/index";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session management
const PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    pool,
    tableName: 'session', // Default table name
    createTableIfMissing: true, // Create the table if it doesn't exist
  }),
  secret: process.env.SESSION_SECRET || 'athlete-network-secret-key', 
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

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

(async () => {
  // Check database connection and run migrations
  try {
    const dbConnected = await checkDatabaseConnection();
    if (dbConnected) {
      log('Successfully connected to the PostgreSQL database');
      // Run migrations to create database tables
      await runMigrations();
    } else {
      log('WARNING: Failed to connect to the PostgreSQL database');
    }
  } catch (error) {
    log(`Database connection error: ${error}`);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use port 5001 instead of 5000 to avoid conflicts
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5001');
  const startServer = (port: number) => {
    server.listen(port, () => {
      log(`serving on port ${port}`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log(`Port ${port} is already in use, trying port ${port + 1}`);
        startServer(port + 1);
      } else {
        log(`Error starting server: ${err.message}`);
      }
    });
  };
  
  startServer(port);
})();
