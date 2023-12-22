<script setup lang='ts'>
import { ref } from 'vue'
import { tagFactory } from '../../stories/data/tag.factory'

import TagInput from './TagInput.vue'

const tags = ref(tagFactory.buildList(10))

const selectedTagIds = ref(tags.value.slice(0, 2).map(it => it.id))

// @ts-expect-error bad types from babel
function handleAddTag(tag) {
  tags.value.push(tagFactory.build(tag))
}
</script>

<template>
  <!-- @vue-ignore -->
  <Stories
    title="Tag Input"
    :component="TagInput"
  >
    <Story
      title="primary"
    >
      <TagInput
        v-model="selectedTagIds"
        :tags="tags"
        @add-tag="handleAddTag"
      />
    </Story>
  </Stories>
</template>
