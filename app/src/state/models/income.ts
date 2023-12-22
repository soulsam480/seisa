import type { IncomeCategory, IncomeModel, NewIncome } from '@seisa/api/src/schema'
import type { OverrideProperties, SetNonNullable } from 'type-fest'
import type { IncomesStore } from '../store/incomes'
import { Tag } from './tag'

export class Income {
  id: number
  name: string
  amount: number
  date: Date
  active: boolean
  recurring: boolean
  category: IncomeCategory | null
  from: string | null
  tags: string | null
  notes: string | null
  deleted_at: string | null
  account_id: number | null

  //   reminder_id: number | null

  constructor(
    readonly store: IncomesStore,
    income: IncomeModel,
  ) {
    this.id = income.id
    this.name = income.name
    this.amount = income.amount
    this.date = new Date(income.date)
    this.active = income.active
    this.recurring = income.recurring
    this.category = income.category
    this.from = income.from
    this.tags = income.tags
    this.notes = income.notes
    this.deleted_at = income.deleted_at
    this.account_id = income.account_id
  }

  get tag_ids(): number[] {
    if (this.tags === null)
      return []

    return this.tags.split(Tag.DELIMITER).map(tag_id => Number(tag_id))
  }

  get serialized_tags(): Tag[] {
    if (this.tags === null)
      return []

    return this.store.app_store.tags_store.tags.filter(tag => this.tag_ids.includes(tag.id))
  }

  get account() {
    return this.store.app_store.accounts_store.accounts.find(account => account.id === this.account_id) ?? null
  }

  static toDBPayload(income: IncomeForm): NewIncome {
    if (income.date === undefined)
      throw new Error('Date is undefined')

    return {
      ...income,
      tags: income.tags.join(Tag.DELIMITER),
      date: income.date.toISOString(),
    }
  }

  static toFormPayload(income: Income): IncomeForm {
    return {
      ...income,
      tags: income.tag_ids,
      date: new Date(income.date),
      category: income.category ?? 'credit',
    }
  }
}

export type IncomeForm = OverrideProperties<SetNonNullable<Omit<NewIncome, 'id' | 'reminder_id' | 'deleted_at'>, 'category'>, {
  tags: number[]
  date: Date | undefined
}>

export const DEFAULT_INCOME: IncomeForm = {
  active: true,
  amount: 0,
  name: '',
  recurring: false,
  account_id: undefined,
  category: 'credit',
  from: '',
  notes: '',
  tags: [],
}
