import { db } from '@seisa/api/src/client'
import { logger } from '@seisa/shared/src/logger'
import { Tag } from '../models/tag'
import type { AppStore } from '.'

export class TagsStore {
  all_tags: Tag[] = []
  is_busy = false

  constructor(readonly app_store: AppStore) { }

  get tags() {
    return this.all_tags.filter(tag => tag.deleted_at === null)
  }

  async fetch_tags() {
    this.is_busy = true

    try {
      const tags = await db.selectFrom('tags').selectAll().execute()

      this.all_tags = tags.map(tag => new Tag(this, tag))
    }
    catch (error) {
      logger.error('Error fetching tags: ', error)
    }
    finally {
      this.is_busy = false
    }
  }

  async init() {
    await this.fetch_tags()
  }
}
