<script setup lang='ts'>
import * as T from 'superstruct'
import { ElFormItem, ElInput } from 'element-plus'
import Wizard from '../lib/Wizard.vue'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const schema = {
  name: T.nonempty(T.string()),
  email: T.pattern(T.string(), EMAIL_REGEX),
  password: T.optional(T.string()),
} as const

const defaultValue = {
  name: '',
  email: '',
  password: '',
}
</script>

<template>
  <Wizard :schema="schema" :default-value="defaultValue">
    <template #name="{ state, errors }">
      <div> name {{ state.value }}</div>

      <ElFormItem :error="errors.name" label="Name">
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
  </Wizard>
</template>
