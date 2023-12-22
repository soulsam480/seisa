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

  static generateRandomColor(): string {
    const letters = '0123456789ABCDEF'

    let color = '#'

    for (let i = 0; i < 6; ++i)
      color += letters[Math.floor(Math.random() * 16)]

    return color
  }

  static DELIMITER = '__$__'
}

export type TagForm = Omit<TagModel, 'id' | 'deleted_at'>
