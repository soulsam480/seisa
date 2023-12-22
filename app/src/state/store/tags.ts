import { db } from '@seisa/api/src/client'
import { logger } from '@seisa/shared/src/logger'
import type { NewTag } from '@seisa/api/src/schema'
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

      return true
    }
    catch (error) {
      this.app_store.handle_db_error(error)
      logger.error('Error fetching tags: ', error)

      return false
    }
    finally {
      this.is_busy = false
    }
  }

  async add_tag(tag: NewTag) {
    this.is_busy = true

    try {
      const new_tag = await db
        .insertInto('tags')
        .values({ ...tag, name: tag.name.trim().toLowerCase() })
        .returning(['id as id', 'name as name', 'color as color', 'deleted_at as deleted_at'])
        .executeTakeFirstOrThrow()

      this.all_tags.push(new Tag(this, new_tag))

      return true
    }
    catch (error) {
      this.app_store.handle_db_error(error)
      logger.error('Error adding tag: ', error)

      return false
    }
    finally {
      this.is_busy = false
    }
  }

  async init() {
    await this.fetch_tags()
  }
}
