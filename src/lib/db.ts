import { Pool } from 'pg';

const pool = new Pool({
  // Use connection string from env var, but configured to use app_user details if not fully specified
  // In a real scenario, we might construct this, but standard PG env vars work too.
  // For this Docker setup, since we want to force app_user, we can rely on standard PG env vars
  // OR construct it manually if provided individually.
  // However, usually DATABASE_URL is all-encompassing.
  // We'll trust the environment provides the correct connection string or parameters.
  connectionString: process.env.DATABASE_URL,
});

export default pool;
