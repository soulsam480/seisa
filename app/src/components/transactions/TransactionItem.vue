<script setup lang='ts'>
import { ElIcon, ElText } from 'element-plus'
import { computed } from 'vue'
import { dateFormat, isToday } from '../../lib/date'
import { sentence } from '../../lib/utils'
import type { Transaction } from '../../state/models/transaction'
import PhArrowCircleDownLeft from '~icons/ph/arrow-circle-down-left'
import PhArrowCircleUpRight from '~icons/ph/arrow-circle-up-right'
import PhCurrencyInr from '~icons/ph/currency-inr'
import PhHashFill from '~icons/ph/hash-fill'

const props = defineProps<{
  transaction: Transaction
}>()

defineEmits<{
  (e: 'edit', transaction: Transaction): void
}>()

const dateLabel = computed(() => {
  const formatter = dateFormat(props.transaction.transaction_at)

  if (props.transaction.is_recurring)
    return `Debits on ${formatter.dd()} of every month`

  if (isToday(props.transaction.transaction_at))
    return `Today, ${formatter.hhmm()}`

  return `${formatter.mmmdd()},${formatter.hhmm()}`
})
</script>

<template>
  <div class="flex items-center gap-2 border-base border-b py-2 last-of-type:border-b-0 first-of-type:pt-0 last-of-type:pb-0" v-bind="$attrs">
    <span class="text-lg">
      <PhArrowCircleUpRight v-if="transaction.type === 'debit'" class="text-el-warning" />
      <PhArrowCircleDownLeft v-else class="text-el-success" />
    </span>

    <div class="flex-grow flex flex-col">
      <ElText tag="p" size="default">
        {{ transaction.name }}
      </ElText>

      <ElText
        v-if="transaction.category !== null"
        tag="p"
        size="small"
        type="info"
      >
        {{ sentence(transaction.category) }}
      </ElText>

      <div v-if="transaction.tags.length !== 0" class="inline-flex items-center gap-1">
        <ElText v-for="tag in transaction.tags" :key="tag.id" type="info" size="small" tag="span">
          <ElIcon>
            <PhHashFill :style="`color: ${tag.color};`" />
          </ElIcon>
          {{ tag.name }}
        </ElText>
      </div>
    </div>

    <div class="flex flex-col gap-1 items-end">
      <ElText type="info" size="small" tag="p">
        {{ dateLabel }}
      </ElText>

      <ElText size="default" class="font-semibold" tag="p">
        <ElIcon class="!text-el-info">
          <PhCurrencyInr />
        </ElIcon>

        {{ transaction.amount }}
      </ElText>
    </div>
  </div>
</template>
