<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { GearIcon, HomeIcon, PlusCircledIcon } from '@radix-icons/vue';
import { defineAsyncComponent } from 'vue';
import { Button } from './components/ui/button';
import { useRouter } from './lib/router';

const Home = defineAsyncComponent(() => import('@/pages/Home.vue'));
const Spend = defineAsyncComponent(() => import('@/pages/Spend.vue'));
const Settings = defineAsyncComponent(() => import('@/pages/Settings.vue'));

const { goto, page } = useRouter();
</script>
<template>
  <main class="h-screen w-screen flex flex-col">
    <div class="flex items-center gap-2 p-2 justify-between">
      <h3>Seisa</h3>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink as-child>
              <Button variant="ghost" @click="goto('home')">
                <HomeIcon class="w-4 h-4 mr-2" />Home</Button
              >
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink as-child>
              <Button variant="ghost" @click="goto('spend')">
                <PlusCircledIcon class="w-4 h-4 mr-2" />Add Spend</Button
              >
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink as-child>
              <Button variant="ghost" @click="goto('settings')">
                <GearIcon class="w-4 h-4 mr-2" />Settings</Button
              >
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
    <separator />

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
  </main>
</template>
