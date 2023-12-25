<script setup lang='ts'>
import { ElButton, ElCard, ElSkeleton, ElSkeletonItem, ElText } from 'element-plus'
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
        <div class="inline-flex gap-1.5 items-center">
          <span
            :class="{
              'text-2xl': $slots.subtitle !== undefined,
              'text-sm': $slots.subtitle === undefined,
            }"
          >
            <slot name="icon" />
          </span>

          <div>
            <ElText class="font-semibold" tag="h2">
              <slot name="title" />
            </ElText>

            <ElText v-if="$slots.subtitle !== undefined" size="small" type="info" tag="h3">
              <slot name="subtitle" />
            </ElText>
          </div>
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
