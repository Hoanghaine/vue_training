<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    await auth.login(email.value, password.value)
  } catch (e) {
    error.value = 'Invalid credentials'
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow">
    <h1 class="text-2xl font-semibold mb-4 text-center text-emerald-600">FinTrack Login</h1>
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="w-full border p-2 mb-3 rounded"
    />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      class="w-full border p-2 mb-3 rounded"
    />
    <button
      @click="handleLogin"
      class="w-full bg-emerald-600 text-white p-2 rounded hover:bg-emerald-700"
    >
      Login
    </button>
    <p v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</p>
  </div>
</template>
