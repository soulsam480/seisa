import { logger } from '@seisa/shared/src/logger'
import type { AppStore } from '../store'

export interface IRecord {
  id: number
  discarded_at?: string | null
}

export abstract class Store<S extends IRecord, I> {
  is_busy = false
  is_fetching = false

  items: S[] = []

  constructor(readonly app_store: AppStore) { }

  abstract get_all(): Promise<boolean>
  abstract insert(item: I): Promise<boolean>
  abstract update(item: S): Promise<boolean>
  abstract delete(item: S): Promise<boolean>

  /**
   * wrap a state action with error handling
   */
  async action(cb: () => Promise<void>) {
    this.is_busy = true

    try {
      await cb()
      return true
    }
    catch (error) {
      this.app_store.handle_db_error(error)
      logger.error(error)

      return false
    }
    finally {
      this.is_busy = false
      this.is_fetching = false
    }
  }

  async init() {
    await this.get_all()
  }
}
