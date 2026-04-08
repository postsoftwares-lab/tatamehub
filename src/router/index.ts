import { createRouter, createWebHistory } from 'vue-router'

// Importando apenas as páginas necessárias
import LandingPage from '@/pages/onboarding/page/LandingPage.vue'
import TermsPage from '@/pages/legal/page/TermsPage.vue'
import PrivacyPage from '@/pages/legal/page/PrivacyPage.vue'
import StudentRegisterPage from '@/pages/students/page/StudentRegisterPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsPage
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyPage
    },
    {
      path: '/register-student/:academy_id',
      name: 'register-student',
      component: StudentRegisterPage
    }
  ]
})

export default router
