import { Kysely } from 'kysely'
import { SQLocalKysely } from 'sqlocal/kysely'
import type { Database } from './schema'

const databasePath = import.meta.env.PROD ? 'db.sqlite3' : 'development/db.sqlite3'

const { dialect, sql, destroy } = new SQLocalKysely(databasePath)

const db = new Kysely<Database>({ dialect })

export { sql, db, destroy }
