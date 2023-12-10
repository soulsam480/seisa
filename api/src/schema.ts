import { Generated } from 'kysely';

interface AccountsTable {
  id: Generated<number>;
  name: string;
  account_no: string | null;
  bank: string | null;
  deleted_at: string | null;
}

export interface Database {
  accounts: AccountsTable
}
