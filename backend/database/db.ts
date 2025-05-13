import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';

import { Database } from './schema';

const dialect = new SqliteDialect({
    database: new SQLite('db.sqlite'),
});

export const db = new Kysely<Database>({ dialect });
