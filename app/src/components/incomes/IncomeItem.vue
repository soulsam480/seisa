<script setup lang='ts'>
import { ElButton, ElMessageBox, ElNotification, ElText } from 'element-plus'
import type { Income } from '../../state/models/income'
import PhTrashLight from '~icons/ph/trash-light'
import PhPencilSimpleLight from '~icons/ph/pencil-simple-light'

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
</script>

<template>
  <div class="flex items-center gap-2 border-base border-b py-2 last-of-type:border-b-0 first-of-type:pt-0 last-of-type:pb-0" v-bind="$attrs">
    <div class="flex-grow flex-col gap-2">
      <ElText tag="p">
        {{ income.name }}
      </ElText>

      <ElText v-if="income.account !== null" type="info" size="small" tag="p">
        {{ income.account.name }}
      </ElText>
    </div>

    <div class="justify-self-end">
      <ElButton :icon="PhPencilSimpleLight" circle size="small" @click="$emit('edit', income)" />

      <ElButton type="danger" :icon="PhTrashLight" circle size="small" @click="handleDelete" />
    </div>
  </div>
</template>
