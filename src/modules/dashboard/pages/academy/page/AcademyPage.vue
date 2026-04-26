<script setup lang="ts">
import { useAcademy } from '../composables/useAcademy'

const { academy, isLoading } = useAcademy()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 md:px-6 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-2">Academia</h1>
      <p class="text-[var(--fg-3)]">Dados da sua academia</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-[var(--fg-3)]">Carregando academia...</p>
      </div>
    </div>

    <!-- Academy Card -->
    <div v-else-if="academy" class="bg-[var(--bg-elevated)] rounded-lg p-8 border border-[var(--border-subtle)]">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-[var(--fg-1)] mb-2">{{ academy.name }}</h2>
        <p class="text-[var(--fg-3)]">Gerenciada desde {{ new Date(academy.created_at).toLocaleDateString('pt-BR') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-[var(--bg-app)] rounded-lg p-6 border border-[var(--border-subtle)]">
          <p class="text-xs font-medium text-[var(--fg-3)] mb-3">Valor da Mensalidade</p>
          <p class="text-3xl font-bold text-green-400 mb-2">R$ {{ academy.monthly_fee ? academy.monthly_fee.toFixed(2) : '0.00' }}</p>
          <p class="text-xs text-[var(--fg-3)]">Valor cobrado por aluno</p>
        </div>

        <div class="bg-[var(--bg-app)] rounded-lg p-6 border border-[var(--border-subtle)]">
          <p class="text-xs font-medium text-[var(--fg-3)] mb-3">Dia de Cobrança</p>
          <p class="text-3xl font-bold text-blue-400 mb-2">Dia {{ academy.billing_day }}</p>
          <p class="text-xs text-[var(--fg-3)]">Dia do mês para cobrança de mensalidades</p>
        </div>
      </div>

      <div class="mt-8 flex gap-3 flex-wrap">
        <button class="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium transition-colors hover:bg-blue-600">
          Editar Academia
        </button>
        <button class="px-4 py-2 rounded-lg bg-[var(--bg-app)] text-[var(--fg-2)] border border-[var(--border-subtle)] font-medium transition-colors hover:border-[var(--border)]">
          Ver Configurações
        </button>
      </div>
    </div>

    <!-- No Academy State -->
    <div v-else class="flex items-center justify-center py-20">
      <div class="text-center">
        <p class="text-lg font-medium text-[var(--fg-2)]">Nenhuma academia configurada</p>
        <p class="text-sm text-[var(--fg-3)]">Você precisa criar uma academia para acessar esta seção</p>
      </div>
    </div>
  </div>
</template>
