import type { Kysely, Migration } from 'kysely'

export const Migration1702806444521addtags: Migration = {
  async up(db: Kysely<any>) {
    await db.schema.createTable('tags')
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('name', 'text', col => col.notNull().unique())
      .addColumn('color', 'text', col => col.notNull())
      .addColumn('deleted_at', 'text')
      .execute()
  },
  async down(db: Kysely<any>) {
    await db.schema.dropTable('tags').execute()
  },
}
