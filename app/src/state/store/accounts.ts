import { db } from '@seisa/api/src/client'
import type { NewAccount } from '@seisa/api/src/schema'
import { Store } from '../lib/Store'
import { Account } from '../models/account'

export class AccountsStore extends Store<Account, NewAccount> {
  async get_all() {
    return await this.action(async () => {
      const accounts = await db.selectFrom('accounts')
        .where('deleted_at', 'is', null)
        .selectAll()
        .execute()

      this.items = accounts.map(account => new Account(this, account))
    })
  }

  async insert(account: NewAccount) {
    return this.action(async () => {
      const newAccount = await db.insertInto('accounts')
        .values(account)
        .returningAll()
        .executeTakeFirstOrThrow()

      this.items.push(new Account(this, newAccount))
    })
  }

  async update(account: Account) {
    return this.action(async () => {
      const updatedAccount = await db.updateTable('accounts')
        .where('id', '=', account.id)
        .set({
          account_no: account.account_no,
          name: account.name,
          bank: account.bank,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      Object.assign(account, {
        account_no: updatedAccount.account_no,
        name: updatedAccount.name,
        bank: updatedAccount.bank,
      })
    })
  }

  async delete(account: Account) {
    return this.action(async () => {
      const updated = await db.updateTable('accounts')
        .where('id', '=', account.id)
        .set({ deleted_at: new Date().toISOString() })
        .returning('deleted_at')
        .executeTakeFirstOrThrow()

      Object.assign(account, {
        deleted_at: updated.deleted_at,
      })

      this.items.splice(this.items.indexOf(account), 1)
    })
  }
}
