import type { Kysely, Migration } from 'kysely';

export const Migration1702223954017setupbase: Migration = {
  async up(db: Kysely<any>) {
    await db.schema
      .createTable('accounts')
      .addColumn('id', 'integer', (col) => col.primaryKey())
      .addColumn('name', 'text', (col) => col.notNull())
      .addColumn('account_no', 'text')
      .addColumn('bank', 'text')
      .addColumn('deleted_at', 'text')
      .execute();
  },
  async down(db: Kysely<any>) {
    await db.schema.dropTable('accounts').execute();
  },
};
