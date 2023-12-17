<script setup lang='ts'>
import type { Income } from '../../state/models/income'

defineProps<{
  income: Income
}>()
</script>

<template>
  <div>
    {{ income.name }}
  </div>
</template>
