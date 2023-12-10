import type { TIncomeType, TSavingDebitType } from '../types'

export const INCOME_TYPES: ReadonlyArray<TIncomeType> = [
  'salary',
  'other',
] as const

export const SAVING_DEBIT_TYPES: ReadonlyArray<TSavingDebitType> = [
  'monthly',
  'yearly',
]
