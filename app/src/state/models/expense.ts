import type { ExpenseCategory, ExpenseModel, ExpenseUpdate, NewExpense } from '@seisa/api/src/schema'
import { Form } from '../lib/Form'
import type { ExpensesStore } from '../store/expense'
import { Tag } from './tag'

export class Expense {
  id!: number
  name!: string
  amount!: number
  debited_at!: Date
  is_active!: boolean
  is_recurring!: boolean
  category!: ExpenseCategory | null
  from!: string | null
  tags!: Tag[]
  notes!: string | null
  deleted_at!: Date | null
  account_id!: number | null
  reminder_id!: number | null

  constructor(
    readonly store: ExpensesStore,
    expense: ExpenseModel,
  ) {
    Object.assign(this, this.update_model_from_db(expense))
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

  get_db_payload(): ExpenseUpdate {
    return {
      account_id: this.account_id,
      is_active: this.is_active,
      amount: this.amount,
      category: this.category,
      debited_at: this.debited_at.toISOString(),
      from: this.from,
      name: this.name,
      notes: this.notes,
      is_recurring: this.is_recurring,
      reminder_id: this.reminder_id,
      tags: this.tag_ids.join(Tag.DELIMITER),
    }
  }

  get_form_payload(): ExpenseForm {
    return new ExpenseForm(this)
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

  update_model_from_db(expense: ExpenseModel) {
    this.id = expense.id
    this.name = expense.name
    this.amount = expense.amount
    this.debited_at = expense.debited_at as unknown as Date
    this.is_active = expense.is_active
    this.is_recurring = expense.is_recurring
    this.category = expense.category
    this.from = expense.from
    this.tags = this._serialize_tags(expense.tags)
    this.notes = expense.notes
    this.deleted_at = expense.deleted_at as unknown as Date
    this.account_id = expense.account_id
    this.reminder_id = expense.reminder_id
  }

  async delete() {
    return await this.store.delete(this)
  }

  async save() {
    return await this.store.update(this)
  }
}

export class ExpenseForm extends Form<Expense, NewExpense> {
  name: string
  amount: number
  is_active: boolean
  is_recurring: boolean
  tags: number[]
  category: ExpenseCategory
  from?: string
  notes?: string
  account_id?: number
  debited_at?: Date

  constructor(
    expense?: Expense | ExpenseForm,
  ) {
    super()

    this.name = expense?.name ?? ''
    this.amount = expense?.amount ?? 0
    this.is_active = expense?.is_active ?? true
    this.is_recurring = expense?.is_recurring ?? true
    this.category = expense?.category ?? 'transfer'
    this.from = expense?.from ?? ''
    this.notes = expense?.notes ?? ''
    this.account_id = expense?.account_id ?? undefined
    this.debited_at = expense?.debited_at

    this.tags = expense?.tags.map(it => typeof it === 'object' ? it.id : it) ?? []
  }

  get_model_update_payload() {
    if (this.debited_at === undefined)
      throw new Error('Date is required')

    const { tags, ...form } = this

    return {
      ...form,
      tag_ids: tags,
    }
  }

  get_insert_payload() {
    if (this.debited_at === undefined)
      throw new Error('Date is required')

    const { tag_ids, ...rest } = this.get_model_update_payload()

    return {
      ...rest,
      tags: tag_ids.join(Tag.DELIMITER),
      debited_at: this.debited_at.toISOString(),
    }
  }
}
