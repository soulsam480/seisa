import type { Kysely, Migration } from 'kysely';

export const Migration1702230369252addtransactions: Migration = {
  async up(db: Kysely<any>) {
    await db.schema
      .createTable('transactions')
      .addColumn('id', 'integer', (col) => col.primaryKey())

      .addColumn('account_id', 'integer', (col) => {
        return col.references('accounts.id').onDelete('set null');
      })
      .addColumn('income_id', 'integer', (col) =>
        col.references('incomes.id').onDelete('set null'),
      )
      .addColumn('expense_id', 'integer', (col) =>
        col.references('expenses.id').onDelete('set null'),
      )

      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('date', 'text', (col) => col.notNull())
      .addColumn('amount', 'integer', (col) => col.notNull())
      .addColumn('type', 'text', (col) => col.notNull())

      .addColumn('tags', 'text', (col) => col.defaultTo(''))
      .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
      .addColumn('recurring', 'boolean', (col) =>
        col.notNull().defaultTo(false),
      )

      .addColumn('category', 'text')
      .addColumn('from', 'text')
      .addColumn('notes', 'text')
      .addColumn('deleted_at', 'text')
      .execute();
  },
  async down(db: Kysely<any>) {
    await db.schema.dropTable('transactions').execute();
  },
};
