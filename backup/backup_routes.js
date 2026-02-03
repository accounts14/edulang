const routes = [
  // Layout Utama (Pakai Header & Footer)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
    ]
  },

  // === HALAMAN DASHBOARD BERDASARKAN ROLE ===
  // User Dashboard (untuk role 'user')
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'), // atau layout khusus jika ada
    children: [
      {
        path: '',
        name: 'UserDashboard',
        component: () => import('pages/user/UserDashboard.vue'),
        meta: { requiresAuth: true, allowedRoles: ['user'] }
      }
    ]
  },

  // Mentor Dashboard (opsional, jika ada)
  {
    path: '/mentor/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'MentorDashboard',
        component: () => import('pages/mentor/DashboardPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor', 'admin'] }
      }
    ]
  },

  // Admin Dashboard (opsional)
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('pages/admin/DashboardPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] }
      }
    ]
  },

  // Halaman Auth (Tanpa Header & Footer)
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/RegisterPage.vue')
  },

  // Error 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes