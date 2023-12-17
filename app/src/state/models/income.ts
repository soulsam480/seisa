import type { IncomeCategory, IncomeModel, NewIncome } from '@seisa/api/src/schema'
import type { OverrideProperties, SetNonNullable } from 'type-fest'
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

export type IncomeForm = OverrideProperties<SetNonNullable<Omit<NewIncome, 'id' | 'reminder_id' | 'deleted_at'>, 'category'>, {
  tags: string[]
}>

export const DEFAULT_INCOME: IncomeForm = {
  active: true,
  amount: 0,
  date: '',
  name: '',
  recurring: false,
  account_id: null,
  category: 'credit',
  from: '',
  notes: '',
  tags: [],
}
