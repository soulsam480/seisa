import type { ExpenseCategory, IncomeCategory } from '@seisa/api/src/schema'

export const INCOME_CATEGORY: IncomeCategory[] = [
  'bank_deposit',
  'transfer',
  'bill',
  'business',
  'credit',
  'interest',
  'investment',
  'loan',
  'recharge',
  'refund',
  'reimbursement',
  'rewards',
  'salary',
  'unknown',
]

export const EXPENSE_CATEGORY: ExpenseCategory[] = [
  'food_and_drinks',
  'bills',
  'emi',
  'entertainment',
  'fuel',
  'grocery',
  'health',
  'investment',
  'other',
  'shopping',
  'transfer',
  'travel',
]
