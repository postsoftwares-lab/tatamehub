<script setup lang="ts">
interface Props {
  name: string
  phone: string
  disabled?: boolean
}

defineProps<Props>()

defineEmits<{
  'update:name': [value: string]
  'update:phone': [value: string]
}>()
</script>

<template>
  <div class="mb-6">
    <h3 class="text-xs font-semibold text-[var(--fg-3)] uppercase tracking-wide mb-3">Contato de Emergência</h3>
    <div class="space-y-3">
      <!-- Nome e Telefone -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-medium text-[var(--fg-3)] mb-1 block">Nome</label>
          <input
            :value="name"
            @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
            type="text"
            :disabled="disabled"
            class="w-full px-3 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--fg-1)] text-sm placeholder-[var(--fg-3)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            placeholder="Nome do responsável"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--fg-3)] mb-1 block">Telefone</label>
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
    </div>
  </div>
</template>
