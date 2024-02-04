<script setup lang="ts">
import MarkdownContainer from '../components/lib/MarkdownContainer.vue'
import TransactionsSection from '../components/transactions/TransactionsSection.vue'
import TransactionsGuide from '../content/TransactionsGuide.md'
</script>

<template>
  <div class="flex flex-col items-center gap-4 sm:w-[600px] mx-auto relative h-full">
    <MarkdownContainer section-key="transactions-explainer" default-open>
      <TransactionsGuide />
    </MarkdownContainer>
    <TransactionsSection />
  </div>
</template>
