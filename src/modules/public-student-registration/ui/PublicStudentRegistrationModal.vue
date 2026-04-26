<script setup lang="ts">
import { computed } from 'vue'
import { usePublicStudentRegistration } from '../composables/usePublicStudentRegistration'
import StudentInfoSection from '@/components/forms/StudentInfoSection.vue'
import EmergencyContactSection from '@/components/forms/EmergencyContactSection.vue'

interface Props {
  academyId: string
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  studentForm,
  isLoading,
  error,
  success,
  setAcademyId,
  registerStudent,
  resetForm
} = usePublicStudentRegistration()

const isVisible = computed(() => props.isOpen)

const handleClose = () => {
  if (!isLoading.value) {
    resetForm()
    emit('close')
  }
}

const handleSubmit = async () => {
  setAcademyId(props.academyId)
  await registerStudent()
  if (success.value) {
    emit('success')
  }
}

// Set academy when it changes
if (props.academyId) {
  setAcademyId(props.academyId)
}
</script>

<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="handleClose"
    />
  </Transition>

  <!-- Modal -->
  <Transition name="slide">
    <div v-if="isVisible" class="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[var(--bg-elevated)] border-l border-[var(--border-subtle)] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
        <h2 class="text-lg font-bold text-[var(--fg-1)]">Registrar Aluno</h2>
        <button
          @click="handleClose"
          :disabled="isLoading"
          class="p-1.5 hover:bg-[var(--bg-app)] rounded-lg transition-colors text-[var(--fg-2)] disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6l-12 12M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Success Message -->
        <div v-if="success" class="bg-green-500 bg-opacity-10 border-b border-green-500 border-opacity-20 px-6 py-3 text-sm text-green-400">
          ✓ Cadastro realizado com sucesso! Bem-vindo à academia.
        </div>

        <!-- Error Message -->
        <div v-if="error && !success" class="bg-red-500 bg-opacity-10 border-b border-red-500 border-opacity-20 px-6 py-3 text-sm text-red-400">
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="px-6 py-6 space-y-6">
          <StudentInfoSection
            :name="studentForm.name"
            :cpf="studentForm.cpf"
            :phone="studentForm.phone"
            :dateOfBirth="studentForm.date_of_birth"
            :belt="studentForm.belt"
            :disabled="isLoading"
            @update:name="studentForm.name = $event"
            @update:cpf="studentForm.cpf = $event"
            @update:phone="studentForm.phone = $event"
            @update:dateOfBirth="studentForm.date_of_birth = $event"
            @update:belt="studentForm.belt = $event"
          />

          <div class="border-b border-[var(--border-subtle)]"></div>

          <EmergencyContactSection
            :name="studentForm.emergency_contact_name"
            :phone="studentForm.emergency_contact_phone"
            :disabled="isLoading"
            @update:name="studentForm.emergency_contact_name = $event"
            @update:phone="studentForm.emergency_contact_phone = $event"
          />

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-4 py-2.5 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isLoading ? 'Cadastrando...' : 'Fazer Cadastro' }}
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
