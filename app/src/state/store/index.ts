import { reactive } from 'vue'
import { AccountsStore } from './accounts'

export class AppStore {
  accountsStore: AccountsStore

  constructor() {
    this.accountsStore = new AccountsStore(this)
  }

  async init() {
    await Promise.all([
      this.accountsStore.init(),
    ])
  }
}

export const appStore = reactive(new AppStore())

appStore.init()
