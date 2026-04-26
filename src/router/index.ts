import LoginPage from '@/modules/auth/pages/login/page/LoginPage.vue'
import RegisterPage from '@/modules/auth/pages/register/page/RegisterPage.vue'
import AcademySetupPage from '@/modules/dashboard/pages/academy-setup/page/AcademySetupPage.vue'
import StudentRegistrationPage from '@/modules/student-registration/page/StudentRegistrationPage.vue'
import DashboardLayout from '@/modules/dashboard/layout/DashboardLayout.vue'
import HomeDashboardPage from '@/modules/dashboard/pages/home/page/HomeDashboardPage.vue'
import StudentsPage from '@/modules/dashboard/pages/students/page/StudentsPage.vue'
import AcademyPage from '@/modules/dashboard/pages/academy/page/AcademyPage.vue'
import StudentLinkPage from '@/modules/dashboard/pages/student-link/page/StudentLinkPage.vue'
import FinancesPage from '@/modules/dashboard/pages/finances/page/FinancesPage.vue'
import SchedulePage from '@/modules/dashboard/pages/schedule/page/SchedulePage.vue'
import ReportsPage from '@/modules/dashboard/pages/reports/page/ReportsPage.vue'
import StudentDetailPage from '@/modules/student-detail/page/StudentDetailPage.vue'
import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { apiService } from '@/services/api'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/academy-setup',
    name: 'AcademySetup',
    component: AcademySetupPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: HomeDashboardPage
      },
      {
        path: 'alunos',
        name: 'Students',
        component: StudentsPage
      },
      {
        path: 'academia',
        name: 'Academy',
        component: AcademyPage
      },
      {
        path: 'cadastro-via-link',
        name: 'StudentLink',
        component: StudentLinkPage
      },
      {
        path: 'financeiro',
        name: 'Finances',
        component: FinancesPage
      },
      {
        path: 'agendamento',
        name: 'Schedule',
        component: SchedulePage
      },
      {
        path: 'relatorios',
        name: 'Reports',
        component: ReportsPage
      }
    ]
  },
  {
    path: '/student-registration',
    name: 'StudentRegistration',
    component: StudentRegistrationPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/student/:id',
    name: 'StudentDetail',
    component: StudentDetailPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(
  (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const requiresAuth = to.meta.requiresAuth as boolean | undefined
    const isAuthenticated = apiService.isAuthenticated()

    if (requiresAuth && !isAuthenticated) {
      next('/login')
    } else if (!requiresAuth && isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      next('/dashboard')
    } else {
      next()
    }
  }
)

export default router
