<script setup lang="ts">
import AuthLayout from '@/modules/auth/ui/AuthLayout.vue'
import LoginForm from '@/modules/auth/ui/LoginForm.vue'
import { useLogin } from '../composables/useLogin'

const { isLoading, errorMessage, login } = useLogin()

const handleSubmit = ({ email, password, remember }: { email: string; password: string; remember: boolean }) => {
  login(email, password, remember)
}
</script>

<template>
  <AuthLayout title="Entrar" subtitle="Bem-vindo de volta, professor.">
    <LoginForm
      :is-loading="isLoading"
      :error-message="errorMessage"
      @submit="handleSubmit"
    />
  </AuthLayout>
</template>
