<script setup lang="ts">
interface Props {
  name: string
  date: string
  amount: string
  status: 'pago' | 'aberto' | 'atrasado'
}

defineProps<Props>()

const statusIcon = {
  pago: '✓',
  aberto: '⏱',
  atrasado: '✕'
}

const statusColor = {
  pago: { bg: 'bg-green-500', icon: '✓' },
  aberto: { bg: 'bg-amber-500', icon: '⏱' },
  atrasado: { bg: 'bg-red-500', icon: '✕' }
}
</script>

<template>
  <div class="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-app)] border border-[var(--border-subtle)] transition-all duration-150 hover:border-[var(--border)] hover:bg-[var(--bg-high)] group cursor-pointer">
    <div class="flex items-center gap-4 flex-1">
      <div :class="statusColor[status].bg" class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {{ statusIcon[status] }}
      </div>
      <div class="min-w-0 flex-1">
        <p class="font-medium text-[var(--fg-1)] truncate">{{ name }}</p>
        <p class="text-sm text-[var(--fg-3)]">{{ date }}</p>
      </div>
    </div>
    <div class="text-right flex-shrink-0">
      <p class="font-bold text-[var(--fg-1)]">{{ amount }}</p>
    </div>
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" class="text-[var(--fg-3)] group-hover:text-[var(--fg-1)] transition-colors ml-3 flex-shrink-0">
      <path d="M9 5l7 7-7 7"/>
    </svg>
  </div>
</template>
