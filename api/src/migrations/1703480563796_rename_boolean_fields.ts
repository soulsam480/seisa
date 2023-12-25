import type { Kysely, Migration } from 'kysely'

export const Migration1703480563796renamebooleanfields: Migration = {
  async up(db: Kysely<any>) {
    await db.schema.alterTable('reminders')
      .renameColumn('notify', 'is_notify')
      .execute()

    await db.schema.alterTable('incomes')
      .renameColumn('active', 'is_active')
      .execute()

    await db.schema.alterTable('incomes')
      .renameColumn('recurring', 'is_recurring')
      .execute()

    await db.schema.alterTable('expenses')
      .renameColumn('active', 'is_active')
      .execute()

    await db.schema.alterTable('expenses')
      .renameColumn('recurring', 'is_recurring')
      .execute()

    await db.schema.alterTable('transactions')
      .renameColumn('active', 'is_active')
      .execute()

    await db.schema.alterTable('transactions')
      .renameColumn('recurring', 'is_recurring')
      .execute()
  },
  async down(db: Kysely<any>) {
    await db.schema.alterTable('reminders')
      .renameColumn('is_notify', 'notify')
      .execute()

    await db.schema.alterTable('incomes')
      .renameColumn('is_active', 'active')
      .execute()

    await db.schema.alterTable('incomes')
      .renameColumn('is_recurring', 'recurring')
      .execute()

    await db.schema.alterTable('expenses')
      .renameColumn('is_active', 'active')
      .execute()

    await db.schema.alterTable('expenses')
      .renameColumn('is_recurring', 'recurring')
      .execute()

    await db.schema.alterTable('transactions')
      .renameColumn('is_active', 'active')
      .execute()

    await db.schema.alterTable('transactions')
      .renameColumn('is_recurring', 'recurring')
      .execute()
  },
}
