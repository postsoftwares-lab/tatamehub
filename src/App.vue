<script setup lang="ts">
import { RouterView } from 'vue-router'
import AuthErrorModal from '@/components/AuthErrorModal.vue'
</script>

<template>
  <RouterView />
  <AuthErrorModal />
</template>
