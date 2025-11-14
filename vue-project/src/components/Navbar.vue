<template>
  <header class="bg-yellow shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <RouterLink to="/" class="text-2xl font-bold text-emerald-600 tracking-tight">
        💰 FinTrack
      </RouterLink>
      <nav class="hidden md:flex gap-6 text-gray-700 font-medium">
        <RouterLink
          v-for="link in [
            { name: 'Dashboard', to: '/dashboard' },
            { name: 'Transactions', to: '/transactions' },
            { name: 'Reports', to: '/reports' },
            { name: 'Settings', to: '/settings' },
          ]"
          :key="link.to"
          :to="link.to"
          class="hover:text-emerald-600 transition-colors"
          active-class="text-emerald-600 font-semibold border-b-2 border-emerald-500 pb-1"
        >
          {{ link.name }}
        </RouterLink>

        <button v-if="auth.user" @click="handleLogout">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
        </button>
      </nav>

      <!-- Mobile Menu Button -->
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 rounded hover:bg-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Nav -->
    <nav
      v-if="isMenuOpen"
      class="md:hidden bg-white border-t border-gray-200 flex flex-col items-center py-2"
    >
      <RouterLink
        v-for="link in [
          { name: 'Dashboard', to: '/' },
          { name: 'Transactions', to: '/transactions' },
          { name: 'Reports', to: '/reports' },
          { name: 'Settings', to: '/settings' },
        ]"
        :key="link.to"
        :to="link.to"
        class="py-2 w-full text-center hover:bg-emerald-50"
        active-class="text-emerald-600 font-semibold"
        @click="isMenuOpen = false"
      >
        {{ link.name }}
      </RouterLink>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

import { ref } from 'vue'
const isMenuOpen = ref(false)
const auth = useAuthStore()
const router = useRouter()
const handleLogout = async () => {
  try {
    await auth.logout()
    router.push('/login')
  } catch (e) {
    console.log(e)
  }
}
</script>
