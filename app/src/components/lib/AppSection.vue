<script setup lang='ts'>
import { ElButton, ElCard } from 'element-plus'
import PhPlusCircleLight from '~icons/ph/plus-circle-light'

defineEmits<{
  (e: 'add', event: MouseEvent): void
}>()
</script>

<template>
  <ElCard class="w-full card-md">
    <template #header>
      <div class="flex justify-between gap-2 items-center">
        <div class="text-">
          <slot name="title" />
        </div>

        <ElButton :icon="PhPlusCircleLight" @click="$emit('add', $event)">
          Add
        </ElButton>
      </div>
    </template>

    <slot />
  </ElCard>
</template>
