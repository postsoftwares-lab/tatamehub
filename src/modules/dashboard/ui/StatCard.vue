<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: string
  color: 'blue' | 'green' | 'red' | 'amber'
}

withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const bgColor = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  red: 'bg-red-50',
  amber: 'bg-amber-50'
}

const textColor = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  red: 'text-red-600',
  amber: 'text-amber-600'
}

const borderColor = {
  blue: 'border-blue-200',
  green: 'border-green-200',
  red: 'border-red-200',
  amber: 'border-amber-200'
}
</script>

<template>
  <div :class="[bgColor[color], borderColor[color]]" class="rounded-lg border p-6 transition-all duration-150 hover:shadow-md cursor-pointer group">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-[var(--fg-3)] mb-2">{{ label }}</p>
        <p class="text-3xl font-bold text-[var(--fg-1)]">{{ value }}</p>
      </div>
      <div :class="textColor[color]" class="text-3xl">{{ icon }}</div>
    </div>
    <div :class="textColor[color]" class="mt-4 inline-flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
      Ver detalhes
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M9 5l7 7-7 7"/>
      </svg>
    </div>
  </div>
</template>
