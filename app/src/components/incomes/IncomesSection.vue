<script setup lang='ts'>
import type { FormRules } from 'element-plus'
import { ElButton, ElCheckbox, ElDatePicker, ElDialog, ElForm, ElFormItem, ElInput, ElNotification, ElOption, ElScrollbar, ElSelect, ElText } from 'element-plus'
import { ref, toRef } from 'vue'
import { createForm } from '../../lib/form'
import { appStore } from '../../state/store'
import AppSection from '../lib/AppSection.vue'
import type { Income } from '../../state/models/income'
import { IncomeForm } from '../../state/models/income'
import { INCOME_CATEGORY } from '../../lib/constants'
import TagInput from '../lib/TagInput.vue'
import type { TagForm } from '../../state/models/tag'
import { preventSubmit, sentence } from '../../lib/utils'
import IncomeItem from './IncomeItem.vue'
import PhCurrencyInr from '~icons/ph/currency-inr'

const incomesStore = toRef(appStore, 'incomes_store')
const tagsStore = toRef(appStore, 'tags_store')
const accountsStore = toRef(appStore, 'accounts_store')

const incomeDialogVisible = ref(false)
const editingIncome = ref<Income | null>(null)

async function handleFormSubmit(formData: IncomeForm) {
  formData = formData.clone()

  if (editingIncome.value) {
    Object.assign(editingIncome.value, {
      ...formData.get_model_update_payload(),
    })

    if (await editingIncome.value.save()) {
      ElNotification.success({
        title: `${formData.name} updated successfully`,
      })
    }

    editingIncome.value = null

    closeIncomeFormDialog()
    return
  }

  if (await incomesStore.value.insert(formData.get_insert_payload())) {
    ElNotification.success({
      title: `Income ${formData.name} added successfully`,
    })

    closeIncomeFormDialog()
  }
}

const { formRef: incomeFormRef, formState: incomeForm, resetForm, submitForm }
  = createForm<IncomeForm>(() => new IncomeForm(), handleFormSubmit)

function closeIncomeFormDialog() {
  resetForm()
  incomeDialogVisible.value = false
}

function openIncomeFormDialog() {
  incomeDialogVisible.value = true
}

const FORM_RULES: FormRules<IncomeForm> = {
  name: [
    {
      required: true,
    },
  ],
  amount: [
    {
      required: true,
      type: 'number',
      min: 1,
    },
  ],
  credited_at: [
    {
      required: true,
      type: 'date',
      transform(value) {
        return new Date(value)
      },
    },
  ],
  category: [
    {
      type: 'enum',
      enum: INCOME_CATEGORY,
    },
  ],
  tags: [
    { type: 'array' },
  ],
}

function handleEdit(income: Income) {
  editingIncome.value = income

  incomeForm.value = income.get_form_payload()

  openIncomeFormDialog()
}

function handleAddTag(tag: TagForm) {
  void tagsStore.value.insert(tag)
}
</script>

<template>
  <ElDialog
    v-model="incomeDialogVisible"
    :title="editingIncome !== null ? `Editing ${editingIncome.name}` : 'Add Income'" destroy-on-close append-to-body
    class="seisa-dialog" @close="resetForm"
  >
    <ElForm ref="incomeFormRef" :model="incomeForm" label-position="top" :rules="FORM_RULES" @submit="preventSubmit">
      <ElFormItem prop="name" label="Income name">
        <ElInput v-model="incomeForm.name" autocomplete="off" placeholder="My Salary" />
      </ElFormItem>

      <ElFormItem prop="amount" label="Amount">
        <ElInput v-model.number="incomeForm.amount" autocomplete="off" placeholder="1000" />
      </ElFormItem>

      <ElFormItem prop="credited_at" label="Credit date">
        <ElDatePicker
          v-model="incomeForm.credited_at"
          class="w-full"
          type="date"
          placeholder="2021/12/10"
          format="YYYY/MM/DD"
        />
      </ElFormItem>

      <ElFormItem prop="category" label="Category">
        <ElSelect v-model="incomeForm.category" class="w-full" placeholder="Select" :clearable="false">
          <ElOption
            v-for="item in INCOME_CATEGORY"
            :key="item"
            :label="sentence(item)"
            :value="item"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem prop="tags" label="Tags">
        <TagInput
          v-model="incomeForm.tags"
          :tags="tagsStore.items"
          @add-tag="handleAddTag"
        />
      </ElFormItem>

      <ElFormItem prop="from" label="From">
        <ElInput v-model="incomeForm.from" autocomplete="off" placeholder="e.g. Acme Corp" />
      </ElFormItem>

      <ElFormItem prop="notes" label="Notes">
        <ElInput v-model="incomeForm.notes" autocomplete="off" />
      </ElFormItem>

      <ElFormItem prop="account_id" label="Account">
        <ElSelect v-model="incomeForm.account_id" class="w-full" placeholder="Select" :clearable="false">
          <ElOption
            v-for="item in accountsStore.items"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem prop="is_recurring">
        <ElCheckbox v-model="incomeForm.is_recurring" label="Does this repeat on the selected date every month ?" />
      </ElFormItem>

      <ElFormItem>
        <ElButton @click="closeIncomeFormDialog">
          Cancel
        </ElButton>
        <ElButton type="primary" @click="submitForm">
          Confirm
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElDialog>

  <AppSection :loading="incomesStore.is_fetching" @add="openIncomeFormDialog">
    <template #icon>
      <PhCurrencyInr />
    </template>

    <template #title>
      incomes
    </template>

    <template #subtitle>
      Declare your incomes. You can also add recurring incomes.
    </template>

    <div v-if="incomesStore.items.length === 0" class="text-center">
      <ElText size="large" type="info">
        No active incomes found !
      </ElText>
    </div>

    <ElScrollbar v-else max-height="350px">
      <IncomeItem
        v-for="income in incomesStore.items " :key="income.id" :income="income" class="mr-4"
        @edit="handleEdit"
      />
    </ElScrollbar>
  </AppSection>
</template>
