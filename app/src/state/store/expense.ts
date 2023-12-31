import { db } from '@seisa/api/src/client'
import type { NewExpense } from '@seisa/api/src/schema'
import { toRaw } from 'vue'
import { Store } from '../lib/Store'
import { Expense } from '../models/expense'

export class ExpensesStore extends Store<Expense, NewExpense> {
  async get_all() {
    return await this.action(async () => {
      const expenses = await db.selectFrom('expenses')
        .where('deleted_at', 'is', null)
        .selectAll()
        .execute()

      this.items = expenses.map(expense => new Expense(this, expense))
    })
  }

  async insert(expense: NewExpense) {
    return await this.action(async () => {
      const new_expense = await db.insertInto('expenses')
        .values(expense)
        .returningAll()
        .executeTakeFirstOrThrow()

      this.items.push(new Expense(this, new_expense))
    })
  }

  async update(expense: Expense) {
    return await this.action(async () => {
      const updated_expense = await db.updateTable('expenses')
        .where('id', '=', expense.id)
        .set({
          ...toRaw(expense).get_db_payload(),
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      expense.update_model_from_db(updated_expense)
    })
  }

  async delete(expense: Expense) {
    return await this.action(async () => {
      const updated = await db.updateTable('expenses')
        .where('id', '=', expense.id)
        .set({ deleted_at: new Date().toISOString() })
        .returning('deleted_at')
        .executeTakeFirstOrThrow()

      Object.assign(expense, {
        deleted_at: updated.deleted_at,
      })

      this.items.splice(this.items.indexOf(expense), 1)
    })
  }
}
