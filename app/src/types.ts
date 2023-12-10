export type TIncomeType = 'salary' | 'other'

export interface IIncome {
  name: string
  amount: number
  type: TIncomeType
  credit_on: number | undefined
}

export type TSavingDebitType = 'monthly' | 'yearly'

export interface ISaving {
  name: string
  amount: number
  last_debit_on: string | undefined
  debit_type: TSavingDebitType
  debit_on: number | undefined
  reminder: boolean
}
