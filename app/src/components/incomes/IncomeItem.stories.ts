import type { Meta, StoryObj } from '@storybook/vue3'
import { incomeFactory } from '../../stories/data/income.factory'
import IncomeItem from './IncomeItem.vue'

const income = incomeFactory.build()

type Story = StoryObj<typeof IncomeItem>

export const Primary: Story = {
  args: {
    income,
  },
}

const meta: Meta<typeof IncomeItem> = {
  title: 'Components/Incomes/IncomeItem',
  component: IncomeItem,
}

export default meta
