<script setup lang="ts">
import { watch } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { useAuthStore } from './stores/useAuthStore'
import type { User } from './types/User'
const auth = useAuthStore()
const router = useRouter()
watch(
  () => auth.user as User,
  (newUser: User) => {
    if (!newUser) {
      router.push('/login')
    } else {
      router.push('/dashboard')
    }
  },
)
</script>

<template>
  <RouterView />
</template>
