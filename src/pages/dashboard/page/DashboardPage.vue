<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { ownerService } from '@/services/owner.service'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Dialog from '@/components/ui/Dialog.vue'
import DialogContent from '@/components/ui/DialogContent.vue'
import DialogHeader from '@/components/ui/DialogHeader.vue'
import DialogTitle from '@/components/ui/DialogTitle.vue'
import DialogDescription from '@/components/ui/DialogDescription.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { LogOut, Building2, AlertCircle, Link2, Check, Copy } from 'lucide-vue-next'

const router = useRouter()
const userEmail = ref('')
const userName = ref('')
const userFirstName = ref('')
const academyName = ref('')
const academyId = ref('')
const academyImage = ref('')
const academyMartialArt = ref('')
const activeStudentsCount = ref(0)
const isLoading = ref(true)
const showShareLinkModal = ref(false)
const linkCopied = ref(false)

onMounted(async () => {
  const user = await authService.getCurrentUser()
  if (!user) {
    router.push('/login')
    return
  }
  
  userEmail.value = user.email || ''
  
  const { owner, academy } = await ownerService.getOwnerWithAcademy(user.id)
  
  if (owner) {
    userName.value = owner.name
    userFirstName.value = owner.name?.split(' ')[0] || ''
  }
  
  if (!academy) {
    router.push('/academy/signup')
    return
  } else {
    academyName.value = academy.name
    academyId.value = academy.id
    academyImage.value = academy.image || ''
    
    // Buscar nome da arte marcial
    if (academy.martial_art_id) {
      const { data: martialArt } = await supabase
        .from('martial_arts')
        .select('name')
        .eq('id', academy.martial_art_id)
        .single()
      
      if (martialArt) {
        academyMartialArt.value = martialArt.name
      }
    }
    
    // Buscar contagem de alunos ativos
    await loadActiveStudentsCount()
  }
  
  isLoading.value = false
})

const loadActiveStudentsCount = async () => {
  if (!academyId.value) return
  
  const { count, error } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('academy_id', academyId.value)
    .eq('active', true)
  
  if (!error && count !== null) {
    activeStudentsCount.value = count
  }
}

const handleLogout = async () => {
  await authService.logout()
  router.push('/login')
}

const openShareLinkModal = () => {
  linkCopied.value = false
  showShareLinkModal.value = true
}

const copyRegistrationLink = async () => {
  const link = `${window.location.origin}/students/new/${academyId.value}`
  try {
    await navigator.clipboard.writeText(link)
    linkCopied.value = true
    // Fechar modal após 1 segundo
    setTimeout(() => {
      closeShareLinkModal()
    }, 1000)
  } catch (err) {
    console.error('Erro ao copiar link:', err)
  }
}

const closeShareLinkModal = () => {
  showShareLinkModal.value = false
  linkCopied.value = false
}

