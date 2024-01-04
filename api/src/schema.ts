import type { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface AccountsTable {
  id: Generated<number>
  name: string
  account_no: string | null
  bank: string | null
  deleted_at: string | null
}

export type AccountModel = Selectable<AccountsTable>
export type NewAccount = Insertable<AccountsTable>
export type AccountUpdate = Updateable<AccountsTable>

export type IncomeCategory =
  'bank_deposit' |
  'transfer' |
  'bill' |
  'business' |
  'credit' |
  'interest' |
  'investment' |
  'loan' |
  'recharge' |
  'refund' |
  'reimbursement' |
  'rewards' |
  'salary' |
  'unknown'

export interface IncomesTable {
  id: Generated<number>
  name: string
  amount: number
  credited_at: string

  // OPTIONAL
  is_active: boolean
  is_recurring: boolean
  category: IncomeCategory | null
  from: string | null
  tags: string | null
  notes: string | null
  deleted_at: string | null

  // FOREIGN KEYS
  account_id: Generated<number> | null
  reminder_id: Generated<number> | null
}

export type IncomeModel = Selectable<IncomesTable>
export type NewIncome = Insertable<IncomesTable>
export type IncomeUpdate = Updateable<IncomesTable>

export interface RemindersTable {
  id: Generated<number>
  interval: string
  trigger_at: string

  // OPTIONAL
  is_notify: boolean
  last_triggered_at: string | null
  next_trigger_at: string | null
  deleted_at: string | null

  // FOREIGN KEYS
  income_id: Generated<number> | null
  expense_id: Generated<number> | null
}

export type ReminderModel = Selectable<RemindersTable>
export type NewReminder = Insertable<RemindersTable>
export type ReminderUpdate = Updateable<RemindersTable>

export type ExpenseCategory =
  'food_and_drinks' |
  'bills' |
  'emi' |
  'entertainment' |
  'fuel' |
  'grocery' |
  'health' |
  'investment' |
  'other' |
  'shopping' |
  'transfer' |
  'travel'

export interface ExpensesTable {
  id: Generated<number>
  name: string
  amount: number
  debited_at: string

  // OPTIONAL
  is_active: boolean
  is_recurring: boolean
  category: ExpenseCategory | null
  from: string | null
  tags: string | null
  notes: string | null
  deleted_at: string | null

  // FOREIGN KEYS
  account_id: Generated<number> | null
  reminder_id: Generated<number> | null
}

export type ExpenseModel = Selectable<ExpensesTable>
export type NewExpense = Insertable<ExpensesTable>
export type ExpenseUpdate = Updateable<ExpensesTable>

export type TransactionType = 'credit' | 'debit'

export interface TransactionsTable {
  id: Generated<number>
  name: string
  amount: number
  transaction_at: string
  type: TransactionType
  is_active: boolean
  is_recurring: boolean

  // OPTIONAL
  category: ExpenseCategory | IncomeCategory | null
  from: string | null
  tags: string | null
  notes: string | null
  deleted_at: string | null

  // FOREIGN KEYS
  account_id: Generated<number> | null
  income_id: Generated<number> | null
  expense_id: Generated<number> | null
}

export type TransactionModel = Selectable<TransactionsTable>
export type NewTransaction = Insertable<TransactionsTable>
export type TransactionUpdate = Updateable<TransactionsTable>

export interface TagsTable {
  id: Generated<number>
  name: string
  color: string
  deleted_at: string | null
}

export type TagModel = Selectable<TagsTable>
export type NewTag = Insertable<TagsTable>
export type TagUpdate = Updateable<TagsTable>

export interface Database {
  accounts: AccountsTable
  incomes: IncomesTable
  reminders: RemindersTable
  expenses: ExpensesTable
  transactions: TransactionsTable
  tags: TagsTable
}
