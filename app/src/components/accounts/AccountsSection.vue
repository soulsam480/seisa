<script setup lang='ts'>
import type { NewAccount } from '@seisa/api/src/schema'
import type { FormRules } from 'element-plus'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElNotification, ElScrollbar, ElText } from 'element-plus'
import { ref, toRef } from 'vue'
import { createForm } from '../../lib/form'
import type { Account } from '../../state/models/account'
import { appStore } from '../../state/store'
import AppSection from '../lib/AppSection.vue'
import AccountItem from './AccountItem.vue'
import PhPiggyBank from '~icons/ph/piggy-bank'

interface AccountForm extends Pick<NewAccount, 'account_no' | 'bank' | 'name'> { }

const accountsStore = toRef(appStore, 'accounts_store')

const accountDialogVisible = ref(false)
const editingAccount = ref<Account | null>(null)

async function handleFormSubmit(formData: AccountForm) {
  if (editingAccount.value) {
    Object.assign(editingAccount.value, {
      name: formData.name,
      bank: formData.bank,
      account_no: formData.account_no,
    })

    if (await editingAccount.value.save()) {
      ElNotification.success({
        title: `Account ${formData.name} updated successfully`,
      })
    }

    editingAccount.value = null

    closeAddAccountDialog()
    return
  }

  if (await accountsStore.value.insert(formData)) {
    ElNotification.success({
      title: `Account ${formData.name} added successfully`,
    })

    closeAddAccountDialog()
  }
}

const { formRef: accountFormRef, formState: accountForm, resetForm, submitForm } = createForm<AccountForm>({
  account_no: '',
  bank: '',
  name: '',
}, handleFormSubmit)

function closeAddAccountDialog() {
  handleReset()
  accountDialogVisible.value = false
}

function openAddAccountDialog() {
  accountDialogVisible.value = true
}

const FORM_RULES: FormRules<AccountForm> = {
  bank: [{
    required: true,
    message: 'Bank name is required',
    trigger: 'change',
  }],
  name: [{
    required: true,
    message: 'Account name is required',
    trigger: 'change',
  }],
}

function handleEdit(account: Account) {
  editingAccount.value = account

  accountForm.value = {
    name: account.name,
    bank: account.bank,
    account_no: account.account_no,
  }

  openAddAccountDialog()
}

function handleReset() {
  resetForm()
  editingAccount.value = null
}
</script>

<template>
  <ElDialog
    v-model="accountDialogVisible" :title="editingAccount !== null ? `Editing ${editingAccount.name}` : 'Add Account'"
    destroy-on-close append-to-body
    class="seisa-dialog"
    @close="handleReset"
  >
    <ElForm ref="accountFormRef" :model="accountForm" label-position="top" :rules="FORM_RULES">
      <ElFormItem prop="name" label="Account name">
        <ElInput v-model="accountForm.name" autocomplete="off" placeholder="My Salary" />
      </ElFormItem>

      <ElFormItem prop="bank" label="Bank name">
        <ElInput v-model="accountForm.bank" autocomplete="off" placeholder="General Bank" />
      </ElFormItem>

      <ElFormItem prop="account_no" label="Account number">
        <ElInput v-model="accountForm.account_no" autocomplete="off" placeholder="XXXX1234" />
      </ElFormItem>

      <ElFormItem>
        <ElButton @click="closeAddAccountDialog">
          Cancel
        </ElButton>
        <ElButton type="primary" @click="submitForm">
          Confirm
        </ElButton>
      </ElFormItem>
    </ElForm>
  </ElDialog>

  <AppSection :loading="accountsStore.is_fetching" @add="openAddAccountDialog">
    <template #icon>
      <PhPiggyBank class="text-el-primary" />
    </template>

    <template #title>
      Accounts
    </template>

    <template #subtitle>
      Manage your bank accounts.
    </template>

    <div v-if="accountsStore.items.length === 0" class="text-center">
      <ElText size="large" type="info">
        No active accounts found !
      </ElText>
    </div>

    <ElScrollbar v-else max-height="350px">
      <AccountItem
        v-for="account in accountsStore.items" :key="account.id" :account="account" class="mr-4"
        @edit="handleEdit"
      />
    </ElScrollbar>
  </AppSection>
</template>
