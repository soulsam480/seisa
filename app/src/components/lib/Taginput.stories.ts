import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import type { TagForm } from '../../state/models/tag'
import { tagFactory } from '../../stories/data/tag.factory'
import TagInput from './TagInput.vue'

type Story = StoryObj<typeof TagInput>

export const Primary: Story = {
  render: () => ({
    components: { TagInput },
    setup() {
      const tags = ref(tagFactory.buildList(10))

      const selectedTagIds = ref(tags.value.slice(0, 2).map(it => it.id))

      function handleAddTag(tag: TagForm) {
        tags.value.push(tagFactory.build(tag))
      }

      return {
        selectedTagIds,
        tags,
        handleAddTag,
      }
    },
    template: `<TagInput
        v-model="selectedTagIds"
        :tags="tags"
        @add-tag="handleAddTag"
      />`,
  }),
}

const meta: Meta<typeof TagInput> = {
  title: 'Components/Lib/TagInput',
  component: TagInput,
}

export default meta
