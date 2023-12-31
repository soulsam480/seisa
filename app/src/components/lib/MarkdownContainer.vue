<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { ElButton, ElDivider, ElText } from 'element-plus'
import PhEyeLight from '~icons/ph/eye-light'
import PhEyeClosedLight from '~icons/ph/eye-closed-light'

const props = defineProps<{
  sectionKey: string
  defaultOpen?: boolean
}>()

const isOpen = useStorage(props.sectionKey, props.defaultOpen ?? true)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="w-full relative">
    <ElButton
      :icon="isOpen ? PhEyeClosedLight : PhEyeLight"
      size="small"
      type="info"
      circle
      plain
      class="absolute right-0 top-4 z-10"
      title="Toggle explainer"
      @click="toggle"
    />

    <div v-if="!isOpen" class="mt-4 flex items-center gap-2 mr-8">
      <ElDivider class="my-0" direction="horizontal" />

      <ElText type="info" class="flex-shrink-0">
        Open explainer
      </ElText>
    </div>

    <template v-else>
      <slot />
    </template>
  </div>
</template>
