<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import FooterView from './FooterView.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <Navbar />
    <main class="flex-1 max-w-7xl px-4 py-6">
      <RouterView />
    </main>
    <FooterView />
  </div>
</template>
