<script lang="ts" setup>
import type { FormRules, TagProps } from 'element-plus'
import { ElButton, ElForm, ElFormItem, ElInput, ElPopover, ElTag } from 'element-plus'
import { nextTick } from 'vue'
import type { TagForm } from '../../state/models/tag'
import { Tag } from '../../state/models/tag'
import { createForm } from '../../lib/form'
import { preventSubmit } from '../../lib/utils'
import PhPlusCircleLight from '~icons/ph/plus-circle-light'
import PhHashFill from '~icons/ph/hash-fill'

// TODO: connect to element form

withDefaults(defineProps<{
  tags: Tag[]
  type?: TagProps['type']
  size?: TagProps['size']
}>(), {
  size: 'default',
})

const emit = defineEmits<{
  (e: 'addTag', tag: TagForm): void
}>()

const model = defineModel<number[]>({ default: [] })

function handleChange(tag: Tag) {
  const index = model.value.indexOf(tag.id)

  if (index > -1)
    model.value.splice(index, 1)
  else
    model.value.push(tag.id)
}

const { formRef: tagFormRef, formState: tagForm, submitForm, resetForm } = createForm<Pick<TagForm, 'name'>>({
  name: '',
}, (formData) => {
  emit('addTag', {
    ...formData,
    color: Tag.generateRandomColor(),
  })

  handlePopoverClose()
})

const FORM_RULES: FormRules<TagForm> = {
  name: [{
    required: true,
    message: 'Tag name is required',
    trigger: 'change',
  }],
}

function handlePopoverClose() {
  document.body.click()

  nextTick(() => {
    resetForm()
  })
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <ElTag
      v-for="tag in tags"
      :key="tag.id"
      :type="type"
      :effect="model.includes(tag.id) ? 'dark' : 'plain'"
      :size="size"
      role="button"
      :aria-label="tag.name"
      round
      disable-transitions
      @click="handleChange(tag)"
    >
      <span class="inline-flex gap-1 items-center">
        <PhHashFill :style="`color: ${tag.color};`" />
        <span>
          {{ tag.name }}
        </span>
      </span>
    </ElTag>

    <ElPopover
      placement="bottom"
      :width="200"
      trigger="click"
    >
      <template #reference>
        <ElButton
          size="small"
          :icon="PhPlusCircleLight"
          round
          :type="type"
        >
          Add
        </ElButton>
      </template>

      <template #default>
        <ElForm ref="tagFormRef" :model="tagForm" label-position="top" :rules="FORM_RULES" @submit="preventSubmit">
          <div class="text-sm mb-2 font-semibold">
            Add a new tag
          </div>

          <ElFormItem prop="name" label="Tag name" size="small">
            <ElInput v-model="tagForm.name" size="small" autocomplete="off" placeholder="UPI" />
          </ElFormItem>

          <div class="flex justify-end">
            <ElButton size="small" @click="handlePopoverClose">
              Cancel
            </ElButton>

            <ElButton size="small" type="primary" @click="submitForm">
              Confirm
            </ElButton>
          </div>
        </ElForm>
      </template>
    </ElPopover>
  </div>
</template>
