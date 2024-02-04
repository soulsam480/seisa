import type {
  ExpenseCategory,
  IncomeCategory,
  NewTransaction,
  TransactionModel,
  TransactionType,
  TransactionUpdate,
} from '@seisa/api/src/schema'
import { Form } from '../lib/Form'
import type { TransactionsStore } from '../store/transactions'
import { EXPENSE_CATEGORY, INCOME_CATEGORY } from '../../lib/constants'
import { Tag } from './tag'

export class Transaction {
  id!: number
  name!: string
  amount!: number
  transaction_at!: Date
  type!: TransactionType
  is_active!: boolean
  is_recurring!: boolean
  category!: ExpenseCategory | IncomeCategory | null
  from!: string | null
  tags!: Tag[]
  notes!: string | null
  deleted_at!: Date | null

  // FOREIGN KEYS
  account_id!: number | null
  income_id!: number | null
  expense_id!: number | null

  constructor(
    readonly store: TransactionsStore,
    transaction: TransactionModel,
  ) {
    Object.assign(this, this.update_model_from_db(transaction))
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

  get_db_payload(): TransactionUpdate {
    return {
      account_id: this.account_id,
      is_active: this.is_active,
      amount: this.amount,
      category: this.category,
      from: this.from,
      name: this.name,
      notes: this.notes,
      is_recurring: this.is_recurring,
      tags: this.tag_ids.join(Tag.DELIMITER),
      expense_id: this.expense_id,
      income_id: this.income_id,
      transaction_at: this.transaction_at.toISOString(),
      type: this.type,
    }
  }

  get_form_payload(): TransactionForm {
    return new TransactionForm(this)
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

  update_model_from_db(transaction: TransactionModel) {
    this.id = transaction.id
    this.name = transaction.name
    this.amount = transaction.amount
    this.is_active = transaction.is_active
    this.is_recurring = transaction.is_recurring
    this.category = transaction.category
    this.from = transaction.from
    this.tags = this._serialize_tags(transaction.tags)
    this.notes = transaction.notes
    this.deleted_at = transaction.deleted_at as unknown as Date
    this.account_id = transaction.account_id
    this.expense_id = transaction.expense_id
    this.income_id = transaction.income_id
    this.transaction_at = transaction.transaction_at as unknown as Date
    this.type = transaction.type
  }

  async delete() {
    return await this.store.delete(this)
  }

  async save() {
    return await this.store.update(this)
  }

  static TYPES: TransactionType[] = ['credit', 'debit'] as const

  static CATEGORIES: (ExpenseCategory | IncomeCategory)[] = [...EXPENSE_CATEGORY, ...INCOME_CATEGORY] as const
}

export class TransactionForm extends Form<Transaction, NewTransaction> {
  name: string
  amount: number
  type: TransactionType
  is_active: boolean
  is_recurring: boolean
  tags: number[]
  category?: ExpenseCategory | IncomeCategory
  from?: string
  notes?: string
  transaction_at?: Date

  // FOREIGN KEYS
  account_id?: number
  income_id?: number
  expense_id?: number

  constructor(
    transaction?: Partial<Transaction | TransactionForm>,
  ) {
    super()

    this.name = transaction?.name ?? ''
    this.amount = transaction?.amount ?? 0
    this.is_active = transaction?.is_active ?? true
    this.is_recurring = transaction?.is_recurring ?? false
    this.category = transaction?.category ?? 'food_and_drinks'
    this.from = transaction?.from ?? ''
    this.notes = transaction?.notes ?? ''
    this.category = transaction?.category ?? undefined
    this.from = transaction?.from ?? undefined
    this.notes = transaction?.notes ?? undefined
    this.transaction_at = transaction?.transaction_at ?? undefined
    this.type = transaction?.type ?? 'debit'

    this.account_id = transaction?.account_id ?? undefined
    this.income_id = transaction?.income_id ?? undefined
    this.expense_id = transaction?.expense_id ?? undefined

    this.tags = transaction?.tags?.map(it => typeof it === 'object' ? it.id : it) ?? []
  }

  get_model_update_payload() {
    if (this.transaction_at === undefined)
      throw new Error('Date is required')

    const { tags, ...form } = this

    return {
      ...form,
      tag_ids: tags,
    }
  }

  get_insert_payload() {
    if (this.transaction_at === undefined)
      throw new Error('Date is required')

    const { tag_ids, ...rest } = this.get_model_update_payload()

    return {
      ...rest,
      tags: tag_ids.join(Tag.DELIMITER),
      transaction_at: this.transaction_at.toISOString(),
    }
  }
}
