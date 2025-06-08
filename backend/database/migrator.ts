import { FileMigrationProvider, Migrator } from 'kysely';
import { promises as fs } from 'fs';
import path from 'path';
import { db } from './db';

const provider = new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, 'migrations'),
});

const migrator = new Migrator({ db, provider });

export async function migrateToLatest() {
    const { error, results } = await migrator.migrateToLatest();

    if (error) {
        throw error;
    }

    if (results?.length === 0) {
        console.log('No migrations to apply');
        return;
    }

    results?.forEach((result) => {
        if (result.status === 'Success') {
            console.log(`Migration ${result.migrationName} applied successfully`);
        } else {
            console.error(`Failed to execute migration ${result.migrationName}`);
        }
    });
};

export async function migrateDown() {
    const { error, results } = await migrator.migrateDown();

    if (error) {
        throw error;
    }

    if (results?.length === 0) {
        console.log('No migrations to roll back');
        return;
    }

    results?.forEach((result) => {
        if (result.status === 'Success') {
            console.log(`Migration ${result.migrationName} rolled back successfully`);
        } else {
            console.error(`Failed to roll back migration ${result.migrationName}`);
        }
    });
};

export async function migrateDownAll() {
    const migrations = await migrator.getMigrations();

    if (migrations.length === 0) {
        console.log('No migrations to roll back');
        return;
    }

    await Promise.all(migrations.map(() => migrateDown()));
}
