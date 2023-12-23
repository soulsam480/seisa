import { db } from '@seisa/api/src/client'
import type { NewTag } from '@seisa/api/src/schema'
import { Store } from '../lib/Store'
import { Tag } from '../models/tag'

export class TagsStore extends Store<Tag, NewTag> {
  async get_all() {
    return await this.action(async () => {
      this.is_fetching = true

      const tags = await db.selectFrom('tags')
        .where('deleted_at', 'is', null)
        .selectAll()
        .execute()

      this.items = tags.map(tag => new Tag(this, tag))
    })
  }

  async insert(tag: NewTag) {
    return this.action(async () => {
      const new_tag = await db
        .insertInto('tags')
        .values({ ...tag, name: tag.name.trim().toLowerCase() })
        .returningAll()
        .executeTakeFirstOrThrow()

      this.items.push(new Tag(this, new_tag))
    })
  }

  async update(tag: Tag) {
    return this.action(async () => {
      const updated_tag = await db
        .updateTable('tags')
        .where('id', '=', tag.id)
        .set({ name: tag.name.trim().toLowerCase(), color: tag.color })
        .returningAll()
        .executeTakeFirstOrThrow()

      Object.assign(tag, {
        name: updated_tag.name,
        color: updated_tag.color,
      })
    })
  }

  async delete(tag: Tag) {
    return this.action(async () => {
      const updated = await db
        .updateTable('tags')
        .where('id', '=', tag.id)
        .set({ deleted_at: new Date().toISOString() })
        .returning('deleted_at')
        .executeTakeFirstOrThrow()

      Object.assign(tag, {
        deleted_at: updated.deleted_at,
      })

      this.items.splice(this.items.indexOf(tag), 1)
    })
  }
}
