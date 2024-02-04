<script lang="ts">
import type { TransactionType } from '@seisa/api/src/schema'
import { useToggle } from '@vueuse/core'
import type { FormRules } from 'element-plus'
import { ElButton, ElDatePicker, ElDrawer, ElDropdown, ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElIcon, ElInput, ElNotification, ElOption, ElSelect, ElText } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import { defineComponent, h, ref, toRef } from 'vue'
import { useIsLargeScreen } from '../../lib/composables/isLargeScreen'
import { createForm } from '../../lib/form'
import { preventSubmit, sentence } from '../../lib/utils'
import type { TagForm } from '../../state/models/tag'
import { Transaction, TransactionForm } from '../../state/models/transaction'
import { appStore } from '../../state/store'
import TagInput from '../lib/TagInput.vue'
import PhPlusMinus from '~icons/ph/plus-minus'
import PhCurrencyInrLight from '~icons/ph/currency-inr-light'
import PhArrowCircleUpRight from '~icons/ph/arrow-circle-up-right'
import PhArrowCircleDownLeft from '~icons/ph/arrow-circle-down-left'

const [transactionDrawerVisible, setDrawerVisibility] = useToggle()

export const LogTransactionFormTrigger = defineComponent((props, { attrs }) => {
  return () => {
    return h(
      ElButton,
      {
        icon: PhPlusMinus,
        circle: true,
        size: 'large',
        plain: true,
        onClick: () => setDrawerVisibility(),
        ...attrs,
        ...props,
      },
    )
  }
})

export { setDrawerVisibility as setTransactionDrawerVisibility }
</script>

<script setup lang='ts'>
const expenseStore = toRef(appStore, 'expenses_store')
const incomesStore = toRef(appStore, 'incomes_store')
const tagsStore = toRef(appStore, 'tags_store')
const accountsStore = toRef(appStore, 'accounts_store')
const transactionsStore = toRef(appStore, 'transactions_store')

const isLargeScreen = useIsLargeScreen()
const isAdvancedOptionsVisible = ref(false)

// const editingTransaction = ref<Transaction | null>(null)

async function handleFormSubmit(formData: TransactionForm) {
  formData = formData.clone()

  // if (editingTransaction.value) {
  //   Object.assign(editingTransaction.value, {
  //     ...formData.get_model_update_payload(),
  //   })

  //   if (await editingTransaction.value.save()) {
  //     ElNotification.success({
  //       title: `${formData.name} updated successfully`,
  //     })
  //   }

  //   editingTransaction.value = null

  //   // closeExpenseFormDialog()
  //   return
  // }

  if (await transactionsStore.value.insert(formData.get_insert_payload())) {
    ElNotification.success({
      title: `Transaction ${formData.name} added successfully`,
    })

    setDrawerVisibility(false)
  }
}

const { formRef: transactionFormRef, formState: transactionForm, resetForm, submitForm }
  = createForm<TransactionForm>(() => new TransactionForm({ transaction_at: new Date(), category: 'food_and_drinks' }), handleFormSubmit)

const FORM_RULES: FormRules<TransactionForm> = {
  /**
   * Required fields
   */

  amount: [
    {
      required: true,
      type: 'number',
      min: 1,
    },
  ],
  name: [
    {
      required: true,
      type: 'string',
    },
  ],
  type: [{
    type: 'enum',
    enum: Transaction.TYPES,
    required: true,
  }],
  from: [{
    type: 'string',
    required: false,
  }],
  transaction_at: [
    {
      required: true,
      type: 'date',
      transform(value) {
        return new Date(value)
      },
    },
  ],
  category: [{
    type: 'string',
    required: true,
    enum: Transaction.CATEGORIES,
  }],

  /**
   * Optional fields
   */

  account_id: [{
    type: 'number',
    required: false,
  }],

  notes: [{
    type: 'string',
    required: false,
  }],

  is_recurring: [{
    type: 'boolean',
    required: false,
  }],

  expense_id: [{
    type: 'number',
    required: false,
  }],

  income_id: [{
    type: 'number',
    required: false,
  }],

  tags: [
    { type: 'array', required: false },
  ],
}

function handleAddTag(tag: TagForm) {
  void tagsStore.value.insert(tag)
}

function handleReset() {
  resetForm()
  // editingTransaction.value = null
  isAdvancedOptionsVisible.value = false
}

function handleTransactionTypeChange(type: TransactionType) {
  transactionForm.value.type = type

  if (type === 'debit')
    transactionForm.value.category = 'food_and_drinks'

  else
    transactionForm.value.category = 'bank_deposit'
}
</script>

