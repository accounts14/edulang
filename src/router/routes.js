const routes = [
  // Layout Utama (Pakai Header & Footer)
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'courses/:id',
        name: 'CourseDetail',
        component: () => import('pages/CourseDetailPage.vue'),
      },
      {
        path: 'courses/:id/buy',
        name: 'BuyCourse',
        component: () => import('pages/BuyCoursePage.vue'),
      },
      {
        path: 'berlangganan',
        name: 'BerlanggananPage',
        component: () => import('pages/BerlanggananPage.vue'),
      },
      {
        path: 'tips',
        name: 'TipsInformasiPage',
        component: () => import('pages/TipsPage.vue'),
      },
      {
        path: 'contact',
        name: 'ContactPage',
        component: () => import('pages/ContactPage.vue'),
      },
    ],
  },

  // === HALAMAN DASHBOARD BERDASARKAN ROLE ===
  // User Dashboard (untuk role 'user')
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'UserDashboard',
        component: () => import('pages/user/UserDashboard.vue'),
        meta: { requiresAuth: true, allowedRoles: ['user'] },
      },
    ],
  },

  // Admin (dashboard + halaman lainnya)
  {
    path: '/admin/dashboard',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('pages/admin/DashboardPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: 'kategori',
        name: 'AdminKategori',
        component: () => import('pages/admin/LanguageCategoryPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'kategori/add',
        name: 'AdminKategoriAdd',
        component: () => import('pages/admin/AddLanguageCategoryPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'kategori/:id/edit',
        name: 'AdminKategoriEdit',
        component: () => import('pages/admin/EditLanguageCategoryPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'mentor',
        name: 'AdminMentor',
        component: () => import('pages/admin/MentorPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'revenue',
        name: 'AdminRevenue',
        component: () => import('pages/admin/RevenuePage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'user',
        name: 'AdminUser',
        component: () => import('pages/admin/UserPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'pendaftar',
        name: 'AdminTerdaftar',
        component: () => import('pages/admin/TerdaftarPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'pendaftar/:id/edit',
        name: 'AdminTerdaftarEdit',
        component: () => import('pages/admin/EditRegisteredUserPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'produk',
        name: 'AdminProduk',
        component: () => import('pages/admin/ProdukPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'artikel',
        name: 'AdminArtikel',
        component: () => import('pages/admin/ArtikelPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'artikel/add',
        name: 'AdminArtikelAdd',
        component: () => import('pages/admin/AddArticlePage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
      {
        path: 'artikel/:slug/edit',
        name: 'AdminArtikelEdit',
        component: () => import('pages/admin/EditArticlePage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
    ],
  },

  {
    path: '/mentor',
    component: () => import('layouts/MentorLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'MentorDashboard',
        component: () => import('pages/mentor/DashboardPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'kelasku',
        name: 'MentorKelasku',
        component: () => import('pages/mentor/KelaskuPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'rating',
        name: 'MentorRatingReview',
        component: () => import('pages/mentor/RatingReviewPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'revenue',
        name: 'MentorRevenue',
        component: () => import('pages/mentor/RevenuePage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'setting',
        name: 'MentorSetting',
        component: () => import('pages/mentor/SettingPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'packages/add',
        name: 'MentorAddPackage',
        component: () => import('pages/mentor/AddPackagePage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'packages/:id/edit',
        name: 'MentorEditPackage',
        component: () => import('pages/mentor/EditPackagePage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'packages/:id',
        name: 'MentorPackageDetail',
        component: () => import('pages/mentor/PackageDetailPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'packages/:id/lessons/add',
        name: 'MentorPackageAddLesson',
        component: () => import('pages/mentor/AddLessonPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'packages/:id/lessons/:order/edit',
        name: 'MentorPackageEditLesson',
        component: () => import('pages/mentor/EditLessonPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
    ],
  },

  // Halaman Auth (Tanpa Header & Footer)
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('pages/RegisterPage.vue'),
  },

  // Error 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
