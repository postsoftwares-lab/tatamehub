<script setup lang="ts">
interface Props {
  icon: string
  label: string
  description: string
  href: string
}

defineProps<Props>()
</script>

<template>
  <a
    :href="href"
    class="group block rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 transition-all duration-150 hover:border-[var(--border)] hover:bg-[var(--bg-high)] hover:shadow-md"
  >
    <div class="mb-4 text-4xl group-hover:scale-110 transition-transform duration-150">{{ icon }}</div>
    <h3 class="font-semibold text-[var(--fg-1)] mb-2 flex items-center gap-2">
      {{ label }}
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" class="text-[var(--fg-3)] group-hover:text-[var(--fg-1)] transition-colors opacity-0 group-hover:opacity-100 -ml-1">
        <path d="M9 5l7 7-7 7"/>
      </svg>
    </h3>
    <p class="text-sm text-[var(--fg-3)] group-hover:text-[var(--fg-2)] transition-colors">{{ description }}</p>
  </a>
</template>
