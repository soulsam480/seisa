import { reactive } from 'vue'
import { AccountsStore } from './accounts'
import { IncomesStore } from './incomes'
import { TagsStore } from './tags'

export class AppStore {
  accounts_store: AccountsStore
  incomes_store: IncomesStore
  tags_store: TagsStore

  constructor() {
    this.accounts_store = new AccountsStore(this)
    this.incomes_store = new IncomesStore(this)
    this.tags_store = new TagsStore(this)
  }

  async init() {
    await Promise.all([
      this.accounts_store.init(),
      this.incomes_store.init(),
      this.tags_store.init(),
    ])
  }
}

export const appStore = reactive(new AppStore())

appStore.init()
