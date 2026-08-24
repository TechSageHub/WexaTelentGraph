import neo4j, { Driver, Session } from 'neo4j-driver';
import { config } from '../config/env';

let driver: Driver | null = null;

/**
 * Initialise the Neo4j driver connection to CognoDB.
 * The driver is a singleton — call this once on startup.
 */
export async function initDriver(): Promise<Driver> {
  driver = neo4j.driver(
    config.cognodb.uri,
    neo4j.auth.basic(config.cognodb.username, config.cognodb.password),
    {
      maxConnectionPoolSize: 10,
      connectionAcquisitionTimeout: 5000,
    }
  );

  // Verify connectivity — throws if CognoDB is unreachable
  await driver.verifyConnectivity();
  console.log('✅ Connected to CognoDB successfully');
  return driver;
}

/**
 * Get the singleton driver instance.
 * Lazily initialises the driver if not already created (useful for serverless environments).
 */
export function getDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      config.cognodb.uri,
      neo4j.auth.basic(config.cognodb.username, config.cognodb.password),
      {
        maxConnectionPoolSize: 10,
        connectionAcquisitionTimeout: 5000,
      }
    );
  }
  return driver;
}

/**
 * Open a new Neo4j session. Remember to close it after use.
 */
export function getSession(): Session {
  return getDriver().session({ database: 'neo4j' });
}

/**
 * Close the driver gracefully on application shutdown.
 */
export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = null;
    console.log('Database driver closed.');
  }
}
