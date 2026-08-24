import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Resolve .env from multiple candidate paths so it works in both
// ts-node-dev (src/config/ → __dirname = .../backend/src/config)
// and compiled JS (dist/config/ → __dirname = .../backend/dist/config)
const candidates = [
  path.resolve(__dirname, '../../.env'),   // from src/config or dist/config → backend/../.env
  path.resolve(__dirname, '../../../.env'), // one more level up → project root
  path.resolve(process.cwd(), '../.env'),   // cwd is backend/ when running npm run dev
  path.resolve(process.cwd(), '.env'),      // cwd is project root (rare)
];

const envPath = candidates.find((p) => fs.existsSync(p));
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  Could not locate .env file. Falling back to process.env.');
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  cognodb: {
    uri: requireEnv('COGNODB_URI'),
    username: requireEnv('COGNODB_USERNAME'),
    password: requireEnv('COGNODB_PASSWORD'),
  },
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
};
