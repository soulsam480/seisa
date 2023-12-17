import type { IncomeCategory, IncomeModel } from '@seisa/api/src/schema'
import type { IncomesStore } from '../store/incomes'

export class Income {
  id: number
  name: string
  amount: number
  date: string
  active: boolean
  recurring: boolean
  category: IncomeCategory | null
  from: string | null
  tags: string | null
  notes: string | null
  deleted_at: string | null

  //   account_id: number | null
  //   reminder_id: number | null

  constructor(
    readonly store: IncomesStore,
    income: IncomeModel,
  ) {
    this.id = income.id
    this.name = income.name
    this.amount = income.amount
    this.date = income.date
    this.active = income.active
    this.recurring = income.recurring
    this.category = income.category
    this.from = income.from
    this.tags = income.tags
    this.notes = income.notes
    this.deleted_at = income.deleted_at
  }
}