const registrationLink = computed(() => {
  return `${window.location.origin}/students/new/${academyId.value}`
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Header -->
    <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div class="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Building2 class="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Tatame Hub
            </h1>
            <p v-if="academyName" class="text-xs text-muted-foreground">{{ academyName }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col items-end">
            <span class="text-sm font-medium">{{ userFirstName || 'Usuário' }}</span>
            <span class="text-xs text-muted-foreground">{{ userEmail }}</span>
          </div>
          <Button variant="ghost" size="sm" @click="handleLogout" class="gap-2">
            <LogOut class="h-4 w-4" />
            <span class="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full py-6 md:py-8">
      <div class="space-y-8 max-w-7xl mx-auto px-4 md:px-6">
        <!-- Welcome Section -->
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight">
            Olá, {{ userFirstName || 'Bem-vindo' }}! 👋
          </h2>
          <p class="text-muted-foreground text-lg">
            Aqui está um resumo da sua academia
          </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Alunos Ativos -->
          <Card v-if="!isLoading" class="hover:shadow-lg transition-shadow cursor-pointer" @click="router.push('/students')">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle class="text-sm font-medium">Alunos Ativos</CardTitle>
              <div class="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div class="text-2xl font-bold">{{ activeStudentsCount }}</div>
              <p class="text-xs text-muted-foreground mt-1">Total de alunos cadastrados</p>
            </CardContent>
          </Card>

          <!-- Alunos Loading -->
          <Card v-if="isLoading" class="hover:shadow-lg transition-shadow">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <div class="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div class="h-8 w-8 rounded-lg bg-muted animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div class="h-8 w-12 bg-muted animate-pulse rounded mb-2"></div>
              <div class="h-3 w-40 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>

          <!-- Academia -->
          <Card v-if="!isLoading" class="hover:shadow-lg transition-shadow overflow-hidden">
            <div v-if="academyImage" class="relative w-full h-32 bg-muted">
              <img :src="academyImage" :alt="academyName" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <CardContent :class="academyImage ? 'pt-4' : ''">
              <div class="space-y-2">
                <div class="text-lg font-semibold truncate">{{ academyName || 'Não configurada' }}</div>
                <div v-if="academyMartialArt" class="text-xs text-muted-foreground">
                  {{ academyMartialArt }}
                </div>
                <p class="text-xs text-muted-foreground">Sua academia</p>
              </div>
            </CardContent>
          </Card>

          <!-- Academia Loading -->
          <Card v-if="isLoading" class="hover:shadow-lg transition-shadow">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <div class="h-4 w-24 bg-muted animate-pulse rounded"></div>
              <div class="h-8 w-8 rounded-lg bg-muted animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div class="h-6 w-32 bg-muted animate-pulse rounded mb-2"></div>
              <div class="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        </div>

        <!-- Quick Actions -->
        <div class="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <Button variant="outline" class="w-full justify-start gap-2" @click="router.push('/students/new')">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Cadastrar Novo Aluno
              </Button>
              <Button variant="outline" class="w-full justify-start gap-2" @click="openShareLinkModal" :disabled="!academyId">
                <Link2 class="h-4 w-4" />
                Link para Cadastro de Aluno
              </Button>
              <Button variant="outline" class="w-full justify-start gap-2" disabled>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center justify-center h-32 text-muted-foreground">
                <p class="text-sm">Nenhuma atividade recente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>

    <!-- Overlay Escuro -->
    <div 
      v-if="showShareLinkModal" 
      class="fixed inset-0 bg-black/80 backdrop-blur-sm"
      style="z-index: 9998;"
    ></div>

    <!-- Modal de Compartilhar Link -->
    <Dialog :open="showShareLinkModal" @update:open="closeShareLinkModal">
      <DialogContent class="w-[calc(100%-2rem)] sm:max-w-md m-4 sm:m-0 mx-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle class="text-lg md:text-xl">Link para Cadastro de Aluno</DialogTitle>
          <DialogDescription class="text-sm md:text-base">
            Compartilhe este link com seus alunos para que eles completem o cadastro
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 pt-4">
          <!-- Link Display -->
          <div class="space-y-2">
            <Label class="text-xs md:text-sm">Link de Cadastro</Label>
            <div class="flex items-center gap-2">
              <div class="w-full p-3 rounded-lg border-2 border-border bg-background">
                <p class="text-xs md:text-sm font-mono break-all text-foreground">
                  {{ registrationLink }}
                </p>
              </div>
            </div>
          </div>

          <!-- Copy Button -->
          <Button
            @click="copyRegistrationLink"
            :disabled="linkCopied"
            class="w-full gap-2"
            :variant="linkCopied ? 'secondary' : 'default'"
          >
            <Check v-if="linkCopied" class="h-4 w-4" />
            <Copy v-else class="h-4 w-4" />
            {{ linkCopied ? 'Link Copiado!' : 'Copiar Link' }}
          </Button>

          <!-- Info Text -->
          <p class="text-xs text-muted-foreground text-center">
            O aluno poderá usar este link para se cadastrar diretamente na sua academia
          </p>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
