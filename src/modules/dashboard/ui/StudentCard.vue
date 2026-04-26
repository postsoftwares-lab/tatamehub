<script setup lang="ts">
interface Props {
  name: string
  grade: string
  status: 'ativo' | 'inativo'
  initials: string
  color: string
}

defineProps<Props>()

const statusColor = {
  ativo: { bg: 'bg-green-100', text: 'text-green-700' },
  inativo: { bg: 'bg-red-100', text: 'text-red-700' }
}

const statusLabel = {
  ativo: 'Ativo',
  inativo: 'Inativo'
}
</script>

<template>
  <div class="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] transition-all duration-150 hover:border-[var(--border)] hover:bg-[var(--bg-high)] group cursor-pointer">
    <div class="flex items-center gap-4 flex-1">
      <div :class="color" class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {{ initials }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="font-medium text-[var(--fg-1)] truncate">{{ name }}</p>
        <p class="text-sm text-[var(--fg-3)]">{{ grade }}</p>
      </div>
    </div>
    <div :class="[statusColor[status].bg, statusColor[status].text]" class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
      {{ statusLabel[status] }}
    </div>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="text-[var(--fg-3)] group-hover:text-[var(--fg-1)] transition-colors ml-3 flex-shrink-0">
      <path d="M9 5l7 7-7 7"/>
    </svg>
  </div>
</template>
