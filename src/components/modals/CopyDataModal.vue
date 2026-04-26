<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isOpen: boolean
  studentName: string
  cpf: string
  phone: string
  dateOfBirth: string
  belt: string
}

interface Emits {
  (e: 'close'): void
  (e: 'copy', text: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const copied = ref(false)

const getCopyText = (props: Props) => {
  return `${props.studentName}\nCPF: ${props.cpf}\nTelefone: ${props.phone}\nData de Nascimento: ${new Date(props.dateOfBirth).toLocaleDateString('pt-BR')}\nFaixa: ${props.belt}`
}

const handleCopy = (props: Props, emit: any) => {
  const text = getCopyText(props)
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    emit('copy', text)
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)] w-full max-w-md p-6 space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-[var(--fg-1)]">Copiar Dados</h2>
        <button @click="$emit('close')" class="p-1 hover:bg-[var(--bg-app)] rounded-lg transition-colors">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--fg-3)]">
            <path d="M18 6l-12 12M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Data Display -->
      <div class="bg-[var(--bg-app)] rounded-lg p-4 space-y-2 text-sm">
        <div class="flex justify-between items-start">
          <span class="text-[var(--fg-3)]">Nome:</span>
          <span class="text-[var(--fg-1)] font-medium text-right truncate ml-2">{{ studentName }}</span>
        </div>
        <div class="flex justify-between items-start">
          <span class="text-[var(--fg-3)]">CPF:</span>
          <span class="text-[var(--fg-1)] font-medium text-right">{{ cpf }}</span>
        </div>
        <div class="flex justify-between items-start">
          <span class="text-[var(--fg-3)]">Telefone:</span>
          <span class="text-[var(--fg-1)] font-medium text-right">{{ phone }}</span>
        </div>
        <div class="flex justify-between items-start">
          <span class="text-[var(--fg-3)]">Nascimento:</span>
          <span class="text-[var(--fg-1)] font-medium text-right">{{ new Date(dateOfBirth).toLocaleDateString('pt-BR') }}</span>
        </div>
        <div class="flex justify-between items-start">
          <span class="text-[var(--fg-3)]">Faixa:</span>
          <span class="text-[var(--fg-1)] font-medium text-right">{{ belt }}</span>
        </div>
      </div>

      <!-- Copy Button -->
      <button
        @click="handleCopy($props, $emit)"
        :class="['w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors', copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600']"
      >
        {{ copied ? '✓ Copiado!' : 'Copiar Dados' }}
      </button>

      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="w-full px-4 py-2 rounded-lg bg-[var(--bg-app)] text-[var(--fg-2)] border border-[var(--border-subtle)] font-medium text-sm hover:border-[var(--border)] transition-colors"
      >
        Fechar
      </button>
    </div>
  </div>
</template>
