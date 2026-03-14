<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Zap, Shield, BarChart3, Dumbbell } from 'lucide-vue-next'

const router = useRouter()
const scrollToFeatures = ref<HTMLElement | null>(null)

const goToLogin = () => {
  router.push('/login')
}

const goToSignup = () => {
  router.push('/signup')
}

const goToRegister = () => {
  router.push('/signup')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Navigation -->
    <nav class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div class="w-full max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <div class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex-shrink-0">
            <Dumbbell class="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
          <span class="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent truncate">
            TatameHub
          </span>
        </div>
        
        <div class="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" @click="goToRegister" class="text-xs sm:text-sm">
            <span class="hidden sm:inline">Entrar</span>
            <span class="sm:hidden">Entrar</span>
          </Button>
          <Button @click="goToLogin" size="sm" class="gap-1 sm:gap-2 text-xs sm:text-sm">
            <span class="hidden sm:inline">Já tenho conta</span>
            <span class="sm:hidden">Login</span>
            <ArrowRight class="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="w-full py-8 sm:py-12 md:py-24 lg:py-32">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-6 sm:space-y-8">
        <div class="space-y-4 sm:space-y-6 text-center">
          <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-snug">
            <span class="block">Gestão Simples de Alunos</span>
          </h1>
          
          <p class="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Organize seus alunos, centralize dados importantes e tenha tudo ao alcance de um clique.
          </p>
          <!-- <p class="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sem burocracia, sem complexidade. Feito para o dia a dia do professor.
          </p> -->

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
            <Button @click="goToRegister" size="sm" class="gap-2 text-sm sm:text-base">
              Começar Grátis
              <ArrowRight class="h-4 w-4" />
            </Button>
            <Button variant="outline" @click="goToLogin" size="sm" class="text-sm sm:text-base">
              Já tenho conta
            </Button>
          </div>
        </div>

      </div>
    </section>

    <!-- Problem Section -->
    <section class="w-full py-8 sm:py-12 md:py-24 bg-slate-900/5">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-8 sm:space-y-12">
        <div class="text-center space-y-3 sm:space-y-4">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold">O Problema</h2>
          <p class="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Muitas academias ainda controlam seus alunos através de planilhas, cadernos ou mensagens no WhatsApp
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-background rounded-lg p-4 sm:p-6 border border-border space-y-3">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-semibold text-base sm:text-lg">Dados Desorganizados</h3>
            <p class="text-xs sm:text-sm text-muted-foreground">
              Informações espalhadas em vários lugares, difíceis de encontrar quando necessário
            </p>
          </div>

          <div class="bg-background rounded-lg p-4 sm:p-6 border border-border space-y-3">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-semibold text-base sm:text-lg">Perda de Tempo</h3>
            <p class="text-xs sm:text-sm text-muted-foreground">
              Procurar dados de alunos consome tempo precioso que poderia ser usado no treino
            </p>
          </div>

          <div class="bg-background rounded-lg p-4 sm:p-6 border border-border space-y-3 sm:col-span-2 md:col-span-1">
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="font-semibold text-base sm:text-lg">Difícil Escalar</h3>
            <p class="text-xs sm:text-sm text-muted-foreground">
              Conforme cresce, fica impossível gerenciar sem um sistema organizado
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution Section -->
    <section class="w-full py-8 sm:py-12 md:py-24">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-8 sm:space-y-12">
        <div class="text-center space-y-3 sm:space-y-4">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold">A Solução</h2>
          <p class="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            TatameHub: Gestão simples, rápida e feita para o dia a dia do professor
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <!-- Feature 1 -->
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users class="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div class="space-y-2 min-w-0">
                <h3 class="font-semibold text-base sm:text-lg">Cadastro Centralizado</h3>
                <p class="text-xs sm:text-sm text-muted-foreground">
                  Todos os dados dos seus alunos em um único lugar. Nome, CPF, data de nascimento, faixa, categoria e muito mais.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Zap class="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div class="space-y-2 min-w-0">
                <h3 class="font-semibold text-base sm:text-lg">Busca e Filtros Avançados</h3>
                <p class="text-xs sm:text-sm text-muted-foreground">
                  Encontre qualquer aluno em segundos. Filtre por faixa, categoria, gênero ou idade.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield class="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div class="space-y-2 min-w-0">
                <h3 class="font-semibold text-base sm:text-lg">Link Compartilhável</h3>
                <p class="text-xs sm:text-sm text-muted-foreground">
                  Compartilhe um link com seus alunos para que eles se cadastrem automaticamente. Sem burocracia.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 class="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div class="space-y-2 min-w-0">
                <h3 class="font-semibold text-base sm:text-lg">Categorização Automática</h3>
                <p class="text-xs sm:text-sm text-muted-foreground">
                  O sistema calcula automaticamente a categoria do aluno baseado em idade, peso e gênero.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div class="space-y-2 min-w-0">
                <h3 class="font-semibold text-base sm:text-lg">Simples e Intuitivo</h3>
                <p class="text-xs sm:text-sm text-muted-foreground">
                  Interface limpa e moderna. Sem complicações. Qualquer pessoa consegue usar em minutos.
                </p>
              </div>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div class="space-y-2 min-w-0">
                <h3 class="font-semibold text-base sm:text-lg">Feito para o Dia a Dia</h3>
                <p class="text-xs sm:text-sm text-muted-foreground">
                  Desenvolvido pensando nas necessidades reais do professor de artes marciais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Diferencial Section -->
    <section class="w-full py-8 sm:py-12 md:py-24 bg-slate-900/5">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-8 sm:space-y-12">
        <div class="text-center space-y-3 sm:space-y-4">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold">Por que TatameHub?</h2>
          <p class="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Diferente de sistemas complexos, focamos no que realmente importa
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div class="bg-background rounded-lg p-4 sm:p-6 md:p-8 border border-border space-y-3 sm:space-y-4">
            <h3 class="font-semibold text-base sm:text-lg text-red-500">❌ Sistemas Complexos</h3>
            <ul class="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>• Focam em financeiro e contratos</li>
              <li>• Muitos recursos que você não precisa</li>
              <li>• Difíceis de usar</li>
              <li>• Caros</li>
              <li>• Lentos e burocráticos</li>
            </ul>
          </div>

          <div class="bg-background rounded-lg p-4 sm:p-6 md:p-8 border border-primary/20 space-y-3 sm:space-y-4">
            <h3 class="font-semibold text-base sm:text-lg text-primary">✅ TatameHub</h3>
            <ul class="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>• Foca em organizar alunos</li>
              <li>• Apenas o essencial, nada mais</li>
              <li>• Simples e intuitivo</li>
              <li>• Gratuito</li>
              <li>• Rápido e direto ao ponto</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="w-full py-8 sm:py-12 md:py-24">
      <div class="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        <div class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6 sm:p-8 md:p-12 space-y-4 sm:space-y-6 text-center">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold">
            Pronto para organizar melhor seus alunos?
          </h2>
          
          <p class="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece grátis agora. Sem cartão de crédito. Sem compromisso.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
            <Button @click="goToRegister" size="sm" class="gap-2 text-sm sm:text-base">
              Começar Grátis
              <ArrowRight class="h-4 w-4" />
            </Button>
            <Button variant="outline" @click="goToLogin" size="sm" class="text-sm sm:text-base">
              Já tenho conta
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t bg-background/50 py-6 sm:py-8">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div class="flex items-center gap-2 flex-shrink-0">
            <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Dumbbell class="h-4 w-4 text-primary-foreground" />
            </div>
            <span class="font-semibold text-sm sm:text-base">TatameHub</span>
          </div>
          
          <p class="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
            © 2026 TatameHub. Gestão simples de alunos para academias de artes marciais.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
