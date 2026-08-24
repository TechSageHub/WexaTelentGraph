import { app } from './app';
import { config } from './config/env';
import { initDriver, closeDriver } from './database/neo4j';

async function start(): Promise<void> {
  try {
    await initDriver();

    const server = app.listen(config.port, () => {
      console.log(`🚀 TalentGraph API running on http://localhost:${config.port}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await closeDriver();
        console.log('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('❌ Failed to start TalentGraph server:', err);
    process.exit(1);
  }
}

start();
