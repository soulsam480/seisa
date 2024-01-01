<script lang="ts">
import { ElButton, ElFormItem, ElInput } from 'element-plus'
import * as T from 'superstruct'
import Wizard from '../lib/Wizard.vue'
import PhListPlus from '~icons/ph/list-plus'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const transactionFormSchema = {
  some: T.nonempty(T.string()),
  email: T.pattern(T.string(), EMAIL_REGEX),
  password: T.optional(T.string()),
} as const
</script>

<script setup lang='ts'>
const defaultValue = {
  name: '',
  email: '',
  password: '',
}
</script>

<template>
  <Wizard :schema="transactionFormSchema" :default-value="defaultValue" class="w-full flex flex-col spend-form">
    <template #some="{ state, errors }">
      <ElFormItem :error="errors.some" label="Name">
        <ElInput v-model="state.value" autocomplete="off" />
      </ElFormItem>
    </template>

    <template #email="{ state, errors }">
      <ElFormItem :error="errors.email" label="Email">
        <ElInput v-model="state.value" autocomplete="off" type="email" />
      </ElFormItem>
    </template>

    <template #password>
      <div>sss</div>
    </template>

    <template #navigation="{ next, disableNext, disablePrevious, previous }">
      <div class="flex items-center justify-between">
        <ElButton
          :disabled="disablePrevious"
          plain
          type="info"
          @click="previous"
        >
          Previous
        </ElButton>

        <ElButton

          plain
          :icon="disableNext ? PhListPlus : undefined"
          type="primary"
          @click="next"
        >
          {{ disableNext ? 'Submit' : 'Next' }}
        </ElButton>
      </div>
    </template>
  </Wizard>
</template>

<style scoped>
.spend-form :deep(.el-form-item__label) {
  @apply justify-start;
}

.spend-form :deep(.el-form-item) {
  @apply flex-col;
}
</style>
