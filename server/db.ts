/**
 * Database Connection Configuration
 * 
 * This module establishes the connection to the PostgreSQL database using Drizzle ORM
 * with the Neon serverless Postgres provider. It configures the connection pool and
 * creates the Drizzle instance with the schema imported from the shared folder.
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon to use WebSockets for the serverless environment
neonConfig.webSocketConstructor = ws;

// Verify that the database connection string is available
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

/**
 * Create a connection pool to the PostgreSQL database
 * This manages database connections efficiently, reusing connections to reduce overhead
 */
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Initialize Drizzle ORM with our schema and connection pool
 * This provides the main interface for our application to interact with the database
 */
export const db = drizzle(pool, { schema });