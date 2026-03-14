<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '@/services/auth.service'
import { ownerService } from '@/services/owner.service'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { ArrowLeft, Save, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const studentId = route.params.id as string

const academyId = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

const formData = ref({
  phone: '',
  guardian_phone: ''
})

onMounted(async () => {
  const user = await authService.getCurrentUser()
  if (!user) {
    router.push('/login')
    return
  }

  const { owner, academy } = await ownerService.getOwnerWithAcademy(user.id)
  
  if (!academy) {
    router.push('/dashboard')
    return
  }

  academyId.value = academy.id
  await loadStudent()
})

const loadStudent = async () => {
  isLoading.value = true
  
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .eq('academy_id', academyId.value)
      .single()

    if (error || !data) {
      errorMessage.value = 'Aluno não encontrado.'
      setTimeout(() => router.push('/students'), 2000)
      return
    }

    formData.value = {
      phone: data.phone || '',
      guardian_phone: data.guardian_phone || ''
    }
  } catch (error) {
    console.error('Erro ao carregar aluno:', error)
    errorMessage.value = 'Erro ao carregar dados do aluno.'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push(`/students/${studentId}`)
}

const handleSave = async () => {
  isSaving.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase
      .from('students')
      .update({
        phone: formData.value.phone.trim() || null,
        guardian_phone: formData.value.guardian_phone.trim() || null
      })
      .eq('id', studentId)
      .eq('academy_id', academyId.value)

    if (error) {
      errorMessage.value = 'Erro ao atualizar contatos. Tente novamente.'
      return
    }

    router.push(`/students/${studentId}`)
  } catch (error) {
    errorMessage.value = 'Erro inesperado. Tente novamente.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Header -->
    <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div class="w-full max-w-7xl mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" @click="goBack" class="gap-1 md:gap-2">
            <ArrowLeft class="h-4 w-4" />
            <span class="hidden sm:inline">Voltar</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full py-4 pb-24 md:py-8 md:pb-8">
      <div class="max-w-2xl mx-auto space-y-6 px-4 md:px-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4">
          <Card>
            <CardHeader>
              <div class="h-6 w-48 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="h-10 bg-muted animate-pulse rounded"></div>
              <div class="h-10 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        </div>

        <!-- Edit Form -->
        <div v-else>
          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle class="h-4 w-4 flex-shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <Card>
            <CardHeader class="pb-4">
              <CardTitle class="text-lg md:text-xl">Editar Contatos</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <!-- Telefone -->
                <div class="space-y-2">
                  <Label for="phone">Telefone</Label>
                  <Input
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    :disabled="isSaving"
                  />
                </div>

                <!-- Telefone do Responsável -->
                <div class="space-y-2">
                  <Label for="guardian_phone">Telefone do Responsável</Label>
                  <Input
                    id="guardian_phone"
                    v-model="formData.guardian_phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    :disabled="isSaving"
                  />
                </div>
            </CardContent>
          </Card>

          <!-- Desktop Buttons -->
          <Card class="hidden md:block">
            <CardContent class="pt-6">
              <div class="flex gap-3">
                <Button type="button" variant="outline" @click="goBack" class="flex-1" :disabled="isSaving">
                  Cancelar
                </Button>
                <Button @click="handleSave" class="flex-1" :disabled="isSaving || isLoading">
                  <span v-if="!isSaving" class="flex items-center gap-2">
                    <Save class="h-4 w-4" />
                    Salvar Alterações
                  </span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>

    <!-- Fixed Bottom Buttons (Mobile) -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden z-10">
      <div class="flex gap-2">
        <Button type="button" variant="outline" @click="goBack" class="flex-1" :disabled="isSaving">
          Cancelar
        </Button>
        <Button @click="handleSave" class="flex-1" :disabled="isSaving || isLoading">
          <span v-if="!isSaving" class="flex items-center justify-center gap-2">
            <Save class="h-4 w-4" />
            Salvar
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Salvando...
          </span>
        </Button>
      </div>
    </div>

  </div>
</template>
