<script setup lang="ts">
import { ref } from 'vue'
import { useStudentDetail } from '../composables/useStudentDetail'
import CopyDataModal from '@/components/modals/CopyDataModal.vue'
import StudentInfoSection from '@/components/forms/StudentInfoSection.vue'
import EmergencyContactSection from '@/components/forms/EmergencyContactSection.vue'

const {
  student,
  isLoading,
  isEditing,
  isSaving,
  isTogglingStatus,
  error,
  success,
  editForm,
  toggleEdit,
  toggleStatusWithSave,
  saveChanges,
  goBack
} = useStudentDetail()

const showCopyModal = ref(false)

const openCopyModal = () => {
  showCopyModal.value = true
}

const closeCopyModal = () => {
  showCopyModal.value = false
}
</script>

<template>
  <div v-if="isLoading" class="flex items-center justify-center py-20">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
      <p class="text-[var(--fg-3)]">Carregando dados...</p>
    </div>
  </div>

  <div v-else-if="error" class="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-lg px-4 py-3 text-red-400 max-w-2xl mx-auto my-6">
    {{ error }}
  </div>

  <div v-else-if="student" class="bg-[var(--bg-app)] text-[var(--fg-1)]">
    <!-- Header Sticky -->
    <div class="sticky top-0 z-10 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] px-4 md:px-6 py-4">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <h1 class="text-lg font-bold">Detalhes do Aluno</h1>
        <button
          @click="goBack"
          class="p-1.5 hover:bg-[var(--bg-app)] rounded-lg transition-colors text-[var(--fg-2)]"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6l-12 12M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="bg-green-500 bg-opacity-10 border-b border-green-500 border-opacity-20 px-4 md:px-6 py-2 text-sm text-green-400">
      {{ success }}
    </div>

    <!-- Form Content -->
    <form @submit.prevent="saveChanges" class="max-w-2xl mx-auto px-4 md:px-6 py-6">
      <!-- Action Buttons -->
      <div class="flex gap-2 mb-6 pb-6 border-b border-[var(--border-subtle)]">
        <button
          type="button"
          @click="openCopyModal"
          class="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--fg-2)] border border-[var(--border-subtle)] font-medium text-sm hover:border-[var(--border)] transition-colors flex items-center justify-center gap-2"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          </svg>
          Copiar
        </button>
        <button
          type="button"
          @click="toggleEdit"
          :class="['flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2', isEditing ? 'bg-[var(--bg-elevated)] text-[var(--fg-2)] border border-[var(--border-subtle)] hover:border-[var(--border)]' : 'bg-blue-500 text-white hover:bg-blue-600']"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Editar
        </button>
        <button
          type="button"
          @click="toggleStatusWithSave"
          :disabled="isEditing || isSaving || isTogglingStatus"
          :class="['flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors', editForm.status ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white', 'disabled:opacity-50 disabled:cursor-not-allowed']"
        >
          {{ isTogglingStatus ? 'Salvando...' : (editForm.status ? 'Desativar' : 'Ativar') }}
        </button>
      </div>

      <StudentInfoSection
        :name="editForm.name"
        :cpf="editForm.cpf"
        :phone="editForm.phone"
        :dateOfBirth="editForm.date_of_birth"
        :belt="editForm.belt"
        :disabled="!isEditing"
        @update:name="editForm.name = $event"
        @update:cpf="editForm.cpf = $event"
        @update:phone="editForm.phone = $event"
        @update:dateOfBirth="editForm.date_of_birth = $event"
        @update:belt="editForm.belt = $event"
      />

      <!-- Divider -->
      <div class="border-b border-[var(--border-subtle)] mb-6"></div>

      <EmergencyContactSection
        :name="editForm.emergency_contact_name"
        :phone="editForm.emergency_contact_phone"
        :disabled="!isEditing"
        @update:name="editForm.emergency_contact_name = $event"
        @update:phone="editForm.emergency_contact_phone = $event"
      />

      <!-- Save/Cancel Buttons (only when editing) -->
      <div v-if="isEditing" class="flex gap-3">
        <button
          type="submit"
          :disabled="isSaving"
          class="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isSaving ? 'Salvando...' : 'Salvar' }}
        </button>
        <button
          type="button"
          @click="toggleEdit"
          :disabled="isSaving"
          class="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--fg-2)] border border-[var(--border-subtle)] font-medium text-sm hover:border-[var(--border)] disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>

    <!-- Copy Data Modal -->
    <CopyDataModal
      :is-open="showCopyModal"
      :student-name="student.name"
      :cpf="student.cpf"
      :phone="student.phone"
      :date-of-birth="student.date_of_birth"
      :belt="student.belt"
      @close="closeCopyModal"
    />
  </div>
</template>
