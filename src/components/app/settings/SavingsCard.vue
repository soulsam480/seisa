<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SAVING_DEBIT_TYPES } from '@/lib/constants';
import { ISaving } from '@/types';
import { CalendarIcon, PlusCircledIcon } from '@radix-icons/vue';
import { ref } from 'vue';

const savings = ref<ISaving[]>([
  {
    name: '',
    amount: 1,
    debit_type: 'monthly',
    debit_on: undefined,
    last_debit_on: undefined,
    reminder: false,
  },
]);

function hassAddSaving() {
  savings.value.push({
    name: '',
    amount: 1,
    debit_type: 'monthly',
    debit_on: undefined,
    last_debit_on: undefined,
    reminder: false,
  });
}
</script>
<template>
  <Card class="sm:w-full max-w-2xl">
    <CardHeader>
      <CardTitle>Savings</CardTitle>
      <CardDescription>
        Add your savings here. This will be used to calculate your monthly
        budget.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form class="flex flex-col gap-2">
        <template v-for="source in savings">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <div class="flex flex-col gap-2">
              <Label html-for="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Salary"
                v-model="source.name"
              />
            </div>

            <div class="flex flex-col gap-2">
              <Label html-for="amount">Amount</Label>
              <Input
                min="1"
                type="number"
                id="amount"
                placeholder="Amount"
                v-model.number="source.amount"
              />
            </div>

            <div class="flex flex-col gap-2">
              <Label html-for="frequency">Frequency</Label>
              <Select name="frequency" v-model="source.debit_type">
                <SelectTrigger class="min-w-[150px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem
                    v-for="savingType of SAVING_DEBIT_TYPES"
                    :value="savingType"
                  >
                    {{ savingType }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              class="flex flex-col gap-2"
              v-if="source.debit_type !== 'one-time'"
            >
              <Label html-for="debit_on">Debit date</Label>
              <Input
                type="number"
                id="debit_on"
                placeholder="e.g. 1"
                v-model="source.debit_on"
              />
            </div>

            <div
              class="flex flex-col gap-2"
              v-if="source.debit_type !== 'one-time'"
            >
              <Label html-for="last_debit_on">Last Debit</Label>

              <div class="relative">
                <Input
                  class="seisa-date"
                  type="date"
                  id="last_debit_on"
                  placeholder="e.g. 1"
                  v-model="source.debit_on"
                />

                <CalendarIcon class="w-5 h-5 absolute top-2 right-2.5" />
              </div>
            </div>

            <div
              class="flex flex-col gap-2 self-start"
              v-if="source.debit_type !== 'one-time'"
            >
              <Label html-for="reminder">Reminder</Label>
              <Checkbox
                class="mt-2"
                name="reminder"
                id="reminder"
                v-model:checked="source.reminder"
              />
            </div>
          </div>
        </template>

        <Button
          @click="hassAddSaving"
          class="self-start"
          size="sm"
          variant="secondary"
        >
          <PlusCircledIcon class="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>
    </CardContent>

    <CardFooter class="flex justify-end px-6 pb-6">
      <Button size="sm">Save</Button>
    </CardFooter>
  </Card>
</template>
