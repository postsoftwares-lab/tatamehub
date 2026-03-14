<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('Login:', { email: email.value, password: password.value })
  isLoading.value = false
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-2">
      <Label for="email">Email</Label>
      <div class="relative">
        <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          v-model="email"
          type="email"
          placeholder="seu@email.com"
          required
          class="pl-10"
          :disabled="isLoading"
        />
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <Label for="password">Senha</Label>
        <a href="#" class="text-sm text-primary hover:underline">
          Esqueceu a senha?
        </a>
      </div>
      <div class="relative">
        <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          required
          class="pl-10 pr-10"
          :disabled="isLoading"
        />
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
          :disabled="isLoading"
        >
          <Eye v-if="!showPassword" class="h-4 w-4" />
          <EyeOff v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <Button type="submit" class="w-full" :disabled="isLoading">
      <span v-if="!isLoading">Entrar</span>
      <span v-else class="flex items-center gap-2">
        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Entrando...
      </span>
    </Button>
  </form>
</template>
