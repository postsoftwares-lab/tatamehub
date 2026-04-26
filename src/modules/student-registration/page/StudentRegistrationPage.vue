<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import StudentInfoSection from '@/components/forms/StudentInfoSection.vue'
import EmergencyContactSection from '@/components/forms/EmergencyContactSection.vue'

const route = useRoute()
const router = useRouter()

const studentForm = ref({
  name: '',
  phone: '',
  cpf: '',
  date_of_birth: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  belt: ''
})

const academyId = ref<string | null>(null)
const isLoading = ref(false)
const error = ref('')
const success = ref(false)
const invalidAcademy = ref(false)

onMounted(async () => {
  // Tenta pegar academy do query param (link público)
  academyId.value = route.query.academy as string || null

  // Se não tem academy no query, tenta carregar do usuário autenticado
  if (!academyId.value && apiService.isAuthenticated()) {
    try {
      const user = await apiService.getUser()
      if (user.academy?.id) {
        academyId.value = user.academy.id
      }
    } catch (err) {
      invalidAcademy.value = true
      error.value = 'Erro ao carregar academia. Tente novamente.'
    }
  }

  // Se ainda não tem academy, mostra erro
  if (!academyId.value) {
    invalidAcademy.value = true
    error.value = 'Link inválido. Verifique o link compartilhado pela academia.'
  }
})

const registerStudent = async () => {
  error.value = ''
  success.value = false

  if (!studentForm.value.name.trim()) {
    error.value = 'Nome é obrigatório'
    return
  }

  if (!studentForm.value.phone.trim()) {
    error.value = 'Telefone é obrigatório'
    return
  }

  if (!academyId.value) {
    error.value = 'Academia não identificada'
    return
  }

  isLoading.value = true

  try {
    await apiService.registerStudentPublic(academyId.value, studentForm.value)
    success.value = true

    // Reset form
    studentForm.value = {
      name: '',
      phone: '',
      cpf: '',
      date_of_birth: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      belt: ''
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err: any) {
    error.value = err.message || 'Erro ao cadastrar. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div v-if="invalidAcademy" class="flex items-center justify-center min-h-screen bg-[var(--bg-app)] text-[var(--fg-1)]">
    <div class="max-w-md w-full mx-auto px-4">
      <div class="text-center space-y-4">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-400 mx-auto">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2 class="text-lg font-bold">Link Inválido</h2>
        <p class="text-[var(--fg-3)] text-sm">{{ error }}</p>
      </div>
    </div>
  </div>

  <div v-else class="bg-[var(--bg-app)] text-[var(--fg-1)]">
    <!-- Header Sticky -->
    <div class="sticky top-0 z-10 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] px-4 md:px-6 py-4">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <h1 class="text-lg font-bold">Cadastro de Aluno</h1>
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
      ✓ Cadastro realizado com sucesso! Bem-vindo à academia.
    </div>

    <!-- Error Message -->
    <div v-if="error && !success" class="bg-red-500 bg-opacity-10 border-b border-red-500 border-opacity-20 px-4 md:px-6 py-2 text-sm text-red-400">
      {{ error }}
    </div>

    <!-- Form Content -->
    <form @submit.prevent="registerStudent" class="max-w-2xl mx-auto px-4 md:px-6 py-6">
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

      <!-- Divider -->
      <div class="border-b border-[var(--border-subtle)] mb-6"></div>

      <EmergencyContactSection
        :name="studentForm.emergency_contact_name"
        :phone="studentForm.emergency_contact_phone"
        :disabled="isLoading"
        @update:name="studentForm.emergency_contact_name = $event"
        @update:phone="studentForm.emergency_contact_phone = $event"
      />

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full px-4 py-2.5 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {{ isLoading ? 'Cadastrando...' : 'Fazer Cadastro' }}
      </button>
    </form>
  </div>
</template>
