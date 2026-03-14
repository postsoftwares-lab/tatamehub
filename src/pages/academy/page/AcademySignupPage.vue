<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import CardContent from '@/components/ui/CardContent.vue'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { Building2, Upload, AlertCircle, ArrowRight, Dumbbell, ArrowLeft } from 'lucide-vue-next'
import { supabase } from '@/lib/supabase'

const router = useRouter()

const formData = ref({
  name: '',
  martial_art_id: null as number | null,
  image: null as File | null
})

const imagePreview = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const martialArts = ref<Array<{ id: number; name: string }>>([])

onMounted(async () => {
  await loadMartialArts()
})

const loadMartialArts = async () => {
  try {
    const { data, error } = await supabase
      .from('martial_arts')
      .select('id, name')
      .order('name')

    if (error) throw error
    martialArts.value = data || []
  } catch (error) {
    console.error('Erro ao carregar artes marciais:', error)
    errorMessage.value = 'Erro ao carregar artes marciais'
  }
}

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Por favor, selecione uma imagem válida'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'A imagem deve ter no máximo 5MB'
      return
    }

    formData.value.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const validateForm = () => {
  if (!formData.value.name.trim()) {
    errorMessage.value = 'Por favor, preencha o nome da academia'
    return false
  }

  if (!formData.value.martial_art_id) {
    errorMessage.value = 'Por favor, selecione uma arte marcial'
    return false
  }

  if (!formData.value.image) {
    errorMessage.value = 'Por favor, selecione uma foto para a academia'
    return false
  }

  return true
}

const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `academy-logos/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('academy-logos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('academy-logos')
    .getPublicUrl(filePath)

  return data.publicUrl
}

const handleSignup = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      errorMessage.value = 'Usuário não autenticado'
      return
    }

    // Upload da imagem
    let imageUrl = ''
    if (formData.value.image) {
      imageUrl = await uploadImage(formData.value.image)
    }

    // Criar academia
    const { error: academyError } = await supabase
      .from('academies')
      .insert({
        name: formData.value.name.trim(),
        martial_art_id: formData.value.martial_art_id,
        image: imageUrl,
        owner_id: user.id
      })

    if (academyError) throw academyError

    successMessage.value = 'Academia criada com sucesso! Redirecionando...'

    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push('/dashboard')
  } catch (error) {
    console.error('Erro ao criar academia:', error)
    errorMessage.value = 'Erro ao criar academia. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="h-screen w-full flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
    <!-- Back Button -->
    <Button 
      variant="ghost" 
      size="sm" 
      @click="goHome" 
      class="absolute top-3 left-3 gap-2 h-8"
    >
      <ArrowLeft class="h-3 w-3" />
      <span class="hidden sm:inline text-xs">Voltar</span>
    </Button>

    <div class="w-full max-w-md space-y-3 overflow-y-auto max-h-[calc(100vh-2rem)]">
      <!-- Logo/Brand -->
      <div class="text-center space-y-1.5">
        <div class="flex items-center justify-center gap-1.5 mb-1">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Dumbbell class="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            TatameHub
          </h1>
        </div>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Configure sua academia
        </p>
      </div>

      <!-- Academy Signup Card -->
      <Card class="border-2 shadow-xl">
        <CardContent class="pt-4 pb-4">
          <form @submit.prevent="handleSignup" class="space-y-3">
            <!-- Error Message -->
            <div v-if="errorMessage" class="flex items-start gap-2 p-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded">
              <AlertCircle class="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="flex items-start gap-2 p-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded dark:bg-green-950 dark:border-green-800 dark:text-green-400">
              <svg class="h-3 w-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Academy Name Field -->
            <div class="space-y-1">
              <Label for="name" class="text-xs font-medium">
                Nome da Academia
              </Label>
              <div class="relative">
                <Building2 class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  placeholder="Minha Academia"
                  required
                  :disabled="isLoading"
                  class="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            <!-- Martial Art Select -->
            <div class="space-y-1">
              <Label for="martial_art" class="text-xs font-medium">
                Arte Marcial
              </Label>
              <select
                id="martial_art"
                v-model.number="formData.martial_art_id"
                required
                :disabled="isLoading"
                class="w-full h-9 px-3 text-sm rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              >
                <option value="">Selecione uma arte marcial</option>
                <option v-for="art in martialArts" :key="art.id" :value="art.id">
                  {{ art.name }}
                </option>
              </select>
            </div>

            <!-- Image Upload -->
            <div class="space-y-1">
              <Label for="image" class="text-xs font-medium">
                Foto da Academia
              </Label>
              <div class="space-y-2">
                <div v-if="imagePreview" class="relative w-full h-24 rounded-md overflow-hidden border border-input">
                  <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                  <button
                    type="button"
                    @click="imagePreview = ''; formData.image = null"
                    class="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded p-1 hover:bg-destructive/90"
                  >
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <label
                  v-else
                  class="flex items-center justify-center w-full h-24 border-2 border-dashed border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div class="flex flex-col items-center justify-center">
                    <Upload class="h-4 w-4 text-muted-foreground mb-1" />
                    <span class="text-xs text-muted-foreground">Clique para enviar</span>
                  </div>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    @change="handleImageSelect"
                    :disabled="isLoading"
                    class="hidden"
                  />
                </label>
              </div>
            </div>

            <!-- Submit Button -->
            <Button 
              type="submit" 
              class="w-full h-9 text-sm font-medium mt-2" 
              :disabled="isLoading"
            >
              <span v-if="!isLoading" class="flex items-center justify-center gap-2">
                Criar Academia
                <ArrowRight class="h-4 w-4" />
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando academia...
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Footer Text -->
      <p class="text-center text-xs text-muted-foreground px-4">
        Ao continuar, você concorda com nossos
        <router-link to="/terms" class="text-primary hover:underline">Termos</router-link>
        e
        <router-link to="/privacy" class="text-primary hover:underline">Privacidade</router-link>
      </p>
    </div>
  </div>
</template>
