import { loadEnv } from './loadEnv';

loadEnv();

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
  // Comma-separated list of allowed CORS origins, e.g. "http://localhost:5173,https://site.com".
  // Empty => reflect any origin (dev default).
  corsOrigins: (process.env['CORS_ORIGIN'] ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};
