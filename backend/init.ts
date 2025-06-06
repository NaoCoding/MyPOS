import dotenvFlow from 'dotenv-flow';
import cron from 'node-cron';
import { migrateToLatest, migrateDown, migrateDownAll } from './database/migrator';
import { deleteExpiredSessions } from './models/session';

async function init() {
    // load environment variables from .env files
    dotenvFlow.config();
    console.log("Environment variables loaded");

    // migrate down the last migration (DANGEROUS, use with caution)
    // await migrateDown();
    // console.log("Database migrations rolled back");
    // await migrateDown();
    // migrate down all migrations (DANGEROUS, use with caution)
    // await migrateDownAll();
    // console.log("All database migrations rolled back");

    cron.schedule('0 8 * * *', async () => {
        console.log("Deleting expired sessions");
        await deleteExpiredSessions();
        console.log("Expired sessions deleted");
    });

    // run database migrations
    await migrateToLatest();
    console.log("Database migrations completed");
}

init();
