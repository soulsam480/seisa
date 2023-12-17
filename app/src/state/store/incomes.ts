import { logger } from '@seisa/shared/src/logger'
import type { NewIncome } from '@seisa/api/src/schema'
import { db } from '@seisa/api/src/client'
import { Income } from '../models/income'
import type { AppStore } from '.'

export class IncomesStore {
  all_incomes: Income[] = []
  is_busy = false

  constructor(readonly app_store: AppStore) { }

  get incomes() {
    return this.all_incomes.filter(income => income.deleted_at === null)
  }

  async fetch_incomes() {
    this.is_busy = true

    try {
      const incomes = await db.selectFrom('incomes').selectAll().execute()

      this.all_incomes = incomes.map(income => new Income(this, income))
    }
    catch (error) {
      logger.error('Error fetching incomes: ', error)
    }
    finally {
      this.is_busy = false
    }
  }

  async add_income(income: NewIncome) {
    this.is_busy = true

    try {
      const new_income = await db.insertInto('incomes')
        .values(income)
        .returning(['id as id', 'name as name', 'amount as amount', 'date as date', 'active as active', 'recurring as recurring', 'category as category', 'from as from', 'tags as tags', 'notes as notes', 'deleted_at as deleted_at', 'account_id as account_id', 'reminder_id as reminder_id'])
        .executeTakeFirstOrThrow()

      this.all_incomes.push(new Income(this, new_income))

      return true
    }
    catch (error) {
      logger.error('Error adding income: ', error)

      return false
    }
    finally {
      this.is_busy = false
    }
  }

  async init() {
    await this.fetch_incomes()
  }
}
