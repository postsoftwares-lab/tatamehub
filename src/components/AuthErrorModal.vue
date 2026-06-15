<script setup lang="ts">
import { useRouter } from 'vue-router'
import { isAuthErrorModalOpen } from '@/stores/authError'
import { useAuth } from '@/stores/auth'

const router = useRouter()
const { clearToken } = useAuth()
const modal = isAuthErrorModalOpen()

function handleLogin() {
  clearToken()
  modal.value = false
  router.push({ name: 'login' })
}

function handleClose() {
  modal.value = false
}
</script>

<template>
  <div
    v-if="modal"
    class="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
    @click.self="handleClose"
  >
    <div class="bg-card border border-border rounded-2xl w-full max-w-sm my-auto">
      <!-- Header -->
      <div class="border-b border-border px-5 py-4 flex items-center justify-between">
        <h2 class="text-[16px] font-semibold text-foreground">Sessão expirada</h2>
        <button
          @click="handleClose"
          class="p-1 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="px-5 py-4">
        <p class="text-sm text-muted-foreground leading-relaxed mb-1">
          Sua sessão expirou. Por favor, faça login novamente para continuar.
        </p>
      </div>

      <!-- Footer -->
      <div class="border-t border-border px-5 py-4 flex gap-2">
        <button
          @click="handleClose"
          class="flex-1 h-9 rounded-lg border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="handleLogin"
          class="flex-1 h-9 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h6v6M10 14l11-11" />
          </svg>
          Fazer login
        </button>
      </div>
    </div>
  </div>
</template>
