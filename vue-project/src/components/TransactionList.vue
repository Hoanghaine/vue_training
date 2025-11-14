<script setup lang="ts">
import type { Transaction, Transactions } from '@/types/Transaction'
defineProps<{
  transactions: Transactions
}>()
defineEmits<{
  (e: 'edit', transaction: Transaction): void
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <ul v-if="transactions.length" class="divide-y divide-gray-200 bg-white shadow rounded-lg">
    <li
      v-for="t in transactions"
      :key="t.id"
      class="flex justify-between items-center px-4 py-3 hover:bg-gray-50"
    >
      <div>
        <span
          class="font-semibold"
          :class="t.type === 'income' ? 'text-green-600' : 'text-red-600'"
        >
          {{ t.type.toUpperCase() }}
        </span>
        <span class="ml-2 text-gray-700">{{ t.category }}</span>
      </div>

      <div :class="t.type === 'income' ? 'text-green-600' : 'text-red-600'" class="font-medium">
        ${{ t.amount }}
      </div>

      <div class="text-gray-500 text-sm">{{ t.date }}</div>
      <!-- Actions -->
      <div class="flex gap-2">
        <button @click="$emit('edit', t)" class="text-blue-600 hover:underline text-sm">
          Edit
        </button>
        <button @click="$emit('delete', t.id)" class="text-red-600 hover:underline text-sm">
          Delete
        </button>
      </div>
    </li>
  </ul>
</template>

<style></style>
