import dotenvFlow from 'dotenv-flow';
import { migrateToLatest, migrateDown } from './database/migrator';

async function init() {
    // load environment variables from .env files
    dotenvFlow.config();
    console.log("Environment variables loaded");

    // run database migrations
    await migrateToLatest();
    console.log("Database migrations completed");
}

init();
