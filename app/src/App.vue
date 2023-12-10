<script setup lang="ts">
import { ElDivider, ElLink, ElButton } from 'element-plus';
import { defineAsyncComponent, ref, onMounted } from 'vue';
import { ALLOWED_HASH, useRouter } from './lib/router';
import { migrator, migrateDownToBase,migrateUpToLatest } from '@seisa/api/src/migrator';
import PhArrowCounterClockwiseLight from '~icons/ph/arrow-counter-clockwise-light';
import { db } from '@seisa/api/src/client';

const Home = defineAsyncComponent(() => import('./pages/Home.vue'));
const Spend = defineAsyncComponent(() => import('./pages/Spend.vue'));
const Settings = defineAsyncComponent(() => import('./pages/Settings.vue'));

const { page } = useRouter();

const intialized = ref(false);

async function reset() {
  await migrateDownToBase();
  await migrateUpToLatest()
}

onMounted(async () => {
  const result = await migrator.migrateToLatest();

  console.info('[SEISA LOG]: ', result);

  console.log(await db.introspection.getTables())

  // const data = await db.selectFrom('accounts').select('id').execute();

  // console.log({ data });

  intialized.value = true;
});
</script>
<template>
  <main class="h-screen w-screen">
    <div
      class="h-full w-full flex items-center justify-center"
      v-if="!intialized"
    >
      <div class="flex flex-col gap-2 items-center">
        <img src="/loader.svg" class="w-10 h-10" />
        <div class="text-base">Booting app...</div>
      </div>
    </div>

    <div v-else class="flex flex-col h-full w-full">
      <div class="flex items-center gap-2 p-2 justify-between">
        <h3>Seisa</h3>

        <ul role="menubar" class="flex gap-2 items-center">
          <ElLink
            v-for="nav in ALLOWED_HASH"
            :key="nav"
            role="menuitem"
            :href="`#${nav}`"
            :type="page === nav ? 'primary' : 'default'"
            tabindex="0"
            :class="{
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
      <el-divider class="my-0" />

      <div class="flex-grow p-2">
        <template v-if="page === 'home'">
          <home />
        </template>

        <template v-if="page === 'spend'">
          <spend />
        </template>

        <template v-if="page === 'settings'">
          <settings />
        </template>
      </div>
    </div>
  </main>
</template>
