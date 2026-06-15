import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import RegisterAcademyPage from '@/pages/academy/RegisterAcademyPage.vue'
import StudentRegisterPage from '@/pages/students/page/StudentRegisterPage.vue'
import ListStudentsPage from '@/pages/students/ListStudentsPage.vue'
import PendingPaymentsPage from '@/pages/payments/PendingPaymentsPage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/payments' },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/register', name: 'register', component: RegisterPage },
    {
      path: '/register-academy',
      name: 'register-academy',
      component: RegisterAcademyPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/payments',
      name: 'payments',
      component: PendingPaymentsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/alunos',
      name: 'students',
      component: ListStudentsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/register-student/:academy_id',
      name: 'register-student',
      component: StudentRegisterPage,
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('th_token')
  const requiresAuth = to.meta.requiresAuth
  const isAuthPage = to.name === 'login' || to.name === 'register'

  if (requiresAuth && !token) {
    next({ name: 'login' })
  } else if (token && isAuthPage) {
    next({ name: 'payments' })
  } else {
    next()
  }
})

export default router
