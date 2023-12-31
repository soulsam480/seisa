<script setup lang='ts'>
import { ElButton, ElIcon, ElMessageBox, ElNotification, ElText } from 'element-plus'
import { computed } from 'vue'
import type { Expense } from '../../state/models/expense'
import PhCalendarBlank from '~icons/ph/calendar-blank'
import PhCurrencyInr from '~icons/ph/currency-inr'
import PhHashFill from '~icons/ph/hash-fill'
import PhPencilSimpleLight from '~icons/ph/pencil-simple-light'
import PhTrashLight from '~icons/ph/trash-light'

const props = defineProps<{
  expense: Expense
}>()

defineEmits<{
  (e: 'edit', expense: Expense): void
}>()

async function handleDelete() {
  try {
    await ElMessageBox.confirm('All linked resources will be kept.', `Delete ${props.expense.name}?`, {
      type: 'warning',
      showClose: false,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No. Go back',
    })

    await props.expense.delete()

    ElNotification.success({
      title: `${props.expense.name} removed successfully`,
    })
  }
  catch (error) {}
}

const dateLabel = computed(() => {
  if (props.expense.is_recurring) {
    return `Debits on ${props.expense.debited_at.toLocaleString('en-IN', {
      day: 'numeric',
  })} of every month`
  }

  return `Debited on ${props.expense.debited_at.toLocaleString('en-IN', {
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
        {{ expense.name }}
      </ElText>

      <div class="inline-flex gap-1">
        <ElText v-if="expense.account !== null" size="small" class="font-semibold" tag="p">
          <ElIcon class="!text-el-info">
            <PhCurrencyInr />
          </ElIcon>

          {{ expense.amount }}
        </ElText>

        <ElText v-if="expense.account !== null" size="small" tag="p">
          <span class="text-el-info">
            from
          </span>

          <span class="font-semibold">
            {{ expense.account.name }}
          </span>
        </ElText>
      </div>

      <ElText v-if="expense.account !== null" type="info" size="small" tag="p">
        <ElIcon>
          <PhCalendarBlank />
        </ElIcon>

        {{ dateLabel }}
      </ElText>

      <div v-if="expense.tags.length !== 0" class="inline-flex items-center gap-1">
        <ElText v-for="tag in expense.tags" :key="tag.id" type="info" size="small" tag="span">
          <ElIcon>
            <PhHashFill :style="`color: ${tag.color};`" />
          </ElIcon>
          {{ tag.name }}
        </ElText>
      </div>
    </div>

    <div class="justify-self-end">
      <ElButton :icon="PhPencilSimpleLight" circle size="small" @click="$emit('edit', expense)" />

      <ElButton type="danger" :icon="PhTrashLight" circle size="small" @click="handleDelete" />
    </div>
  </div>
</template>
