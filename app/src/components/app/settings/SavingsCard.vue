<script setup lang="ts">
import { ref } from 'vue';
import { ISaving } from '../../../types';

const DEFAULT_SAVING: ISaving = {
  name: '',
  amount: 1,
  debit_type: 'monthly',
  debit_on: undefined,
  last_debit_on: undefined,
  reminder: false,
};

const savings = ref<ISaving[]>([]);

const isModalOpen = ref(false);
const currentSaving = ref<ISaving | null>(null);

function openAddSavingDialog() {
  currentSaving.value = DEFAULT_SAVING;
  isModalOpen.value = true;
}

function handleAddSaving(e: Event) {
  e.preventDefault();

  if (currentSaving.value === null) return;

  savings.value.push(currentSaving.value);

  isModalOpen.value = false;
  currentSaving.value = null;
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
        v-if="currentSaving !== null"
      >
        <div class="flex flex-col gap-2">
          <Label for="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. Salary"
            v-model="currentSaving.name"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="amount">Amount</Label>
          <Input
            min="1"
            type="number"
            id="amount"
            placeholder="Amount"
            v-model="currentSaving.amount"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="frequency">Frequency</Label>
          <Select name="frequency" v-model="currentSaving.debit_type">
            <SelectTrigger class="min-w-[150px]">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                v-for="savingType of SAVING_DEBIT_TYPES"
                :value="savingType"
              >
                {{ title(savingType) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="debit_on">Debit date</Label>
          <Input
            type="number"
            id="debit_on"
            placeholder="e.g. 1"
            v-model="currentSaving.debit_on"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="last_debit_on">Last Debit</Label>

          <div class="relative">
            <Input
              class="seisa-date"
              type="date"
              id="last_debit_on"
              placeholder="e.g. 1"
              v-model="currentSaving.debit_on"
            />

            <CalendarIcon class="w-5 h-5 absolute top-2 right-2.5" />
          </div>
        </div>

        <div class="flex gap-2 items-center">
          <Checkbox
            name="reminder"
            id="reminder"
            v-model:checked="currentSaving.reminder"
          />

          <Label for="reminder">Reminder</Label>
        </div>

        <DialogFooter>
          <Button type="submit"> Save changes </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  -->

  <!-- <Card class="sm:w-full max-w-2xl">
    <CardHeader>
      <CardTitle>Savings</CardTitle>
      <CardDescription>
        Add your savings here. This will be used to calculate your monthly
        budget.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <template v-if="savings.length === 0">
        <div class="flex flex-col gap-2 items-center">
          <p class="text-center text-muted-foreground">
            No Savings declared yet.
          </p>

          <Button size="sm" @click="openAddSavingDialog">
            <PlusCircledIcon class="w-4 h-4 mr-2" />
            Add new
          </Button>
        </div>
      </template>

      <template v-else>
        <div class="flex fle-col gap-4 w-full">
          <div
            class="flex flex-col gap-2 w-full p-2 rounded-md relative"
            v-for="saving in savings"
          >
            <div class="text-lg">
              {{ saving.name }}
            </div>

            <Badge
              class="absolute top-0 right-0"
              :variant="saving.reminder ? 'default' : 'destructive'"
            >
              <DotFilledIcon v-if="saving.reminder" />
              <DotIcon v-else />
              Reminder
            </Badge> -->

  <!-- TODO: check for year from last debit date -->
  <!-- <div class="text-sm text-muted-foreground">
              Payment on the
              {{ saving.debit_on }}th of the month
            </div>
          </div>
        </div>
      </template>
    </CardContent>
  </Card> -->
</template>
