<script setup lang='ts'>
import type { FormRules } from 'element-plus'
import { ElButton, ElCheckbox, ElDatePicker, ElDialog, ElForm, ElFormItem, ElInput, ElNotification, ElOption, ElScrollbar, ElSelect, ElText } from 'element-plus'
import { ref, toRef } from 'vue'
import { createForm } from '../../lib/form'
import { appStore } from '../../state/store'
import AppSection from '../lib/AppSection.vue'
import type { IncomeForm } from '../../state/models/income'
import { DEFAULT_INCOME, Income } from '../../state/models/income'
import { INCOME_CATEGORY } from '../../lib/constants'
import TagInput from '../lib/TagInput.vue'
import type { TagForm } from '../../state/models/tag'
import { preventSubmit, sentence } from '../../lib/utils'
import IncomeItem from './IncomeItem.vue'

const incomesStore = toRef(appStore, 'incomes_store')
const tagsStore = toRef(appStore, 'tags_store')
const accountsStore = toRef(appStore, 'accounts_store')

const incomeDialogVisible = ref(false)
const editingIncome = ref<Income | null>(null)

async function handleFormSubmit(formData: IncomeForm) {
  closeIncomeFormDialog()

  //   if (editingIncome.value) {
  //     Object.assign(editingIncome.value, {
  //       name: formData.name,
  //       bank: formData.bank,
  //       account_no: formData.account_no,
  //     })

  //     if (await editingIncome.value.save()) {
  //       ElNotification.success({
  //         title: `Account ${formData.name} updated successfully`,
  //       })
  //     }

  //     editingIncome.value = null
  //     return
  //   }

  if (await incomesStore.value.add_income(Income.toDBPayload(formData))) {
    ElNotification.success({
      title: `Income ${formData.name} added successfully`,
    })
  }
}

const { formRef: incomeFormRef, formState: incomeForm, resetForm, submitForm } = createForm<IncomeForm>({
  ...DEFAULT_INCOME,
}, handleFormSubmit)

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
  date: [
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

  Object.assign(incomeForm, {
    ...Income.toFormPayload(income),
  })

  openIncomeFormDialog()
}

function handleAddTag(tag: TagForm) {
  void tagsStore.value.add_tag(tag)
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

      <ElFormItem prop="date" label="Credit date">
        <ElDatePicker
          v-model="incomeForm.date"
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
          :tags="tagsStore.tags"
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
        <!-- @vue-ignore -->
        <ElSelect v-model="incomeForm.account_id" class="w-full" placeholder="Select" :clearable="false">
          <ElOption
            v-for="item in accountsStore.accounts"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem prop="recurring">
        <ElCheckbox v-model="incomeForm.recurring" label="Does this repeat on the selected date every month ?" />
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

  <AppSection @add="openIncomeFormDialog">
    <template #title>
      Incomes
    </template>

    <div v-if="incomesStore.incomes.length === 0" class="text-center">
      <ElText size="large" type="info">
        No active incomes found !
      </ElText>
    </div>

    <ElScrollbar v-else max-height="350px">
      <IncomeItem
        v-for="income in incomesStore.incomes " :key="income.id" :income="income" class="mr-4"
        @edit="handleEdit"
      />
    </ElScrollbar>
  </AppSection>
</template>
