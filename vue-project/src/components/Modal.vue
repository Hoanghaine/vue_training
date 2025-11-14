<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h3 class="text-xl font-bold mb-4 text-emerald-600">{{ props.title }}</h3>

      <div class="flex flex-col gap-3">
        <label>
          Type:
          <select v-model="localData.type" class="border p-2 rounded w-full">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label>
          Category:
          <input v-model="localData.category" type="text" class="border p-2 rounded w-full" />
        </label>

        <label>
          Amount:
          <input
            v-model.number="localData.amount"
            type="number"
            class="border p-2 rounded w-full"
          />
        </label>

        <label>
          Date:
          <input v-model="localData.date" type="date" class="border p-2 rounded w-full" />
        </label>
      </div>

      <div class="flex justify-end gap-3 mt-4">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Cancel
        </button>
        <button
          @click="save"
          class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Transaction } from '@/types/Transaction'

interface Props {
  show: boolean
  transaction: Transaction
  title?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', transaction: Transaction): void
}>()
const localData = ref<Transaction>({ ...props.transaction })

watch(
  () => props.transaction,
  (newVal) => {
    localData.value = { ...newVal }
  },
)

function save() {
  emit('save', localData.value)
}
</script>

<style></style>
