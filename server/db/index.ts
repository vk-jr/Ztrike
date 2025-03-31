import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';

// Load environment variables from .env file
dotenv.config();

// Use serverless driver in production, regular pg for development
let connectionString = process.env.DATABASE_URL || '';

// Always use SSL for connections
const client = postgres(connectionString, { 
  max: 1,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(client);

// Helper to check if database is connected
export async function checkDatabaseConnection() {
  try {
    // Simple query to test connection
    const result = await db.execute(sql`SELECT 1 as connected`);
    console.log('[DB] Successfully connected to the database');
    return true;
  } catch (error) {
    console.error('[DB] Failed to connect to the database:', error);
    return false;
  }
}

// Run migrations on startup
export async function runMigrations() {
  try {
    console.log('[DB] Running migrations...');
    // Run migrations in production
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('[DB] Migrations completed successfully');
  } catch (error) {
    console.error('[DB] Error running migrations:', error);
  }
}