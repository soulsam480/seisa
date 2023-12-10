import type { Kysely, Migration } from 'kysely';

export const Migration1702229749409addreminders: Migration = {
  async up(db: Kysely<any>) {
    await db.schema
      .createTable('reminders')
      .addColumn('interval', 'text', (col) => col.notNull())
      .addColumn('date', 'text', (col) => col.notNull())
      .addColumn('last_reminder', 'text')
      .addColumn('next_reminder', 'text')
      .addColumn('notify', 'boolean', (col) => col.notNull().defaultTo(false))
      .addColumn('income_id', 'integer')
      .addColumn('expense_id', 'integer')
      .addColumn('deleted_at', 'text')
      .execute();
  },
  async down(db: Kysely<any>) {
    await db.schema.dropTable('reminders').execute();
  },
};
