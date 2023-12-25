<script setup lang="ts">
import { ElButton, ElIcon, ElNotification, ElText } from 'element-plus'
import PhConfettiLight from '~icons/ph/confetti-light'
import PhArrowCounterClockwiseLight from '~icons/ph/arrow-counter-clockwise-light'
import PhXCircleLight from '~icons/ph/x-circle-light'

defineEmits<{
  (e: 'reload'): void
}>()

function close() {
  ElNotification.closeAll()
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <ElText size="large" class="inline-flex items-center gap-2">
      <ElIcon class="text-el-success text-xl">
        <PhConfettiLight />
      </ElIcon>

      Update available
    </ElText>

    <ElText size="small">
      Please save your work before refreshing
    </ElText>

    <div>
      <ElButton
        type="primary"
        size="small"
        :icon="PhArrowCounterClockwiseLight"
        @click="$emit('reload')"
      >
        Reload
      </ElButton>

      <ElButton
        size="small"
        :icon="PhXCircleLight"
        plain
        @click="close"
      >
        I'll do it later
      </ElButton>
    </div>
  </div>
</template>
