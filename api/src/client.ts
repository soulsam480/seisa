import type { Logger } from 'kysely'
import { Kysely } from 'kysely'
import { SQLocalKysely } from 'sqlocal/kysely'
import colors from 'tiny-colors'
import type { Database } from './schema'

const kyselyLogger: Logger = (event) => {
  switch (event.level) {
    case 'error':
      console.error(colors.bgBlack.red.bold('[KYSELY ERROR]'), event.error)
      break

    case 'query':
      // eslint-disable-next-line no-console
      console.log(colors.bgBlack.magenta.bold('[KYSELY QUERY]'), event.query.sql, 'took', `${event.queryDurationMillis.toFixed(1)}ms`)
      break
  }
}

const databasePath = import.meta.env.PROD ? 'db.sqlite3' : 'development/db.sqlite3'

const { dialect, sql, destroy } = new SQLocalKysely(databasePath)

const db = new Kysely<Database>({ dialect, log: kyselyLogger })

export { sql, db, destroy }
