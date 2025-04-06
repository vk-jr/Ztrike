import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// Export the database instance
export const db = drizzle({ client: pool, schema });

// Function to check database connection
export async function checkDatabaseConnection() {
  try {
    const client = await pool.connect();
    client.release();
    console.log("Successfully connected to the database");
    return true;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return false;
  }
}
