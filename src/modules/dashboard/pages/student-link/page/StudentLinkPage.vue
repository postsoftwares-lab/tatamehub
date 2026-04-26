<script setup lang="ts">
import { ref } from 'vue'
import { useStudentLink } from '../composables/useStudentLink'
import PublicStudentRegistrationModal from '@/modules/public-student-registration/ui/PublicStudentRegistrationModal.vue'

const {
  academyId,
  academyName,
  registrationLink,
  isLoading,
  error,
  copied,
  copyToClipboard,
  shareLink,
  canShare
} = useStudentLink()

const modalOpen = ref(false)

const openModal = () => {
  if (academyId.value) {
    modalOpen.value = true
  }
}

const closeModal = () => {
  modalOpen.value = false
}
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

      <!-- Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Test Registration Button -->
        <button
          @click="openModal"
          class="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="11" x2="19" y2="17"/><line x1="16" y1="14" x2="22" y2="14"/>
          </svg>
          Testar Formulário
        </button>

        <!-- Share Button -->
        <button
          v-if="canShare"
          @click="shareLink"
          class="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--bg-app)] hover:bg-[var(--bg-high)] border border-[var(--border-subtle)] text-[var(--fg-1)] font-medium transition-colors"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="5.92" x2="8.59" y2="10.01"/>
          </svg>
          Compartilhar
        </button>
      </div>

      <!-- Tips -->
      <div class="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-6">
        <h3 class="font-bold text-blue-400 mb-3 flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Dicas
        </h3>
        <ul class="space-y-2 text-sm text-blue-300">
          <li>• Copie o link e envie por WhatsApp, SMS ou email</li>
          <li>• O link é único para sua academia e pode ser compartilhado livremente</li>
          <li>• Não é necessário login para acessar o formulário de registro</li>
          <li>• Os alunos receberão uma confirmação após o registro</li>
        </ul>
      </div>
    </div>

    <!-- Public Registration Modal -->
    <PublicStudentRegistrationModal
      v-if="academyId"
      :academy-id="academyId"
      :is-open="modalOpen"
      @close="closeModal"
      @success="closeModal"
    />
  </div>
</template>
