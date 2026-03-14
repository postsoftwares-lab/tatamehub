<script setup lang="ts">
import { computed } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  type DialogRootEmits,
  type DialogRootProps,
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const delegatedProps = computed(() => {
  const { open, defaultOpen, modal, ...delegated } = props
  return delegated
})
</script>

<template>
  <DialogRoot v-bind="delegatedProps" :open="open" :default-open="defaultOpen" :modal="modal" @update:open="emits('update:open', $event)">
    <slot />
  </DialogRoot>
</template>
