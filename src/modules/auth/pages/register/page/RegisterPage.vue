<script setup lang="ts">
import AuthLayout from '@/modules/auth/ui/AuthLayout.vue'
import RegisterForm from '@/modules/auth/ui/RegisterForm.vue'
import { useRegister } from '../composables/useRegister'

const { isLoading, errorMessage, register } = useRegister()

const handleSubmit = ({
  name,
  cpf,
  email,
  password
}: {
  name: string
  cpf: string
  email: string
  password: string
}) => {
  register(name, cpf, email, password)
}
</script>

<template>
  <AuthLayout title="Criar Conta" subtitle="Bem-vindo ao tatame, professor.">
    <RegisterForm
      :is-loading="isLoading"
      :error-message="errorMessage"
      @submit="handleSubmit"
    />
  </AuthLayout>
</template>
