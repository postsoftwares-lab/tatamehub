<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { initializeAuth, isCheckingAuth } = useAuth()

onMounted(() => {
  initializeAuth()
})
</script>

<template>
  <div v-if="isCheckingAuth" class="flex items-center justify-center w-screen h-screen bg-[var(--bg-app)]">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-[var(--border-subtle)] border-t-blue-500 rounded-full animate-spin" />
      <p class="text-sm text-[var(--fg-2)]">Carregando...</p>
    </div>
  </div>
  <router-view v-else />
</template>
