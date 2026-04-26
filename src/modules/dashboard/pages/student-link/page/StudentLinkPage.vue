<script setup lang="ts">
import { useStudentLink } from '../composables/useStudentLink'

const {
  academyName,
  registrationLink,
  isLoading,
  error,
  copied,
  copyToClipboard
} = useStudentLink()
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 md:px-6 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[var(--fg-1)] mb-2">Cadastro via Link</h1>
      <p class="text-[var(--fg-3)]">Compartilhe um link para que novos alunos se registrem na sua academia</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-[var(--fg-3)]">Carregando...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg p-6 text-center">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-400 mx-auto mb-4">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h2 class="text-lg font-bold text-red-400 mb-2">Erro</h2>
      <p class="text-[var(--fg-3)]">{{ error }}</p>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      <!-- Academy Info Card -->
      <div class="bg-[var(--bg-elevated)] rounded-lg p-6 border border-[var(--border-subtle)]">
        <p class="text-xs font-medium text-[var(--fg-3)] uppercase mb-2">Academia</p>
        <h2 class="text-xl font-bold text-[var(--fg-1)]">{{ academyName }}</h2>
      </div>

      <!-- Registration Link Card -->
      <div class="bg-[var(--bg-elevated)] rounded-lg p-6 border border-[var(--border-subtle)] space-y-4">
        <div>
          <p class="text-xs font-medium text-[var(--fg-3)] uppercase mb-3">Link de Registro</p>
          <p class="text-sm text-[var(--fg-2)] mb-3">Compartilhe este link com seus alunos para que eles possam se registrar:</p>
        </div>

        <!-- Link Display -->
        <div class="bg-[var(--bg-app)] rounded-lg p-4 flex items-center justify-between border border-[var(--border-subtle)] break-all">
          <code class="text-xs text-[var(--fg-2)] flex-1 overflow-hidden">{{ registrationLink }}</code>
          <button
            @click="copyToClipboard"
            :class="['flex-shrink-0 ml-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors', copied ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white']"
          >
            {{ copied ? '✓ Copiado' : 'Copiar' }}
          </button>
        </div>

        <!-- Info Text -->
        <p class="text-xs text-[var(--fg-3)]">
          Os alunos que acessarem este link poderão se registrar na sua academia sem necessidade de autenticação.
        </p>
      </div>

      <!-- Tips -->
      <div class="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-6">
        <h3 class="font-bold text-white mb-3 flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Dicas
        </h3>
        <ul class="space-y-2 text-sm text-white">
          <li>• Copie o link e envie por WhatsApp, SMS ou email</li>
          <li>• O link é único para sua academia e pode ser compartilhado livremente</li>
          <li>• Não é necessário login para acessar o formulário de registro</li>
          <li>• Os alunos receberão uma confirmação após o registro</li>
        </ul>
      </div>
    </div>

    <!-- Public Registration Modal -->
  </div>
</template>
