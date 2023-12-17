import { db } from '@seisa/api/src/client'
import type { NewAccount } from '@seisa/api/src/schema'
import { logger } from '@seisa/shared/src/logger'
import { Account } from '../models/account'
import type { AppStore } from '.'

export class AccountsStore {
  /**
   * !Note:
   *
   * Contains deleted accounts as well.
   */
  all_accounts: Account[] = []
  is_busy = false

  constructor(readonly appStore: AppStore) { }

  /**
   * Only active accounts
   */
  get accounts() {
    return this.all_accounts.filter(account => account.deleted_at === null)
  }

  async fetch_accounts() {
    this.is_busy = true

    try {
      const accounts = await db.selectFrom('accounts').selectAll().execute()

      this.all_accounts = accounts.map(account => new Account(this, account))
    }
    catch (error) {
      logger.error('Error fetching accounts: ', error)
    }
    finally {
      this.is_busy = false
    }
  }

  async add_account(account: NewAccount) {
    this.is_busy = true

    try {
      const newAccount = await db.insertInto('accounts').values(account)
        .returning(['id as id', 'account_no as account_no', 'name as name', 'bank as bank', 'deleted_at as deleted_at'])
        .executeTakeFirstOrThrow()

      this.all_accounts.push(new Account(this, newAccount))

      return true
    }
    catch (error) {
      logger.error('Error adding account: ', error)

      return false
    }
    finally {
      this.is_busy = false
    }
  }

  async update_account(account: Account) {
    this.is_busy = true

    try {
      const updatedAccount = await db.updateTable('accounts')
        .where('id', '=', account.id).set({
          account_no: account.account_no,
          name: account.name,
          bank: account.bank,
        })
        .returning(['id as id', 'account_no as account_no', 'name as name', 'bank as bank', 'deleted_at as deleted_at'])
        .executeTakeFirstOrThrow()

      Object.assign(account, {
        account_no: updatedAccount.account_no,
        name: updatedAccount.name,
        bank: updatedAccount.bank,
      })

      return true
    }
    catch (error) {
      logger.error('Error updating account: ', error)

      return false
    }
    finally {
      this.is_busy = false
    }
  }

  async delete_account(account: Account) {
    this.is_busy = true

    try {
      const updated = await db.updateTable('accounts')
        .where('id', '=', account.id).set({ deleted_at: new Date().toISOString() })
        .returning(['id as id', 'account_no as account_no', 'name as name', 'bank as bank', 'deleted_at as deleted_at'])
        .executeTakeFirstOrThrow()

      account.deleted_at = updated.deleted_at

      return true
    }
    catch (error) {
      logger.error('Error deleting account: ', error)

      return false
    }
    finally {
      this.is_busy = false
    }
  }

  async init() {
    await this.fetch_accounts()
  }
}
