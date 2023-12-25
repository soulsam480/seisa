import type { Kysely, Migration } from 'kysely'

export const Migration1703481833836renamedatefields: Migration = {
  async up(db: Kysely<any>) {
    await db.schema.alterTable('reminders')
      .renameColumn('date', 'trigger_at')
      .execute()

    await db.schema.alterTable('reminders')
      .renameColumn('last_reminder', 'last_triggered_at')
      .execute()

    await db.schema.alterTable('reminders')
      .renameColumn('next_reminder', 'next_trigger_at')
      .execute()

    await db.schema.alterTable('incomes')
      .renameColumn('date', 'credited_at')
      .execute()

    await db.schema.alterTable('expenses')
      .renameColumn('date', 'debited_at')
      .execute()

    await db.schema.alterTable('transactions')
      .renameColumn('date', 'transaction_at')
      .execute()
  },
  async down(db: Kysely<any>) {
    await db.schema.alterTable('reminders')
      .renameColumn('trigger_at', 'date')
      .execute()

    await db.schema.alterTable('reminders')
      .renameColumn('last_triggered_at', 'last_reminder')
      .execute()

    await db.schema.alterTable('reminders')
      .renameColumn('next_trigger_at', 'next_reminder')
      .execute()

    await db.schema.alterTable('incomes')
      .renameColumn('credited_at', 'date')
      .execute()

    await db.schema.alterTable('expenses')
      .renameColumn('debited_at', 'date')
      .execute()

    await db.schema.alterTable('transactions')
      .renameColumn('transaction_at', 'date')
      .execute()
  },
}
