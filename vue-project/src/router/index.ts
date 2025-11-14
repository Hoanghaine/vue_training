import { useAuthStore } from '@/stores/useAuthStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'MainLayout',
      component: () => import('@/components/MainLayout.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          meta: { requiresAuth: true },
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: '/transactions',
          name: 'Transactions',
          meta: { requiresAuth: true },
          component: () => import('@/views/TransactionsView.vue'),
        },
        {
          path: '/reports',
          name: 'Reports',
          meta: { requiresAuth: true },
          component: () => import('@/views/ReportsView.vue'),
        },
        {
          path: '/settings',
          name: 'Settings',
          meta: { requiresAuth: true },
          component: () => import('@/views/SettingView.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/views/NotFoundView.vue'),
        },
      ],
    },
  ],
})
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.loading && auth.user === null) {
    await auth.fetchProfile()
  }
  if (to.meta.requiresAuth && !auth.user) {
    console.log('no')
    return { name: 'Login' }
  }
  if (to.name === 'Login' && auth.user) {
    return { name: 'Dashboard' }
  }
})

export default router
