<script setup lang='ts'>
import { ElButton, ElIcon, ElMessageBox, ElNotification, ElText } from 'element-plus'
import type { Account } from '../../state/models/account'
import PhTrashLight from '~icons/ph/trash-light'
import PhPencilSimpleLight from '~icons/ph/pencil-simple-light'
import PhDot from '~icons/ph/dot'

const props = defineProps<{ account: Account }>()

defineEmits<{
  (e: 'edit', account: Account): void
}>()

async function handleDelete() {
  try {
    await ElMessageBox.confirm('All linked resources will be kept.', `Delete ${props.account.name} account?`, {
      type: 'warning',
      showClose: false,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No. Go back',
    })

    await props.account.delete()

    ElNotification.success({
      title: `Account ${props.account.name} removed successfully`,
    })
  }
  catch (error) {}
}
</script>

<template>
  <div class="flex items-center gap-2 border-base border-b py-2 last-of-type:border-b-0 first-of-type:pt-0 last-of-type:pb-0" v-bind="$attrs">
    <div class="flex-grow flex-col gap-2">
      <ElText tag="p">
        {{ account.name }}
      </ElText>

      <ElText type="info" size="small" tag="p">
        {{ account.bank }}

        <ElIcon>
          <PhDot />
        </ElIcon>

        {{ account.account_no }}
      </ElText>
    </div>

    <div class="justify-self-end">
      <ElButton :icon="PhPencilSimpleLight" circle size="small" @click="$emit('edit', account)" />

      <ElButton type="danger" :icon="PhTrashLight" circle size="small" @click="handleDelete" />
    </div>
  </div>
</template>
