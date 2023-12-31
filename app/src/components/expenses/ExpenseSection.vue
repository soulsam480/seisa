<script setup lang='ts'>
import type { FormRules } from 'element-plus'
import { ElButton, ElCheckbox, ElDatePicker, ElDialog, ElForm, ElFormItem, ElInput, ElNotification, ElOption, ElScrollbar, ElSelect, ElText } from 'element-plus'
import { ref, toRef } from 'vue'
import { EXPENSE_CATEGORY } from '../../lib/constants'
import { createForm } from '../../lib/form'
import { preventSubmit, sentence } from '../../lib/utils'
import type { Expense } from '../../state/models/expense'
import { ExpenseForm } from '../../state/models/expense'
import type { TagForm } from '../../state/models/tag'
import { appStore } from '../../state/store'
import AppSection from '../lib/AppSection.vue'
import TagInput from '../lib/TagInput.vue'
import ExpenseItem from './ExpenseItem.vue'
import PhReceiptLight from '~icons/ph/receipt-light'

const expenseStore = toRef(appStore, 'expenses_store')
const tagsStore = toRef(appStore, 'tags_store')
const accountsStore = toRef(appStore, 'accounts_store')

const expenseDialogVisible = ref(false)
const editingExpense = ref<Expense | null>(null)

async function handleFormSubmit(formData: ExpenseForm) {
  formData = formData.clone()

  if (editingExpense.value) {
    Object.assign(editingExpense.value, {
      ...formData.get_model_update_payload(),
    })

    if (await editingExpense.value.save()) {
      ElNotification.success({
        title: `${formData.name} updated successfully`,
      })
    }

    editingExpense.value = null

    closeExpenseFormDialog()
    return
  }

  if (await expenseStore.value.insert(formData.get_insert_payload())) {
    ElNotification.success({
      title: `Expense ${formData.name} added successfully`,
    })

    closeExpenseFormDialog()
  }
}

const { formRef: expenseFormRef, formState: expenseForm, resetForm, submitForm }
  = createForm<ExpenseForm>(() => new ExpenseForm(), handleFormSubmit)

function closeExpenseFormDialog() {
  handleReset()
  expenseDialogVisible.value = false
}

function openExpenseFormDialog() {
  expenseDialogVisible.value = true
}

const FORM_RULES: FormRules<ExpenseForm> = {
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
  debited_at: [
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
      enum: EXPENSE_CATEGORY,
    },
  ],
  tags: [
    { type: 'array' },
  ],
}

function handleEdit(expense: Expense) {
  editingExpense.value = expense

  expenseForm.value = expense.get_form_payload()

  openExpenseFormDialog()
}

function handleAddTag(tag: TagForm) {
  void tagsStore.value.insert(tag)
}

function handleReset() {
  resetForm()
  editingExpense.value = null
}
</script>

<template>
  <ElDialog
    v-model="expenseDialogVisible"
    :title="editingExpense !== null ? `Editing ${editingExpense.name}` : 'Add Expense'" destroy-on-close append-to-body
    class="seisa-dialog"
    @close="handleReset"
  >
    <ElForm ref="expenseFormRef" :model="expenseForm" label-position="top" :rules="FORM_RULES" @submit="preventSubmit">
      <ElFormItem prop="name" label="Expense name">
        <ElInput v-model="expenseForm.name" autocomplete="off" placeholder="Toy for Jerry" />
      </ElFormItem>

      <ElFormItem prop="amount" label="Amount">
        <ElInput v-model.number="expenseForm.amount" autocomplete="off" placeholder="1000" />
      </ElFormItem>

      <ElFormItem prop="debited_at" label="Debit date">
        <ElDatePicker
          v-model="expenseForm.debited_at"
          class="w-full"
          type="date"
          placeholder="2021/12/10"
          format="YYYY/MM/DD"
        />
      </ElFormItem>

      <ElFormItem prop="category" label="Category">
        <ElSelect v-model="expenseForm.category" class="w-full" placeholder="Select" :clearable="false">
          <ElOption
            v-for="item in EXPENSE_CATEGORY"
            :key="item"
            :label="sentence(item)"
            :value="item"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem prop="tags" label="Tags">
        <TagInput
          v-model="expenseForm.tags"
          :tags="tagsStore.items"
          @add-tag="handleAddTag"
        />
      </ElFormItem>

      <ElFormItem prop="from" label="For">
        <ElInput v-model="expenseForm.from" autocomplete="off" placeholder="e.g. Acme Corp" />
      </ElFormItem>

      <ElFormItem prop="notes" label="Notes">
        <ElInput v-model="expenseForm.notes" autocomplete="off" />
      </ElFormItem>

      <ElFormItem prop="account_id" label="Account">
        <ElSelect v-model="expenseForm.account_id" class="w-full" placeholder="Select" :clearable="false">
          <ElOption
            v-for="item in accountsStore.items"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem prop="is_recurring">
        <ElCheckbox v-model="expenseForm.is_recurring" label="Does this repeat on the selected date every month ?" />
      </ElFormItem>

      <ElFormItem>
        <ElButton @click="closeExpenseFormDialog">
          Cancel
        </ElButton>
        <ElButton type="primary" @click="submitForm">
          Confirm
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElDialog>

  <AppSection :loading="expenseStore.is_fetching" @add="openExpenseFormDialog">
    <template #icon>
      <PhReceiptLight class="text-el-warning" />
    </template>

    <template #title>
      Expenses
    </template>

    <template #subtitle>
      Declare your expenses. You can also add recurring expenses.
    </template>

    <div v-if="expenseStore.items.length === 0" class="text-center">
      <ElText size="large" type="info">
        No active expenses found !
      </ElText>
    </div>

    <ElScrollbar v-else max-height="350px">
      <ExpenseItem
        v-for="expense in expenseStore.items " :key="expense.id" :expense="expense" class="mr-4"
        @edit="handleEdit"
      />
    </ElScrollbar>
  </AppSection>
</template>
