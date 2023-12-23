import type { AccountModel } from '@seisa/api/src/schema'
import type { AccountsStore } from '../store/accounts'

export class Account {
  readonly id: number
  name: string
  account_no: string | null
  bank: string | null
  deleted_at: string | null

  constructor(
    readonly store: AccountsStore,
    account: AccountModel,
  ) {
    this.id = account.id
    this.name = account.name
    this.account_no = account.account_no
    this.bank = account.bank
    this.deleted_at = account.deleted_at
  }

  async delete() {
    return await this.store.delete(this)
  }

  async save() {
    return await this.store.update(this)
  }
}