<template>
  <ElDrawer
    v-model="transactionDrawerVisible"
    :direction="isLargeScreen ? 'rtl' : 'btt'"
    :size="isLargeScreen ? '40%' : '100%'"
    class="transaction-drawer"
    title="Log a Transaction"
    @close="handleReset"
  >
    <ElForm ref="transactionFormRef" :model="transactionForm" label-position="top" :rules="FORM_RULES" @submit="preventSubmit">
      <ElFormItem>
        <ElDropdown trigger="click" size="small">
          <span class="el-dropdown-link inline-flex gap-1">
            <ElText tag="span" type="info">
              I'm adding a
            </ElText>
            <span
              class="inline-flex items-center gap-1"
              :class="[
                {
                  'text-el-warning hover:text-el-warning-dark-2': transactionForm.type === 'debit',
                  'text-el-success hover:text-el-success-dark-2': transactionForm.type === 'credit',
                }]"
            >
              <ElIcon>
                <PhArrowCircleUpRight v-if="transactionForm.type === 'debit'" />
                <PhArrowCircleDownLeft v-else />
              </ElIcon>
              {{ transactionForm.type === 'debit' ? 'Spend' : 'Income' }}
            </span>
          </span>

          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem @click="handleTransactionTypeChange('debit')">
                Spend
              </ElDropdownItem>
              <ElDropdownItem @click="handleTransactionTypeChange('credit')">
                Income
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </ElFormItem>

      <ElFormItem prop="amount" label="Amount spent">
        <ElInput
          v-model.number="transactionForm.amount" type="number" autocomplete="off"
          :prefix-icon="PhCurrencyInrLight"
        />
      </ElFormItem>

      <ElFormItem prop="name" label="Enter the name or place">
        <ElInput v-model="transactionForm.name" autocomplete="off" placeholder="Nidhi Bakery" />
      </ElFormItem>

      <ElFormItem prop="transaction_at" label="Date and Time">
        <ElDatePicker
          v-model="transactionForm.transaction_at"
          class="w-full"
          type="datetime"
          placeholder="2021/12/10"
          format="ddd DD MMM hh:mm a"
          :clearable="false"
        />
      </ElFormItem>

      <ElFormItem prop="category" label="Category">
        <ElSelect
          v-model="transactionForm.category"
          class="w-full"
          :clearable="false"
        >
          <ElOption
            v-for="item in Transaction.CATEGORIES"
            :key="item"
            :label="sentence(item)"
            :value="item"
          />
        </ElSelect>
      </ElFormItem>

      <template v-if="isAdvancedOptionsVisible">
        <ElFormItem prop="account_id" :label="transactionForm.type === 'debit' ? 'From Account' : 'To Account'">
          <ElSelect v-model="transactionForm.account_id" class="w-full" placeholder="Select" :clearable="false">
            <ElOption
              v-for="item in accountsStore.items"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem prop="tags" label="Tags">
          <TagInput
            v-model="transactionForm.tags"
            :tags="tagsStore.items"
            @add-tag="handleAddTag"
          />
        </ElFormItem>

        <ElFormItem prop="notes" label="Extra Notes">
          <ElInput
            v-model="transactionForm.notes"
            :rows="2"
            type="textarea"
            autocomplete="off"
            placeholder="A Dosae, Vade or BisiBele Bath Maybe ?"
          />
        </ElFormItem>

        <ElFormItem v-if="transactionForm.type === 'debit'" prop="expense_id" label="Related Expense">
          <ElSelect v-model="transactionForm.expense_id" class="w-full" placeholder="Select" :clearable="false">
            <ElOption
              v-for="item in expenseStore.items"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem v-else prop="income_id" label="Related Income">
          <ElSelect v-model="transactionForm.income_id" class="w-full" placeholder="Select" :clearable="false">
            <ElOption
              v-for="item in incomesStore.items"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
      </template>

      <div v-else class="flex justify-center">
        <ElButton size="small" type="info" link @click="isAdvancedOptionsVisible = true">
          More options
        </ElButton>
      </div>

      <div class="flex justify-end mt-4">
        <ElButton @click="setDrawerVisibility(false)">
          Cancel
        </ElButton>

        <ElButton type="primary" @click="submitForm">
          Confirm
        </ElButton>
      </div>
    </ElForm>
  </ElDrawer>
</template>

<style>
.transaction-drawer.el-drawer .el-drawer__header {
  margin-bottom: 0px;
}
</style>
