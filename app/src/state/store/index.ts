import { reactive } from 'vue'
import { AccountsStore } from './accounts'
import { IncomesStore } from './incomes'

export class AppStore {
  accounts_store: AccountsStore
  incomes_store: IncomesStore

  constructor() {
    this.accounts_store = new AccountsStore(this)
    this.incomes_store = new IncomesStore(this)
  }

  async init() {
    await Promise.all([
      this.accounts_store.init(),
      this.incomes_store.init(),
    ])
  }
}

export const appStore = reactive(new AppStore())

appStore.init()
