import type { Migration } from 'kysely';
import { Migration1702223954017addaccounts } from './1702223954017_add_accounts';
import { Migration1702229749409addreminders } from './1702229749409_add_reminders';
import { Migration1702229794346addincomes } from './1702229794346_add_incomes';
import { Migration1702229907264addexpenses } from './1702229907264_add_expenses';
import { Migration1702230369252addtransactions } from './1702230369252_add_transactions';
//IMPORT

export const migrations: Record<string, Migration> = {
  1702223954017: Migration1702223954017addaccounts,
  1702229749409: Migration1702229749409addreminders,
  1702229794346: Migration1702229794346addincomes,
  1702229907264: Migration1702229907264addexpenses,
  1702230369252: Migration1702230369252addtransactions,
  //REGISTER
};
