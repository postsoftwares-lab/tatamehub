<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Dumbbell } from 'lucide-vue-next'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
    <!-- Header -->
    <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div class="w-full max-w-7xl mx-auto flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="sm" @click="goBack" class="gap-2">
          <ArrowLeft class="h-4 w-4" />
          <span class="hidden sm:inline">Voltar</span>
        </Button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full py-12 md:py-16">
      <div class="max-w-4xl mx-auto px-4 md:px-6">
        <div class="space-y-8">
          <!-- Title -->
          <div class="space-y-2">
            <h1 class="text-4xl font-bold">Termos de Serviço</h1>
            <p class="text-muted-foreground">Última atualização: Março de 2026</p>
          </div>

          <!-- Content -->
          <div class="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <!-- 1. Aceitação dos Termos -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">1. Aceitação dos Termos</h2>
              <p class="text-muted-foreground">
                Ao acessar e usar o TatameHub, você concorda em estar vinculado por estes Termos de Serviço. Se você não concorda com qualquer parte destes termos, você não pode usar o serviço.
              </p>
            </section>

            <!-- 2. Descrição do Serviço -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">2. Descrição do Serviço</h2>
              <p class="text-muted-foreground">
                O TatameHub é uma plataforma de gestão de alunos para academias de artes marciais. O serviço permite que professores e administradores de academias cadastrem, organizem e gerenciem informações de seus alunos de forma centralizada e segura.
              </p>
            </section>

            <!-- 3. Conta de Usuário -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">3. Conta de Usuário</h2>
              <p class="text-muted-foreground">
                Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem em sua conta. Você concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.
              </p>
            </section>

            <!-- 4. Uso Aceitável -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">4. Uso Aceitável</h2>
              <p class="text-muted-foreground mb-2">Você concorda em não usar o TatameHub para:</p>
              <ul class="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Atividades ilegais ou que violem leis aplicáveis</li>
                <li>Assédio, ameaças ou abuso de outros usuários</li>
                <li>Transmissão de conteúdo malicioso ou prejudicial</li>
                <li>Violação de direitos de propriedade intelectual</li>
                <li>Tentativa de acessar dados de outros usuários sem autorização</li>
              </ul>
            </section>

            <!-- 5. Dados do Usuário -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">5. Dados do Usuário</h2>
              <p class="text-muted-foreground">
                Você é responsável pelos dados que você insere no TatameHub. Você concorda em manter dados precisos e atualizados. O TatameHub não é responsável por dados incorretos ou incompletos fornecidos por você.
              </p>
            </section>

            <!-- 6. Propriedade Intelectual -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">6. Propriedade Intelectual</h2>
              <p class="text-muted-foreground">
                Todo o conteúdo, funcionalidades e design do TatameHub são propriedade exclusiva do TatameHub e protegidos por leis de propriedade intelectual. Você não pode reproduzir, distribuir ou transmitir qualquer conteúdo sem permissão prévia.
              </p>
            </section>

            <!-- 7. Limitação de Responsabilidade -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">7. Limitação de Responsabilidade</h2>
              <p class="text-muted-foreground">
                O TatameHub é fornecido "como está" sem garantias de qualquer tipo. Não somos responsáveis por danos indiretos, incidentais ou consequentes resultantes do uso ou incapacidade de usar o serviço.
              </p>
            </section>

            <!-- 8. Modificações do Serviço -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">8. Modificações do Serviço</h2>
              <p class="text-muted-foreground">
                Reservamos o direito de modificar ou descontinuar o TatameHub a qualquer momento. Notificaremos os usuários sobre mudanças significativas com antecedência razoável.
              </p>
            </section>

            <!-- 9. Encerramento -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">9. Encerramento</h2>
              <p class="text-muted-foreground">
                Podemos encerrar sua conta a qualquer momento se você violar estes Termos de Serviço ou por qualquer outro motivo. Você pode solicitar o encerramento de sua conta a qualquer momento.
              </p>
            </section>

            <!-- 10. Contato -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">10. Contato</h2>
              <p class="text-muted-foreground">
                Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco através do email: support@tatamedub.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.prose {
  @apply text-foreground;
}

.prose h2 {
  @apply text-foreground;
}

.prose p {
  @apply text-muted-foreground;
}

.prose ul {
  @apply text-muted-foreground;
}
</style>
