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

export type IncomeCatrgory =
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
  date: string

  // OPTIONAL
  active: boolean
  recurring: boolean
  category: IncomeCatrgory | null
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
  date: string

  // OPTIONAL
  notify: boolean
  last_reminder: string | null
  next_reminder: string | null
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
  date: string

  // OPTIONAL
  active: boolean
  recurring: boolean
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

type TransactionType = 'credit' | 'debit'

export interface TransactionsTable {
  id: Generated<number>
  name: string
  amount: number
  date: string
  type: TransactionType
  active: boolean
  recurring: boolean

  // OPTIONAL
  category: ExpenseCategory | IncomeCatrgory | null
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

export interface Database {
  accounts: AccountsTable
  incomes: IncomesTable
  reminders: RemindersTable
  expenses: ExpensesTable
  transactions: TransactionsTable
}
