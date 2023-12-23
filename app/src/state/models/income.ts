import type { IncomeCategory, IncomeModel, IncomeUpdate, NewIncome } from '@seisa/api/src/schema'
import type { IncomesStore } from '../store/incomes'
import { Form } from '../lib/Form'
import { Tag } from './tag'

export class Income {
  id!: number
  name!: string
  amount!: number
  date!: Date
  active!: boolean
  recurring!: boolean
  category!: IncomeCategory | null
  from!: string | null
  tags!: Tag[]
  notes!: string | null
  deleted_at!: string | null
  account_id!: number | null
  reminder_id!: number | null

  constructor(
    readonly store: IncomesStore,
    income: IncomeModel,
  ) {
    Object.assign(this, this.update_model_from_db(income))
  }

  get tag_ids(): number[] {
    if (this.tags === null)
      return []

    return this.tags.map(tag_id => Number(tag_id))
  }

  set tag_ids(tag_ids: number[]) {
    this.tags = this.store.app_store.tags_store.items.filter(tag => tag_ids.includes(tag.id))
  }

  get account() {
    return this.store.app_store.accounts_store.items.find(account => account.id === this.account_id) ?? null
  }

  get_db_payload(): IncomeUpdate {
    const { id: _id, ...rest } = this

    return {
      account_id: rest.account_id,
      active: rest.active,
      amount: rest.amount,
      category: rest.category,
      date: rest.date.toISOString(),
      from: rest.from,
      name: rest.name,
      notes: rest.notes,
      recurring: rest.recurring,
      reminder_id: rest.reminder_id,
      tags: rest.tags.map(tag => tag.id).join(Tag.DELIMITER),
    }
  }

  get_form_payload(): IncomeForm {
    return new IncomeForm(this)
  }

  _serialize_tags(tags: string | null) {
    if (tags === null)
      return []

    const tag_ids = tags.split(Tag.DELIMITER).map(tag_id => Number(tag_id))

    return this.store.app_store.tags_store.items.filter(tag => tag_ids.includes(tag.id))
  }

  update_model_from_db(income: IncomeModel) {
    this.id = income.id
    this.name = income.name
    this.amount = income.amount
    this.date = new Date(income.date)
    this.active = income.active
    this.recurring = income.recurring
    this.category = income.category
    this.from = income.from
    this.tags = this._serialize_tags(income.tags)
    this.notes = income.notes
    this.deleted_at = income.deleted_at
    this.account_id = income.account_id
    this.reminder_id = income.reminder_id
  }

  async delete() {
    return await this.store.delete(this)
  }

  async save() {
    return await this.store.update(this)
  }
}

export class IncomeForm extends Form {
  name: string
  amount: number
  active: boolean
  recurring: boolean
  tags: number[]
  category: IncomeCategory
  from?: string
  notes?: string
  account_id?: number
  date?: Date

  constructor(
    income?: Income,
  ) {
    super()

    this.name = income?.name ?? ''
    this.amount = income?.amount ?? 0
    this.active = income?.active ?? true
    this.recurring = income?.recurring ?? false
    this.tags = income?.tag_ids ?? []
    this.category = income?.category ?? 'credit'
    this.from = income?.from ?? ''
    this.notes = income?.notes ?? ''
    this.account_id = income?.account_id ?? undefined
    this.date = income?.date
  }

  get_update_payload() {
    if (this.date === undefined)
      throw new Error('Date is required')

    return {
      ...this,
    }
  }

  get_insert_payload(): NewIncome {
    if (this.date === undefined)
      throw new Error('Date is required')

    const { tags, ...rest } = this.get_update_payload()

    return {
      ...rest,
      tags: tags.join(Tag.DELIMITER),
      date: this.date.toISOString(),
    }
  }
}
