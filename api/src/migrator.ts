import { Migrator } from 'kysely'
import { db } from './client'

export const migrator = new Migrator({
  db,
  provider: {
    async getMigrations() {
      const { migrations } = await import('./migrations/index')

      return migrations
    },
  },
})

export async function migrateDownToBase() {
  const migrations = await migrator.getMigrations()

  for (const _ of migrations)
    await migrator.migrateDown()

  await migrator.migrateDown()
}

export async function migrateUpToLatest() {
  const migrations = await migrator.getMigrations()

  await migrator.migrateUp()

  for (const _ of migrations)
    await migrator.migrateUp()
}
