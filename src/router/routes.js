const routes = [
  // Layout Utama (Pakai Header & Footer)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // Halaman Auth (Tanpa Header & Footer)
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue') // Langsung panggil Page-nya
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