import type { Kysely, Migration } from 'kysely'

export const Migration1702229907264addexpenses: Migration = {
  async up(db: Kysely<any>) {
    await db.schema
      .createTable('expenses')
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('account_id', 'integer', (col) => {
        return col.references('accounts.id').onDelete('set null')
      })
      .addColumn('name', 'text', col => col.notNull())
      .addColumn('amount', 'integer', col => col.notNull())
      .addColumn('date', 'text', col => col.notNull())
      .addColumn('category', 'text')
      .addColumn('from', 'text')
      .addColumn('notes', 'text')
      .addColumn('tags', 'text', col => col.defaultTo(''))
      .addColumn('active', 'boolean', col => col.notNull().defaultTo(true))
      .addColumn('recurring', 'boolean', col =>
        col.notNull().defaultTo(false))
      .addColumn('reminder_id', 'integer', col =>
        col.references('reminders.id').onDelete('set null'))
      .addColumn('deleted_at', 'text')
      .execute()
  },
  async down(db: Kysely<any>) {
    await db.schema.dropTable('expenses').execute()
  },
}
