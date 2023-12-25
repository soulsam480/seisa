import type { IncomeCategory, IncomeModel, IncomeUpdate, NewIncome } from '@seisa/api/src/schema'
import type { IncomesStore } from '../store/incomes'
import { Form } from '../lib/Form'
import { Tag } from './tag'

export class Income {
  id!: number
  name!: string
  amount!: number
  credited_at!: Date
  is_active!: boolean
  is_recurring!: boolean
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

    return this.tags.map(tag => Number(tag.id))
  }

  set tag_ids(tag_ids: number[]) {
    this.tags = this.store.app_store.tags_store.items.filter(tag => tag_ids.includes(tag.id))
  }

  get account() {
    return this.store.app_store.accounts_store.items.find(account => account.id === this.account_id) ?? null
  }

  get_db_payload(): IncomeUpdate {
    return {
      account_id: this.account_id,
      is_active: this.is_active,
      amount: this.amount,
      category: this.category,
      credited_at: this.credited_at.toISOString(),
      from: this.from,
      name: this.name,
      notes: this.notes,
      is_recurring: this.is_recurring,
      reminder_id: this.reminder_id,
      tags: this.tag_ids.join(Tag.DELIMITER),
    }
  }

  get_form_payload(): IncomeForm {
    return new IncomeForm(this)
  }

  /**
   * @private
   */
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
    this.credited_at = income.credited_at as unknown as Date
    this.is_active = income.is_active
    this.is_recurring = income.is_recurring
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

export class IncomeForm extends Form<Income, NewIncome> {
  name: string
  amount: number
  is_active: boolean
  is_recurring: boolean
  tags: number[]
  category: IncomeCategory
  from?: string
  notes?: string
  account_id?: number
  credited_at?: Date

  constructor(
    income?: Income | IncomeForm,
  ) {
    super()

    this.name = income?.name ?? ''
    this.amount = income?.amount ?? 0
    this.is_active = income?.is_active ?? true
    this.is_recurring = income?.is_recurring ?? false
    this.category = income?.category ?? 'credit'
    this.from = income?.from ?? ''
    this.notes = income?.notes ?? ''
    this.account_id = income?.account_id ?? undefined
    this.credited_at = income?.credited_at

    this.tags = income?.tags.map(it => typeof it === 'object' ? it.id : it) ?? []
  }

  get_model_update_payload() {
    if (this.credited_at === undefined)
      throw new Error('Date is required')

    const { tags, ...form } = this

    return {
      ...form,
      tag_ids: tags,
    }
  }

  get_insert_payload() {
    if (this.credited_at === undefined)
      throw new Error('Date is required')

    const { tag_ids, ...rest } = this.get_model_update_payload()

    return {
      ...rest,
      tags: tag_ids.join(Tag.DELIMITER),
      credited_at: this.credited_at.toISOString(),
    }
  }
}
