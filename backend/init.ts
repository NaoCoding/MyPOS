import dotenvFlow from 'dotenv-flow';
import { migrateToLatest, migrateDown, migrateDownAll } from './database/migrator';

async function init() {
    // load environment variables from .env files
    dotenvFlow.config();
    console.log("Environment variables loaded");

    // migrate down the last migration (DANGEROUS, use with caution)
    // await migrateDown();
    // console.log("Database migrations rolled back");

    // migrate down all migrations (DANGEROUS, use with caution)
    // await migrateDownAll();
    // console.log("All database migrations rolled back");

    // run database migrations
    await migrateToLatest();
    console.log("Database migrations completed");
}

init();
