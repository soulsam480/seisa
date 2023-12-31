import { reactive } from 'vue'
import { ElNotification } from 'element-plus'
import { AccountsStore } from './accounts'
import { IncomesStore } from './incomes'
import { TagsStore } from './tags'
import { ExpensesStore } from './expense'
import PhSkullLight from '~icons/ph/skull-light'

export class AppStore {
  initialized = false

  accounts_store: AccountsStore
  incomes_store: IncomesStore
  tags_store: TagsStore
  expenses_store: ExpensesStore

  constructor() {
    this.accounts_store = new AccountsStore(this)
    this.incomes_store = new IncomesStore(this)
    this.tags_store = new TagsStore(this)
    this.expenses_store = new ExpensesStore(this)
  }

  async init() {
    if (this.initialized)
      return

    await Promise.all([
      this.tags_store.init(),
      this.accounts_store.init(),
      this.incomes_store.init(),
      this.expenses_store.init(),
    ])

    this.initialized = true
  }

  handle_db_error(error: unknown) {
    if (error instanceof Error) {
      ElNotification.error({
        title: 'Database Error',
        message: error.message,
        icon: PhSkullLight,
      })
    }
  }
}

export const appStore = reactive(new AppStore())

appStore.init()
