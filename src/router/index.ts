import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth.service'
import LandingPage from '@/pages/onboarding/page/LandingPage.vue'
import LoginPage from '@/pages/auth/page/LoginPage.vue'
import SignupPage from '@/pages/auth/page/SignupPage.vue'
import AcademySignupPage from '@/pages/academy/page/AcademySignupPage.vue'
import DashboardPage from '@/pages/dashboard/page/DashboardPage.vue'
import TermsPage from '@/pages/legal/page/TermsPage.vue'
import PrivacyPage from '@/pages/legal/page/PrivacyPage.vue'
import StudentsPage from '@/pages/students/page/StudentsPage.vue'
import StudentRegisterPage from '@/pages/students/page/StudentRegisterPage.vue'
import StudentDetailPage from '@/pages/students/page/StudentDetailPage.vue'
import StudentEditPersonalPage from '@/pages/students/page/StudentEditPersonalPage.vue'
import StudentEditContactsPage from '@/pages/students/page/StudentEditContactsPage.vue'
import StudentEditCategoryPage from '@/pages/students/page/StudentEditCategoryPage.vue'
import StudentWelcomePage from '@/pages/students/page/StudentWelcomePage.vue'
import StudentFinishPage from '@/pages/students/page/StudentFinishPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage
    },
    {
      path: '/academy/signup',
      name: 'academy-signup',
      component: AcademySignupPage
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
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage
    },
    {
      path: '/students',
      name: 'students',
      component: StudentsPage
    },
    {
      path: '/students/new/:academy_id',
      name: 'student-welcome',
      component: StudentWelcomePage
    },
    {
      path: '/students/finish',
      name: 'student-finish',
      component: StudentFinishPage
    },
    {
      path: '/students/new',
      name: 'students-new',
      component: StudentRegisterPage
    },
    {
      path: '/students/:id',
      name: 'student-detail',
      component: StudentDetailPage
    },
    {
      path: '/students/:id/edit/personal',
      name: 'student-edit-personal',
      component: StudentEditPersonalPage
    },
    {
      path: '/students/:id/edit/contacts',
      name: 'student-edit-contacts',
      component: StudentEditContactsPage
    },
    {
      path: '/students/:id/edit/category',
      name: 'student-edit-category',
      component: StudentEditCategoryPage
    }
  ]
})

// Rotas que requerem autenticação
const protectedRoutes = [
  'dashboard',
  'students',
  'students-new',
  'student-welcome',
  'student-finish',
  'student-detail',
  'student-edit-personal',
  'student-edit-contacts',
  'student-edit-category',
  'academy-signup'
]

// Guard de autenticação
router.beforeEach(async (to, from, next) => {
  const isProtectedRoute = protectedRoutes.includes(to.name as string)
  
  if (isProtectedRoute) {
    const user = await authService.getCurrentUser()
    if (!user) {
      // Redirecionar para login se não autenticado
      next('/login')
      return
    }
  }
  
  next()
})

export default router
