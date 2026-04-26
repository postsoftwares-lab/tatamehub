<script setup lang="ts">
defineOptions({ inheritAttrs: false })

interface Props {
  modelValue: boolean
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <label v-bind="$attrs" class="inline-flex items-center gap-2 cursor-pointer select-none">
    <input
      :checked="modelValue"
      type="checkbox"
      :disabled="disabled"
      class="absolute opacity-0 pointer-events-none peer"
      @change="handleChange"
    />
    
    <span
      class="inline-flex items-center justify-center w-4 h-4 border border-[var(--border)] rounded bg-[var(--bg-elevated)] text-transparent transition-all duration-200 flex-shrink-0 peer-checked:bg-[var(--accent)] peer-checked:border-[var(--accent)] peer-checked:text-[var(--bg-app)] peer-focus-visible:shadow-[0_0_0_3px_rgba(244,245,247,0.14)]"
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="m5 12 5 5 9-11" />
      </svg>
    </span>

    <span v-if="label" class="text-xs text-[var(--fg-2)]">
      {{ label }}
    </span>
    <slot v-else />
  </label>
</template>
