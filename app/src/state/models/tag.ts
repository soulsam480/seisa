import type { TagModel } from '@seisa/api/src/schema'
import type { TagsStore } from '../store/tags'

export class Tag {
  id: number
  name: string
  color: string
  deleted_at: string | null

  constructor(
    readonly store: TagsStore,
    tag: TagModel,
  ) {
    this.id = tag.id
    this.name = tag.name
    this.color = tag.color
    this.deleted_at = tag.deleted_at
  }
}

export type TagForm = Omit<TagModel, 'id' | 'deleted_at'>
