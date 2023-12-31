<script setup lang="ts">
import AccountsSection from '../components/accounts/AccountsSection.vue'
import ExpenseSection from '../components/expenses/ExpenseSection.vue'
import IncomesSection from '../components/incomes/IncomesSection.vue'
import MarkdownContainer from '../components/lib/MarkdownContainer.vue'
import SettingsGuide from '../content/SettingsGuide.md'
</script>

<template>
  <div class="flex flex-col items-center gap-4 sm:w-[600px] mx-auto">
    <MarkdownContainer section-key="settings-explainer" default-open>
      <SettingsGuide />
    </MarkdownContainer>

    <AccountsSection />

    <IncomesSection />

    <ExpenseSection />
  </div>
</template>
