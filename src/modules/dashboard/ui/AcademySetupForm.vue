<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { ref } from 'vue'

interface Props {
  isLoading?: boolean
  errorMessage?: string
  academyName?: string
  billingDay?: number
  monthlyFee?: number
  imagePreview?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  errorMessage: '',
  academyName: '',
  billingDay: 1,
  monthlyFee: 0,
  imagePreview: ''
})

const emit = defineEmits<{
  submit: [{ name: string; billingDay: number; monthlyFee: number }]
  imageSelected: [File]
  imageRemoved: []
}>()

const name = ref(props.academyName)
const billingDay = ref(props.billingDay)
const monthlyFee = ref(props.monthlyFee)
const fileInput = ref<HTMLInputElement>()

const handleSubmit = () => {
  emit('submit', {
    name: name.value,
    billingDay: billingDay.value,
    monthlyFee: monthlyFee.value
  })
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('imageSelected', file)
  }
}

const triggerFileSelect = () => {
  fileInput.value?.click()
}
</script>

<template>
  <form class="flex flex-col w-full max-w-md" @submit.prevent="handleSubmit" novalidate>

    <!-- Nome da Academia -->
    <BaseInput
      v-model="name"
      type="text"
      placeholder="Nome da sua academia"
      autocomplete="off"
      :disabled="isLoading"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </template>
    </BaseInput>

    <!-- Dia de Cobrança -->
    <div class="mt-3">
      <label class="text-xs font-medium text-[var(--fg-3)] mb-2 block">Dia de Cobrança (1-31)</label>
      <input
        v-model.number="billingDay"
        type="number"
        min="1"
        max="31"
        class="w-full px-3 py-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] placeholder-[var(--fg-3)] transition-colors focus:outline-none focus:border-[var(--border)] focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoading"
      />
    </div>

    <!-- Valor da Mensalidade -->
    <div class="mt-3">
      <label class="text-xs font-medium text-[var(--fg-3)] mb-2 block">Valor da Mensalidade (R$)</label>
      <input
        v-model.number="monthlyFee"
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        class="w-full px-3 py-2.5 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] placeholder-[var(--fg-3)] transition-colors focus:outline-none focus:border-[var(--border)] focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoading"
      />
    </div>

    <!-- Upload de Imagem -->
    <div class="mt-4">
      <label class="text-xs font-medium text-[var(--fg-3)] mb-2 block">Logo da Academia (opcional)</label>

      <div v-if="imagePreview" class="mb-3 relative group">
        <img :src="imagePreview" alt="Preview" class="w-full h-40 rounded-lg object-cover border border-[var(--border-subtle)]" />
        <button
          type="button"
          @click="emit('imageRemoved')"
          class="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          :disabled="isLoading"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
        :disabled="isLoading"
      />

      <button
        type="button"
        @click="triggerFileSelect"
        class="w-full px-3 py-8 rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-high)] hover:border-[var(--border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2"
        :disabled="isLoading"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--fg-3)]">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span class="text-xs text-[var(--fg-3)]">Clique para adicionar logo</span>
      </button>
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
      Criar Academia
    </BaseButton>

  </form>
</template>

<style scoped>
/* Hide number input spinners */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
