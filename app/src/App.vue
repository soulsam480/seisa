<script setup lang="ts">
import { ElButton, ElDivider, ElLink, ElMessageBox, ElNotification } from 'element-plus'
import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { migrateDownToBase, migrator } from '@seisa/api/src/migrator'
import { destroy } from '@seisa/api/src/client'
import { ALLOWED_HASH, useRouter } from './lib/router'
import { logger } from './lib/logger'
import PhArrowCounterClockwiseLight from '~icons/ph/arrow-counter-clockwise-light'

const Home = defineAsyncComponent(() => import('./pages/Home.vue'))
const Spend = defineAsyncComponent(() => import('./pages/Spend.vue'))
const Settings = defineAsyncComponent(() => import('./pages/Settings.vue'))

const { page } = useRouter()

const intialized = ref(false)

async function reset() {
  await ElMessageBox.confirm('Are you sure you want to reset the database?', 'Warning', {
    confirmButtonText: 'Reset',
    cancelButtonText: 'Cancel',
    type: 'warning',
    showClose: false,
  }).then(async () => {
    logger.info('Resetting database...')
    await migrateDownToBase()

    logger.info('Done! Running migrations...')
    const result = await migrator.migrateToLatest()
    logger.info('Done! Report: ', result)

    ElNotification.info({
      title: 'Done!',
      message: 'The database was reset.',
    })
  }).catch(() => {
    ElNotification.info({
      title: 'Reset cancelled',
      message: 'The database was not reset.',
    })
  })
}

onMounted(async () => {
  logger.info('Mount. Running migrations...')
  const results = await migrator.migrateToLatest()
  logger.info('Done! Report: ', results)

  intialized.value = true
})

onBeforeUnmount(async () => {
  logger.info('Unmount. Destroying client...')
  await destroy()
})
</script>

<template>
  <main class="h-screen w-screen">
    <div v-if="!intialized" class="h-full w-full flex items-center justify-center">
      <div class="flex flex-col gap-2 items-center">
        <img src="/loader.svg" class="w-10 h-10">
        <div class="text-base">
          Booting app...
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col h-full w-full">
      <div class="flex items-center gap-2 p-2 justify-between">
        <h3>Seisa</h3>

        <ul role="menubar" class="flex gap-2 items-center">
          <ElLink
            v-for="nav in ALLOWED_HASH" :key="nav" role="menuitem" :href="`#${nav}`"
            :type="page === nav ? 'primary' : 'default'" tabindex="0" :class="{
              'focus:text-[color:var(--el-color-info)]': page !== nav,
            }"
          >
            {{ nav }}
          </ElLink>
        </ul>

        <div>
          <ElButton :icon="PhArrowCounterClockwiseLight" @click="reset">
            Reset
          </ElButton>
        </div>
      </div>
      <ElDivider class="my-0" />

      <div class="flex-grow p-2">
        <template v-if="page === 'home'">
          <Home />
        </template>

        <template v-if="page === 'spend'">
          <Spend />
        </template>

        <template v-if="page === 'settings'">
          <Settings />
        </template>
      </div>
    </div>
  </main>
</template>