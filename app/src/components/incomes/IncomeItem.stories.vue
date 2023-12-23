<script setup lang='ts'>
import IncomeItem from './IncomeItem.vue'
</script>

<template>
  <!-- @vue-ignore -->
  <Stories
    title="IncomeListItem"
    :component="IncomeItem"
  >
    <button>Hello</button>
  </Stories>
</template>
