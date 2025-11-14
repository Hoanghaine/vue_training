// src/stores/auth.ts
import type { User } from '@/types/User'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
  }),
  actions: {
    async fetchProfile() {
      this.loading = true
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          this.user = data.user
        } else {
          this.user = null
        }
      } finally {
        this.loading = false
      }
    },
    async login(email: string, password: string) {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Invalid login')
      const data = await res.json()
      this.user = data.user
    },
    async logout() {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      this.user = null
    },
  },
})
