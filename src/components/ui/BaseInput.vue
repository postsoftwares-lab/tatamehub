<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props {
  modelValue: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  disabled?: boolean
  error?: boolean
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  error: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isFilled = computed(() => props.modelValue.length > 0)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="relative flex items-center h-12 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[10px] py-2 transition-all duration-200"
    :class="{
      'border-[var(--border)] hover:border-[var(--border)]': !error,
      'border-red-500 focus-within:border-red-500': error,
      'focus-within:border-[var(--accent)] focus-within:bg-[var(--bg-high)] focus-within:shadow-[0_0_0_3px_rgba(244,245,247,0.10)]': !error
    }"
  >
    <span
      v-if="$slots.icon"
      class="inline-flex items-center justify-center text-[var(--fg-3)] flex-shrink-0 transition-colors duration-200 px-2"
      :class="{ 'text-[var(--fg-1)]': isFilled }"
    >
      <slot name="icon" />
    </span>

    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="autocomplete"
      class="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-[var(--fg-1)] text-sm font-normal tracking-[0.01em] select-text placeholder:text-[var(--fg-3)] disabled:opacity-60 disabled:cursor-not-allowed"
      @input="handleInput"
    />

    <slot name="suffix" />
  </div>
</template>
