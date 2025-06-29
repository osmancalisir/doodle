// backend/src/db.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing database connection...');
console.log('Environment variables:', {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_PASSWORD: process.env.DB_PASSWORD ? '*****' : 'not set'
});

const DB_HOST = process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST;

const pool = new Pool({
  user: process.env.DB_USER || 'doodle',
  host: DB_HOST,
  database: process.env.DB_NAME || 'doodlebackend',
  password: process.env.DB_PASSWORD || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
});

pool.query('SELECT NOW()')
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => {
    console.error('❌ Database connection failed:');
    console.error(err);
    process.exit(1);
  });


process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});

export const query = (text: string, params?: any[]) => {
  console.log(`Executing query: ${text}`, params);
  return pool.query(text, params);
};

export default pool;
