<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCheckbox from '@/components/ui/BaseCheckbox.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { ref } from 'vue'

interface Props {
  isLoading?: boolean
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: ''
})

const emit = defineEmits<{
  submit: [{ email: string; password: string; remember: boolean }]
}>()

const email = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)

const handleSubmit = () => {
  emit('submit', { email: email.value, password: password.value, remember: remember.value })
}
</script>

<template>
  <form class="flex flex-col" @submit.prevent="handleSubmit" novalidate>
    <!-- Email -->
    <BaseInput
      v-model="email"
      type="email"
      placeholder="seu@email.com"
      autocomplete="email"
      :disabled="isLoading"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>
        </svg>
      </template>
    </BaseInput>

    <!-- Senha -->
    <BaseInput
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      placeholder="sua senha"
      autocomplete="current-password"
      :disabled="isLoading"
      class="mt-3"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>
        </svg>
      </template>
      <template #suffix>
        <button
          type="button"
          class="inline-flex items-center justify-center w-7 h-7 rounded-md text-[var(--fg-3)] cursor-pointer transition-colors duration-150 hover:text-[var(--fg-1)] hover:bg-[rgba(255,255,255,0.08)] flex-shrink-0"
          :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
          @click="showPassword = !showPassword"
        >
          <svg v-if="showPassword" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
            <path d="M9.9 5.1A10 10 0 0 1 22 12a10 10 0 0 1-3.2 4.3M6.6 6.6A10 10 0 0 0 2 12a10 10 0 0 0 10 7 10 10 0 0 0 4.9-1.3"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </template>
    </BaseInput>

    <!-- Opções -->
    <div class="flex items-center justify-between mt-4">
      <BaseCheckbox v-model="remember" label="Lembrar de mim" />
      <a href="#" class="text-xs text-[var(--fg-2)] font-medium no-underline transition-colors duration-150 hover:text-[var(--fg-1)]">
        Esqueceu a senha?
      </a>
    </div>

    <!-- Erro -->
    <div
      v-if="errorMessage"
      role="alert"
      class="mt-4 rounded-lg px-3 py-2.5 text-xs text-[var(--status-late)] bg-[var(--status-late-bg)] border border-[rgba(248,113,113,0.25)]"
    >
      {{ errorMessage }}
    </div>

    <!-- Botão principal -->
    <BaseButton type="submit" :loading="isLoading" :disabled="isLoading" class="mt-6 w-full">
      Entrar
    </BaseButton>

    <!-- Divisor -->
    <div class="flex items-center gap-3 mt-8 text-xs text-[var(--fg-3)]">
      <div class="flex-1 h-px bg-[var(--border-subtle)]" />
      <span>ou continue com</span>
      <div class="flex-1 h-px bg-[var(--border-subtle)]" />
    </div>

    <!-- Login social -->
    <div class="grid grid-cols-3 gap-3 mt-4">
      <button
        type="button"
        class="h-11 inline-flex items-center justify-center rounded-[10px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer transition-all duration-150 hover:bg-[var(--bg-high)] hover:border-[var(--border)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        aria-label="Entrar com Google"
      >
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.42-1.7 4.16-5.5 4.16-3.31 0-6.01-2.74-6.01-6.12S8.69 6.02 12 6.02c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.83 3.46 14.64 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12S6.76 21.5 12 21.5c6.93 0 9.5-4.86 9.5-9.34 0-.63-.07-1.1-.16-1.57L12 10.2z"/>
        </svg>
      </button>
      <button
        type="button"
        class="h-11 inline-flex items-center justify-center rounded-[10px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer transition-all duration-150 hover:bg-[var(--bg-high)] hover:border-[var(--border)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        aria-label="Entrar com Apple"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M16.37 1.43c.09 1.17-.36 2.28-1.03 3.07-.71.82-1.85 1.47-2.97 1.39-.12-1.13.42-2.28 1.07-3 .74-.81 1.99-1.4 2.93-1.46zM20.5 17.2c-.52 1.2-.76 1.73-1.43 2.79-.93 1.48-2.25 3.32-3.88 3.33-1.45.02-1.82-.95-3.79-.94-1.97.01-2.38.95-3.83.94-1.63-.01-2.88-1.67-3.81-3.15-2.6-4.14-2.87-9.01-1.27-11.6.93-1.52 2.64-2.6 4.36-2.62 1.78-.03 2.9 1.02 4.37 1.02 1.42 0 2.29-1.03 4.35-1.03 1.56-.01 3.21.85 4.13 2.13-3.63 1.99-3.04 7.17.8 9.13z"/>
        </svg>
      </button>
      <button
        type="button"
        class="h-11 inline-flex items-center justify-center rounded-[10px] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer transition-all duration-150 hover:bg-[var(--bg-high)] hover:border-[var(--border)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
        aria-label="Entrar com Facebook"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/>
        </svg>
      </button>
    </div>

    <!-- Cadastro -->
    <p class="mt-7 text-center text-sm text-[var(--fg-3)]">
      Ainda não tem conta?
      <a href="/register" class="text-[var(--fg-1)] font-medium no-underline transition-colors duration-150 hover:underline underline-offset-4">
        Criar conta
      </a>
    </p>

  </form>
</template>
