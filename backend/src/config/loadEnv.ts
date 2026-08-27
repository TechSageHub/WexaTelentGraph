import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Load the root .env file, probing several candidate paths so it works from
 * both ts-node (src/ or scripts/) and compiled JS (dist/), and from any cwd.
 * Safe to call multiple times (dotenv is idempotent).
 */
export function loadEnv(): void {
  const candidates = [
    path.resolve(__dirname, '../../.env'),   // src/config or dist/config -> backend/../.env
    path.resolve(__dirname, '../../../.env'), // one more level up -> project root
    path.resolve(process.cwd(), '../.env'),   // cwd is backend/ when running npm run dev
    path.resolve(process.cwd(), '.env'),      // cwd is project root (rare)
  ];
  const envPath = candidates.find((p) => fs.existsSync(p));
  if (envPath) {
    dotenv.config({ path: envPath });
  } else {
    console.warn('Could not locate .env file. Falling back to process.env.');
  }
}
