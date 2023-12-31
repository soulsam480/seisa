import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import type { IncomeModel } from '@seisa/api/src/schema'
import { Income } from '../../state/models/income'
import { storyAppStore } from './store'

export const incomeFactory = Factory.define<Income, IncomeModel>(({ sequence, transientParams }) => {
  const income = new Income(storyAppStore.incomes_store, {
    id: sequence,
    amount: Number(faker.finance.amount()),
    credited_at: faker.date.past().toISOString(),
    account_id: 1,
    category: 'credit',
    deleted_at: null,
    from: faker.finance.accountName(),
    is_active: true,
    is_recurring: false,
    name: faker.internet.displayName(),
    notes: faker.lorem.paragraph(),
    reminder_id: null,
    tags: '',
    ...transientParams,
  })

  return income
})
