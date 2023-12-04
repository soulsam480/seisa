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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INCOME_TYPES } from '@/lib/constants';
import { IIncome } from '@/types';
import { PlusCircledIcon } from '@radix-icons/vue';
import { title } from 'radash';
import { ref } from 'vue';

const sources = ref<IIncome[]>([
  {
    amount: 1,
    credit_on: undefined,
    name: '',
    type: 'other',
  },
]);

function hassAddIncome() {
  sources.value.push({
    amount: 1,
    credit_on: undefined,
    name: '',
    type: 'other',
  });
}
</script>
<template>
  <Card class="sm:w-full max-w-2xl">
    <CardHeader>
      <CardTitle>Income Sources</CardTitle>
      <CardDescription>
        Add your income sources here. This will be used to calculate your
        monthly budget.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form class="flex flex-col gap-2">
        <template v-for="source in sources">
          <div class="flex items-center gap-2 w-full">
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
              <Label html-for="type">Type</Label>
              <Select name="type" v-model="source.type">
                <SelectTrigger class="min-w-[150px]">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem v-for="income of INCOME_TYPES" :value="income">
                    {{ title(income) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex flex-col gap-2" v-if="source.type === 'salary'">
              <Label html-for="credit_on">Salary Credit on</Label>
              <Input
                type="number"
                id="credit_on"
                placeholder="e.g. 1"
                v-model="source.credit_on"
              />
            </div>
          </div>
        </template>

        <Button
          @click="hassAddIncome"
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
