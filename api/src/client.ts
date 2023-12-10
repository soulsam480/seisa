import { Kysely } from 'kysely';
import { SQLocalKysely } from 'sqlocal/kysely';
import type { Database } from './schema';

const { dialect } = new SQLocalKysely('database.sqlite3');

export const db = new Kysely<Database>({ dialect });
