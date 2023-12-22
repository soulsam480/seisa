import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { Tag } from '../../state/models/tag'
import { storyAppStore } from './store'

export const tagFactory = Factory.define<Tag>(({ sequence }) => {
  const tag = new Tag(storyAppStore.tags_store, {
    color: Tag.generateRandomColor(),
    deleted_at: null,
    id: sequence,
    name: faker.finance.currencyCode(),
  })

  return tag
})
