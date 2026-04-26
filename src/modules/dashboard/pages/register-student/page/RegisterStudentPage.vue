<script setup lang="ts">
import { useRegisterStudent } from '../composables/useRegisterStudent'

const { studentForm, loading, error, success, registerStudent } = useRegisterStudent()
</script>

<template>
  <div class="max-w-xl mx-auto px-4 md:px-6 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-1">Cadastrar Aluno</h1>
      <p class="text-sm text-[var(--fg-3)]">Adicione um novo aluno à sua academia</p>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="mb-4 rounded-lg px-3 py-2 text-sm text-green-400 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20">
      ✓ Aluno cadastrado com sucesso!
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 rounded-lg px-3 py-2 text-sm text-red-400 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20">
      {{ error }}
    </div>

    <!-- Form -->
    <form @submit.prevent="registerStudent" class="bg-[var(--bg-elevated)] rounded-lg p-5 border border-[var(--border-subtle)] space-y-2.5">
      <div>
        <label class="text-xs font-medium text-[var(--fg-3)] mb-1.5 block">Nome *</label>
        <input
          v-model="studentForm.name"
          type="text"
          placeholder="Nome completo do aluno"
          class="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          :disabled="loading"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-[var(--fg-3)] mb-1.5 block">Telefone *</label>
        <input
          v-model="studentForm.phone"
          type="tel"
          placeholder="(11) 99999-9999"
          class="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          :disabled="loading"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-[var(--fg-3)] mb-1.5 block">CPF</label>
        <input
          v-model="studentForm.cpf"
          type="text"
          placeholder="000.000.000-00"
          class="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          :disabled="loading"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-[var(--fg-3)] mb-1.5 block">Data de Nascimento</label>
        <input
          v-model="studentForm.date_of_birth"
          type="date"
          class="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          :disabled="loading"
        />
      </div>

      <div>
        <label class="text-xs font-medium text-[var(--fg-3)] mb-1.5 block">Faixa</label>
        <select
          v-model="studentForm.belt"
          class="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          :disabled="loading"
        >
          <option value="">Selecione uma faixa</option>
          <option value="Branca">Branca</option>
          <option value="Azul">Azul</option>
          <option value="Roxa">Roxa</option>
          <option value="Marrom">Marrom</option>
          <option value="Preta">Preta</option>
        </select>
      </div>

      <!-- Contato de Emergência -->
      <div class="border-t border-[var(--border-subtle)] pt-2.5 mt-1">
        <h3 class="text-xs font-semibold text-[var(--fg-1)] mb-2.5">Contato de Emergência</h3>
        <div class="space-y-2.5">
          <div>
            <label class="text-xs font-medium text-[var(--fg-3)] mb-1.5 block">Nome do Contato</label>
            <input
              v-model="studentForm.emergency_contact_name"
              type="text"
              placeholder="Nome do responsável"
              class="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              :disabled="loading"
            />
          </div>
          <div>
            <label class="text-xs font-medium text-[var(--fg-3)] mb-1.5 block">Telefone</label>
            <input
              v-model="studentForm.emergency_contact_phone"
              type="tel"
              placeholder="(11) 99999-9999"
              class="w-full px-3 py-2 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              :disabled="loading"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full px-4 py-2.5 rounded-lg bg-blue-500 text-white font-medium transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {{ loading ? 'Cadastrando...' : 'Cadastrar Aluno' }}
      </button>
    </form>
  </div>
</template>
