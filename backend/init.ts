import dotenvFlow from 'dotenv-flow';
import cron from 'node-cron';
import { migrateToLatest, migrateDown, migrateDownAll } from './database/migrator';
import { deleteExpiredSessions } from './models/session';

async function init() {
    // load environment variables from .env files
    dotenvFlow.config();
    console.log("Environment variables loaded");

    cron.schedule('0 8 * * *', async () => {
        console.log("Deleting expired sessions");
        await deleteExpiredSessions();
        console.log("Expired sessions deleted");
    });

    try {
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
    catch (error) {
        console.error("Error during database migration:", error);
        process.exit(1);
    }
}

init();
