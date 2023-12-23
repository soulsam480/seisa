import { db } from '@seisa/api/src/client'
import type { NewIncome } from '@seisa/api/src/schema'
import { toRaw } from 'vue'
import { Store } from '../lib/Store'
import { Income } from '../models/income'

export class IncomesStore extends Store<Income, NewIncome> {
  async get_all() {
    return await this.action(async () => {
      const incomes = await db.selectFrom('incomes')
        .where('deleted_at', 'is', null)
        .selectAll()
        .execute()

      this.items = incomes.map(income => new Income(this, income))
    })
  }

  async insert(income: NewIncome) {
    return await this.action(async () => {
      const new_income = await db.insertInto('incomes')
        .values(income)
        .returningAll()
        .executeTakeFirstOrThrow()

      this.items.push(new Income(this, new_income))
    })
  }

  async update(income: Income) {
    return await this.action(async () => {
      const updated_income = await db.updateTable('incomes')
        .where('id', '=', income.id)
        .set({
          ...toRaw(income).get_db_payload(),
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      income.update_model_from_db(updated_income)
    })
  }

  async delete(income: Income) {
    return await this.action(async () => {
      const updated = await db.updateTable('incomes')
        .where('id', '=', income.id)
        .set({ deleted_at: new Date().toISOString() })
        .returning('deleted_at')
        .executeTakeFirstOrThrow()

      Object.assign(income, {
        deleted_at: updated.deleted_at,
      })

      this.items.splice(this.items.indexOf(income), 1)
    })
  }
}
