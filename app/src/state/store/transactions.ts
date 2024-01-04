import type { NewTransaction } from '@seisa/api/src/schema'
import { db } from '@seisa/api/src/client'
import { toRaw } from 'vue'
import { Store } from '../lib/Store'
import { Transaction } from '../models/transaction'

export class TransactionsStore extends Store<Transaction, NewTransaction> {
  // TODO: paginate
  async get_all() {
    return await this.action(async () => {
      const transactions = await db.selectFrom('transactions')
        .where('deleted_at', 'is', null)
        .selectAll()
        .execute()

      this.items = transactions.map(transaction => new Transaction(this, transaction))
    })
  }

  async insert(transaction: NewTransaction) {
    return await this.action(async () => {
      const new_transaction = await db.insertInto('transactions')
        .values(transaction)
        .returningAll()
        .executeTakeFirstOrThrow()

      this.items.push(new Transaction(this, new_transaction))
    })
  }

  async update(transaction: Transaction) {
    return await this.action(async () => {
      const updated_transaction = await db.updateTable('transactions')
        .where('id', '=', transaction.id)
        .set({
          ...toRaw(transaction).get_db_payload(),
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      transaction.update_model_from_db(updated_transaction)
    })
  }

  async delete(transaction: Transaction) {
    return await this.action(async () => {
      const updated = await db.updateTable('transactions')
        .where('id', '=', transaction.id)
        .set({ deleted_at: new Date().toISOString() })
        .returning('deleted_at')
        .executeTakeFirstOrThrow()

      Object.assign(transaction, {
        deleted_at: updated.deleted_at,
      })

      this.items.splice(this.items.indexOf(transaction), 1)
    })
  }
}
