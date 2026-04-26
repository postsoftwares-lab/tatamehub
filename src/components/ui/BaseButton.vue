<script setup lang="ts">
defineOptions({ inheritAttrs: false })

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

const variantClasses = {
  primary: 'bg-[var(--accent)] text-[var(--bg-app)] hover:brightness-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] active:brightness-90',
  secondary: 'bg-[var(--bg-elevated)] text-[var(--fg-1)] border border-[var(--border-subtle)] hover:bg-[var(--bg-high)] hover:border-[var(--border)]',
  ghost: 'bg-transparent text-[var(--fg-1)] border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border)]',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
}

const sizeClasses = {
  sm: 'h-10 px-3 text-[13px] rounded-lg',
  md: 'h-12 px-4 text-sm rounded-[10px]',
  lg: 'h-14 px-6 text-base rounded-[10px]'
}
</script>

<template>
  <button
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center font-semibold tracking-[0.01em] cursor-pointer transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <span v-if="loading" class="w-[18px] h-[18px] border-2 border-[rgba(15,15,17,0.25)] border-t-[var(--bg-app)] rounded-full animate-spin" />
    <slot v-else />
  </button>
</template>
