<script setup lang='ts'>
import { ElButton, ElIcon, ElMessageBox, ElNotification, ElText } from 'element-plus'
import { computed } from 'vue'
import type { Income } from '../../state/models/income'
import PhTrashLight from '~icons/ph/trash-light'
import PhPencilSimpleLight from '~icons/ph/pencil-simple-light'
import PhCalendarBlank from '~icons/ph/calendar-blank'
import PhCurrencyInr from '~icons/ph/currency-inr'

const props = defineProps<{
  income: Income
}>()

defineEmits<{
  (e: 'edit', income: Income): void
}>()

async function handleDelete() {
  try {
    await ElMessageBox.confirm('All linked resources will be kept.', `Delete ${props.income.name}?`, {
      type: 'warning',
      showClose: false,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No. Go back',
    })

    await props.income.delete()

    ElNotification.success({
      title: `${props.income.name} removed successfully`,
    })
  }
  catch (error) {}
}

const dateLabel = computed(() => {
  if (props.income.is_recurring) {
    return `Credits on ${props.income.credited_at.toLocaleString('en-IN', {
      day: 'numeric',
  })} of every month`
  }

  return `Credited at ${props.income.credited_at.toLocaleString('en-IN', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`
})
</script>

<template>
  <div class="flex items-center gap-2 border-base border-b py-2 last-of-type:border-b-0 first-of-type:pt-0 last-of-type:pb-0" v-bind="$attrs">
    <div class="flex-grow flex flex-col gap-1">
      <ElText tag="p" size="large">
        {{ income.name }}
      </ElText>

      <div class="inline-flex gap-1">
        <ElText v-if="income.account !== null" size="small" class="font-semibold" tag="p">
          <ElIcon class="!text-el-info">
            <PhCurrencyInr />
          </ElIcon>

          {{ income.amount }}
        </ElText>

        <ElText v-if="income.account !== null" size="small" tag="p">
          <span class="text-el-info">
            to
          </span>

          <span class="font-semibold">
            {{ income.account.name }}
          </span>
        </ElText>
      </div>

      <ElText v-if="income.account !== null" type="info" size="small" tag="p">
        <ElIcon>
          <PhCalendarBlank />
        </ElIcon>

        {{ dateLabel }}
      </ElText>
    </div>

    <div class="justify-self-end">
      <ElButton :icon="PhPencilSimpleLight" circle size="small" @click="$emit('edit', income)" />

      <ElButton type="danger" :icon="PhTrashLight" circle size="small" @click="handleDelete" />
    </div>
  </div>
</template>
