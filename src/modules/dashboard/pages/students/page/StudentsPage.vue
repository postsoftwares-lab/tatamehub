<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useStudents } from '../composables/useStudents'

const router = useRouter()
const {
  filteredStudents,
  studentsLoading,
  selectedStudentStatus,
  studentSearchQuery,
  filterStudents,
  getInitials
} = useStudents()

const openStudentDetail = (studentId: string) => {
  router.push(`/student/${studentId}`)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6 py-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">Alunos</h1>
      <p class="text-sm text-[var(--fg-3)]">{{ filteredStudents.length }} aluno{{ filteredStudents.length !== 1 ? 's' : '' }} encontrado{{ filteredStudents.length !== 1 ? 's' : '' }}</p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 space-y-4">
      <div class="relative">
        <input
          v-model="studentSearchQuery"
          type="text"
          placeholder="Buscar por nome ou CPF..."
          class="w-full px-4 py-2.5 pl-10 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--fg-3)]">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      <!-- Status Filter Tabs -->
      <div class="flex gap-2 flex-wrap">
        <button
          @click="filterStudents(undefined)"
          :class="['px-4 py-2 rounded-lg font-medium transition-colors', selectedStudentStatus === undefined ? 'bg-blue-500 text-white' : 'bg-[var(--bg-app)] text-[var(--fg-2)] border border-[var(--border-subtle)] hover:border-[var(--border)]']"
        >Todos</button>
        <button
          @click="filterStudents('true')"
          :class="['px-4 py-2 rounded-lg font-medium transition-colors', selectedStudentStatus === 'true' ? 'bg-green-500 text-white' : 'bg-[var(--bg-app)] text-[var(--fg-2)] border border-[var(--border-subtle)] hover:border-[var(--border)]']"
        >Ativos</button>
        <button
          @click="filterStudents('false')"
          :class="['px-4 py-2 rounded-lg font-medium transition-colors', selectedStudentStatus === 'false' ? 'bg-red-500 text-white' : 'bg-[var(--bg-app)] text-[var(--fg-2)] border border-[var(--border-subtle)] hover:border-[var(--border)]']"
        >Inativos</button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="studentsLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-[var(--fg-3)]">Carregando alunos...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredStudents.length === 0" class="flex items-center justify-center py-20">
      <div class="text-center">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--fg-3)] mx-auto mb-4">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p class="text-lg font-medium text-[var(--fg-2)] mb-2">Nenhum aluno foi encontrado</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[var(--border-subtle)]">
              <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide">Aluno</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide">CPF</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide">Telefone</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide">Faixa</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide">Cadastro</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide">Status</th>
              <th class="px-6 py-4 text-center text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              @click="openStudentDetail(student.id)"
              class="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-app)] transition-colors cursor-pointer"
            >
              <!-- Aluno -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {{ getInitials(student.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-[var(--fg-1)] truncate">{{ student.name }}</p>
                  </div>
                </div>
              </td>

              <!-- CPF -->
              <td class="px-6 py-4">
                <p class="text-sm text-[var(--fg-2)]">{{ student.cpf }}</p>
              </td>

              <!-- Telefone -->
              <td class="px-6 py-4">
                <p class="text-sm text-[var(--fg-2)]">{{ student.phone }}</p>
              </td>

              <!-- Faixa -->
              <td class="px-6 py-4">
                <span v-if="student.belt" class="inline-block px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
                  {{ student.belt }}
                </span>
                <span v-else class="text-xs text-[var(--fg-3)]">-</span>
              </td>

              <!-- Cadastro -->
              <td class="px-6 py-4">
                <p class="text-sm text-[var(--fg-2)]">{{ new Date(student.created_at).toLocaleDateString('pt-BR') }}</p>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <span :class="['inline-block px-3 py-1 rounded-full text-xs font-semibold text-white', student.status ? 'bg-green-500' : 'bg-red-500']">
                  {{ student.status ? 'Ativo' : 'Inativo' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-center">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--fg-3)] inline-flex">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
