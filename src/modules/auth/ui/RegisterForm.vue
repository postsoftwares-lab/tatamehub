<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
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
  submit: [{ name: string; cpf: string; email: string; password: string }]
}>()

const name = ref('')
const cpf = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

const handleSubmit = () => {
  emit('submit', {
    name: name.value,
    cpf: cpf.value,
    email: email.value,
    password: password.value
  })
}
</script>

<template>
  <form class="flex flex-col" @submit.prevent="handleSubmit" novalidate>

    <!-- Nome -->
    <BaseInput
      v-model="name"
      type="text"
      placeholder="Seu nome completo"
      autocomplete="name"
      :disabled="isLoading"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </template>
    </BaseInput>

    <!-- CPF -->
    <BaseInput
      :model-value="formatCPF(cpf)"
      @update:model-value="cpf = $event"
      type="text"
      placeholder="000.000.000-00"
      autocomplete="off"
      :disabled="isLoading"
      class="mt-3"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 4H8a2 2 0 0 0-2 2v2h12V6a2 2 0 0 0-2-2z"/>
        </svg>
      </template>
    </BaseInput>

    <!-- Email -->
    <BaseInput
      v-model="email"
      type="email"
      placeholder="seu@email.com"
      autocomplete="email"
      :disabled="isLoading"
      class="mt-3"
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
      placeholder="Crie uma senha forte"
      autocomplete="new-password"
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
      Criar Conta
    </BaseButton>

    <!-- Login -->
    <p class="mt-7 text-center text-sm text-[var(--fg-3)]">
      Já tem uma conta?
      <a href="/login" class="text-[var(--fg-1)] font-medium no-underline transition-colors duration-150 hover:underline underline-offset-4">
        Fazer login
      </a>
    </p>

  </form>
</template>
