import type { Logger } from 'kysely'
import { Kysely } from 'kysely'
import { SQLocalKysely } from 'sqlocal/kysely'
import colors from 'tiny-colors'
import type { Database } from './schema'
import { DataTypePlugin } from './plugins/dataType'

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

async function deleteDB() {
  let opfsRoot = await window.navigator.storage.getDirectory()

  const parts = databasePath.split('/')

  for (let index = 0; index < parts.length; index++) {
    const element = parts[index]

    const isLast = index === parts.length - 1

    if (isLast) {
      await opfsRoot.removeEntry(element)
      break
    }

    opfsRoot = await opfsRoot.getDirectoryHandle(element)
  }
}

const { dialect, sql, destroy } = new SQLocalKysely(databasePath)

const db = new Kysely<Database>({ dialect, log: kyselyLogger, plugins: [new DataTypePlugin()] })

export { sql, db, destroy, deleteDB }
