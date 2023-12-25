import type { Migration } from 'kysely';
import { Migration1702223954017addaccounts } from './1702223954017_add_accounts';
import { Migration1702229749409addreminders } from './1702229749409_add_reminders';
import { Migration1702229794346addincomes } from './1702229794346_add_incomes';
import { Migration1702229907264addexpenses } from './1702229907264_add_expenses';
import { Migration1702230369252addtransactions } from './1702230369252_add_transactions';
import { Migration1702806444521addtags } from './1702806444521_add_tags';
import { Migration1703480563796renamebooleanfields } from './1703480563796_rename_boolean_fields';
import { Migration1703481833836renamedatefields } from './1703481833836_rename_date_fields';
//IMPORT

export const migrations: Record<string, Migration> = {
  1702223954017: Migration1702223954017addaccounts,
  1702229749409: Migration1702229749409addreminders,
  1702229794346: Migration1702229794346addincomes,
  1702229907264: Migration1702229907264addexpenses,
  1702230369252: Migration1702230369252addtransactions,
  1702806444521: Migration1702806444521addtags,
  1703480563796: Migration1703480563796renamebooleanfields,
  1703481833836: Migration1703481833836renamedatefields,
  //REGISTER
};
