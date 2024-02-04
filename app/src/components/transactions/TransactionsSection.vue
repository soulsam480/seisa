<script setup lang='ts'>
import { toRef } from 'vue'
import { ElScrollbar } from 'element-plus'
import { appStore } from '../../state/store'
import AppSection from '../lib/AppSection.vue'
import { setTransactionDrawerVisibility } from './LogTransactionForm.vue'
import TransactionItem from './TransactionItem.vue'
import PhNotebookLight from '~icons/ph/notebook-light'

const transactionStore = toRef(appStore, 'transactions_store')
</script>

<template>
  <AppSection :loading="transactionStore.is_fetching" @add="setTransactionDrawerVisibility(true)">
    <template #icon>
      <PhNotebookLight class="text-tertiary-600" />
    </template>

    <template #title>
      Transactions
    </template>

    <template #subtitle>
      View and manage your transactions
    </template>

    <div v-if="transactionStore.items.length === 0" class="text-center">
      <ElText size="large" type="info">
        You have not logged any transactions yet.
      </ElText>
    </div>

    <ElScrollbar v-else max-height="350px">
      <TransactionItem
        v-for="transaction in transactionStore.items" :key="transaction.id" :transaction="transaction" class="mr-4"
      />
    </ElScrollbar>
  </AppSection>
</template>
