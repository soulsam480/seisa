<script setup lang='ts'>
import { ElButton, ElCard, ElSkeleton, ElSkeletonItem } from 'element-plus'
import PhPlusCircleLight from '~icons/ph/plus-circle-light'

withDefaults(defineProps<{
  loading?: boolean
}>(), {
  loading: false,
})

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

    <ElSkeleton :loading="loading" animated>
      <template #template>
        <ElSkeletonItem variant="rect" class="w-full" />
        <ElSkeletonItem variant="rect" class="w-full" />
        <ElSkeletonItem variant="rect" class="w-full" />
      </template>

      <template #default>
        <slot />
      </template>
    </ElSkeleton>
  </ElCard>
</template>
