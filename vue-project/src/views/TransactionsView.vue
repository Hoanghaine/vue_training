<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-emerald-600">Transactions</h2>
      <div class="border border-2-emerald rounded-xl px-2 py-2">
        <input type="text" class="" v-model="query" @keyup.enter="fetchTransactions" />
        <button @click="fetchTransactions">Search</button>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        + Add Transaction
      </button>
    </div>
    <Spinner v-if="loading" />
    <TransactionList
      v-else
      :transactions="transactions"
      @edit="openEditModal"
      @delete="handleDelete"
    />

    <p v-if="transactions.length === 0" class="text-center text-gray-400 mt-4">
      No transactions yet.
    </p>
  </div>
  <Modal
    :show="showModal"
    :transaction="modalData"
    :title="isEditMode ? 'Edit Transaction' : 'Add Transaction'"
    @close="closeModal"
    @save="handleSave"
  />
</template>
<script setup lang="ts">
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  searchTransactions,
  updateTransaction,
} from '@/services/transactionService'
import { onMounted, ref, watch } from 'vue'
import type { Transaction, Transactions } from '@/types/Transaction'
import Modal from '@/components/Modal.vue'
import Spinner from '@/components/Spinner.vue'
import TransactionList from '@/components/TransactionList.vue'
import { useDebounceFn } from '@vueuse/core'
const transactions = ref<Transactions>([])
const loading = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const query = ref('')
const debouncedFetch = useDebounceFn(fetchTransactions, 500)
const modalData = ref<Transaction>({
  id: 0,
  type: 'income',
  category: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
})
async function fetchTransactions() {
  loading.value = true
  try {
    if (!query.value) {
      const res = await getTransactions()
      transactions.value = res.data
    } else {
      const res = await searchTransactions(query.value)
      transactions.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}
// watch(query, () => {
//   debouncedFetch()
// })
onMounted(async () => {
  await fetchTransactions()
})
function openAddModal() {
  modalData.value = {
    id: 0,
    type: 'income',
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  }
  isEditMode.value = false
  showModal.value = true
}

function openEditModal(t: Transaction) {
  modalData.value = { ...t } // clone
  isEditMode.value = true
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this transaction?')) return
  try {
    await deleteTransaction(id)
    transactions.value = transactions.value.filter((t) => t.id !== id)
  } catch (err) {
    console.error(err)
  }
}

async function handleSave(updatedTransaction: Transaction) {
  try {
    if (isEditMode.value) {
      const res = await updateTransaction(updatedTransaction.id, updatedTransaction)
      const index = transactions.value.findIndex((t) => t.id === updatedTransaction.id)
      if (index !== -1) transactions.value[index] = res.data
    } else {
      const { type, category, amount, date } = updatedTransaction
      const payload = { type, category, amount, date }
      const res = await addTransaction(payload)
      transactions.value.push(res.data)
    }
    closeModal()
  } catch (err) {
    console.error(err)
  }
}
</script>
<style></style>
