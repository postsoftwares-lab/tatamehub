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
            <h1 class="text-4xl font-bold">Política de Privacidade</h1>
            <p class="text-muted-foreground">Última atualização: Março de 2026</p>
          </div>

          <!-- Content -->
          <div class="prose prose-sm dark:prose-invert max-w-none space-y-6">
            <!-- 1. Introdução -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">1. Introdução</h2>
              <p class="text-muted-foreground">
                O TatameHub ("nós", "nosso" ou "nos") opera a plataforma TatameHub. Esta página informa você sobre nossas políticas sobre coleta, uso e divulgação de dados pessoais quando você usa nosso serviço.
              </p>
            </section>

            <!-- 2. Dados Coletados -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">2. Dados Coletados</h2>
              <p class="text-muted-foreground mb-2">Coletamos os seguintes tipos de dados:</p>
              <ul class="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Dados de Conta:</strong> Nome, email, CPF, telefone</li>
                <li><strong>Dados da Academia:</strong> Nome, tipo de arte marcial, logo/imagem</li>
                <li><strong>Dados de Alunos:</strong> Nome, data de nascimento, CPF, gênero, faixa, peso, categoria</li>
                <li><strong>Dados de Uso:</strong> Informações sobre como você usa o serviço (logs de acesso, ações realizadas)</li>
              </ul>
            </section>

            <!-- 3. Como Usamos Seus Dados -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">3. Como Usamos Seus Dados</h2>
              <p class="text-muted-foreground mb-2">Usamos os dados coletados para:</p>
              <ul class="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Fornecer, manter e melhorar o serviço</li>
                <li>Autenticar sua conta e manter a segurança</li>
                <li>Responder a suas solicitações e perguntas</li>
                <li>Enviar atualizações e notificações importantes</li>
                <li>Analisar o uso do serviço para melhorias</li>
              </ul>
            </section>

            <!-- 4. Segurança dos Dados -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">4. Segurança dos Dados</h2>
              <p class="text-muted-foreground">
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Todos os dados são criptografados em trânsito e em repouso.
              </p>
            </section>

            <!-- 5. Compartilhamento de Dados -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">5. Compartilhamento de Dados</h2>
              <p class="text-muted-foreground">
                Não compartilhamos seus dados pessoais com terceiros, exceto quando necessário para fornecer o serviço (como provedores de hospedagem) ou quando exigido por lei. Seus dados de alunos são acessíveis apenas por você e por pessoas que você autorizar.
              </p>
            </section>

            <!-- 6. Retenção de Dados -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">6. Retenção de Dados</h2>
              <p class="text-muted-foreground">
                Mantemos seus dados enquanto sua conta estiver ativa. Se você solicitar a exclusão de sua conta, todos os seus dados serão permanentemente deletados em até 30 dias, exceto quando obrigados por lei a manter registros.
              </p>
            </section>

            <!-- 7. Seus Direitos -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">7. Seus Direitos</h2>
              <p class="text-muted-foreground mb-2">Você tem o direito de:</p>
              <ul class="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Exportar seus dados em formato legível</li>
                <li>Revogar consentimento a qualquer momento</li>
              </ul>
            </section>

            <!-- 8. Cookies e Rastreamento -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">8. Cookies e Rastreamento</h2>
              <p class="text-muted-foreground">
                O TatameHub usa cookies essenciais para autenticação e funcionalidade do serviço. Não usamos cookies de rastreamento ou publicidade. Você pode desabilitar cookies em seu navegador, mas isso pode afetar a funcionalidade do serviço.
              </p>
            </section>

            <!-- 9. Conformidade com Leis -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">9. Conformidade com Leis</h2>
              <p class="text-muted-foreground">
                O TatameHub está em conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil e outras leis de proteção de dados aplicáveis. Você tem direitos adicionais sob essas leis.
              </p>
            </section>

            <!-- 10. Alterações na Política -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">10. Alterações na Política</h2>
              <p class="text-muted-foreground">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por email ou através de um aviso proeminente no serviço.
              </p>
            </section>

            <!-- 11. Contato -->
            <section class="space-y-3">
              <h2 class="text-2xl font-semibold">11. Contato</h2>
              <p class="text-muted-foreground">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, entre em contato conosco através do email: privacy@tatamedub.com
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
