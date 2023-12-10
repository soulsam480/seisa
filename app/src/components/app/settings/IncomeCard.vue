<script setup lang="ts">
import { ref } from 'vue';
import { IIncome } from '../../../types';

const DEFAULT_INCOME: IIncome = {
  amount: 1,
  credit_on: undefined,
  name: '',
  type: 'other',
};

const sources = ref<IIncome[]>([]);

const isModalOpen = ref(false);
const currentIncome = ref<IIncome | null>(null);

function openAddIncomeDialog() {
  currentIncome.value = DEFAULT_INCOME;
  isModalOpen.value = true;
}

function handleAddSaving(e: Event) {
  e.preventDefault();

  if (currentIncome.value === null) return;

  sources.value.push(currentIncome.value);

  isModalOpen.value = false;
  currentIncome.value = null;
}
</script>
<template>
  <!-- <Dialog v-model:open="isModalOpen">
    <DialogContent class="sm:w-[600px] w-[calc(100%_-_32px)]">
      <DialogHeader>
        <DialogTitle>New Saving</DialogTitle>
      </DialogHeader>

      <form
        class="flex flex-col gap-4"
        @submit="handleAddSaving"
        v-if="currentIncome !== null"
      >
        <div class="flex flex-col gap-2">
          <Label for="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Salary"
            v-model="currentIncome.name"
          />
        </div>

          <Label for="amount">Amount</Label>
          <Input
            min="1"
            type="number"
            id="amount"
            placeholder="Amount"
            v-model.number="currentIncome.amount"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="type">Type</Label>
          <Select name="type" v-model="currentIncome.type">
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

        <div class="flex flex-col gap-2" v-if="currentIncome.type === 'salary'">
          <Label for="credit_on">Salary Credit on</Label>
          <Input
            type="number"
            id="credit_on"
            placeholder="e.g. 1"
            v-model="currentIncome.credit_on"
          />
        </div>

        <DialogFooter>
          <Button type="submit"> Save changes </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <Card class="sm:w-full max-w-2xl">
    <CardHeader>
      <CardTitle>Income Sources</CardTitle>
      <CardDescription>
        Add your income sources here. This will be used to calculate your
        monthly budget.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <template v-if="sources.length === 0">
        <div class="flex flex-col gap-2 items-center">
          <p class="text-center text-muted-foreground">
            No income declared yet.
          </p>

          <Button size="sm" @click="openAddIncomeDialog">
            <PlusCircledIcon class="w-4 h-4 mr-2" />
            Add new
          </Button>
        </div>
      </template>
    </CardContent>
  </Card> -->
</template>
