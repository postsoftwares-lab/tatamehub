<script setup lang="ts">
interface Props {
  name: string
  cpf: string
  phone: string
  dateOfBirth: string
  belt: string
  disabled?: boolean
}

defineProps<Props>()

defineEmits<{
  'update:name': [value: string]
  'update:cpf': [value: string]
  'update:phone': [value: string]
  'update:dateOfBirth': [value: string]
  'update:belt': [value: string]
}>()
</script>

<template>
  <div class="mb-6">
    <h3 class="text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide mb-3">Informações Pessoais</h3>
    <div class="space-y-3">
      <!-- Nome -->
      <div>
        <label class="text-xs font-medium text-[var(--fg-3)] mb-1 block">Nome *</label>
        <input
          :value="name"
          @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
          type="text"
          :disabled="disabled"
          class="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          placeholder="Nome completo"
        />
      </div>

      <!-- CPF e Telefone -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-medium text-[var(--fg-3)] mb-1 block">CPF</label>
          <input
            :value="cpf"
            @input="$emit('update:cpf', ($event.target as HTMLInputElement).value)"
            type="text"
            :disabled="disabled"
            class="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            placeholder="000.000.000-00"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--fg-3)] mb-1 block">Telefone *</label>
          <input
            :value="phone"
            @input="$emit('update:phone', ($event.target as HTMLInputElement).value)"
            type="tel"
            :disabled="disabled"
            class="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <!-- Data Nascimento e Faixa -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-medium text-[var(--fg-3)] mb-1 block">Data de Nascimento</label>
          <input
            :value="dateOfBirth"
            @input="$emit('update:dateOfBirth', ($event.target as HTMLInputElement).value)"
            type="date"
            :disabled="disabled"
            class="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--fg-3)] mb-1 block">Faixa</label>
          <select
            :value="belt"
            @input="$emit('update:belt', ($event.target as HTMLSelectElement).value)"
            :disabled="disabled"
            class="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <option value="">Selecione</option>
            <option value="Branca">Branca</option>
            <option value="Azul">Azul</option>
            <option value="Roxa">Roxa</option>
            <option value="Marrom">Marrom</option>
            <option value="Preta">Preta</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
