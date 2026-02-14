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
        path: 'tips/:slug',
        name: 'BacaArtikel',
        component: () => import('pages/BacaArtikelPage.vue'),
      },
      {
        path: 'alur-belajar',
        name: 'AlurBelajarPage',
        component: () => import('pages/AlurBelajarPage.vue'),
      },
      {
        path: 'alur-belajar/roadmap',
        name: 'AlurBelajarRoadmap',
        component: () => import('pages/AlurBelajarRoadmap.vue'),
      },
      {
        path: 'produk',
        name: 'ProdukPage',
        component: () => import('pages/ProdukPage.vue'),
      },
      {
        path: 'contact',
        name: 'ContactPage',
        component: () => import('pages/ContactPage.vue'),
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('pages/ForgotPasswordPage.vue'),
      },
      {
        path: '/reset-password',
        name: 'reset-password',
        component: () => import('pages/ResetPasswordPage.vue'),
      },
    ],
  },

  // === HALAMAN DASHBOARD BERDASARKAN ROLE ===
  // User Dashboard (layout seperti MentorLayout, bg white dari app/quasar)
  // Alur: Langganan → Mulai Belajar → Learn (video + pertemuan + Deskripsi/Soal) → Kerjakan Soal → Penjelasan AI
  {
    path: '/dashboard',
    component: () => import('layouts/UserLayout.vue'),
    meta: { requiresAuth: true, allowedRoles: ['user'] },
    children: [
      {
        path: '',
        name: 'UserDashboard',
        component: () => import('pages/user/UserDashboard.vue'),
      },
      {
        path: 'langganan',
        name: 'UserLangganan',
        component: () => import('pages/user/UserLanggananPage.vue'),
      },
      {
        path: 'discussion/:packageId',
        name: 'UserDiscussion',
        component: () => import('pages/user/DiscussionPage.vue'),
      },
      // Mulai Belajar: video + daftar pertemuan + tab Deskripsi / Soal + button Kerjakan Soal
      {
        path: 'learn/:packageId/lessons/:order/soal',
        name: 'UserSoal',
        component: () => import('pages/user/UserSoalPage.vue'),
      },
      {
        path: 'learn/:packageId/lessons/:order',
        name: 'UserLearnLesson',
        component: () => import('pages/user/UserLearnPage.vue'),
      },
      {
        path: 'learn/:packageId',
        name: 'UserLearn',
        component: () => import('pages/user/UserLearnPage.vue'),
      },
      {
        path: 'progres',
        name: 'UserProgres',
        component: () => import('pages/user/UserProgresPage.vue'),
      },
      {
        path: 'notifikasi',
        name: 'UserNotifikasi',
        component: () => import('pages/user/UserNotifikasiPage.vue'),
      },
      {
        path: 'transaksi',
        name: 'UserTransaksi',
        component: () => import('pages/user/UserTransaksiPage.vue'),
      },
      {
        path: 'setting',
        name: 'UserSetting',
        component: () => import('pages/user/UserSettingPage.vue'),
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
        path: 'finance-mentor',
        name: 'AdminFinanceMentor',
        component: () => import('pages/admin/FinanceMentorPage.vue'),
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
      {
        path: 'mentor/register',
        name: 'AdminMentorRegister',
        component: () => import('pages/admin/RegisterMentorPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
      },
    ],
  },

  // Mentor: base path /mentor
  // Package & Lessons (route params: id = packageId, order = lessonOrder):
  //   /mentor/packages/add                              → MentorAddPackage      (POST /api/packages)
  //   /mentor/packages/:id                              → MentorPackageDetail   (GET /api/packages/:id)
  //   /mentor/packages/:id/edit                          → MentorEditPackage     (GET/PUT /api/packages/:id)
  //   /mentor/packages/:id/lessons/add                   → MentorPackageAddLesson (POST /api/packages/:id/lessons)
  //   /mentor/packages/:id/lessons/:order/edit           → MentorPackageEditLesson (GET/PUT /api/packages/:id/lessons/:order)
  //   /mentor/packages/:id/lessons/:order/generate-soal  → MentorGenerateSoal    (POST /api/packages/:id/lessons/:order/generate-ai)
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
        path: 'bank',
        name: 'MentorBankSetting',
        component: () => import('pages/mentor/BankSettingPage.vue'), // Pastikan nama file sesuai
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
      // Lebih spesifik dulu (lessons) agar tidak tertukar dengan packages/:id
      {
        path: 'packages/:id/lessons/:order/generate-soal',
        name: 'MentorGenerateSoal',
        component: () => import('pages/mentor/GenerateSoalPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'packages/:id/lessons/:order/edit',
        name: 'MentorPackageEditLesson',
        component: () => import('pages/mentor/EditLessonPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'packages/:id/lessons/add',
        name: 'MentorPackageAddLesson',
        component: () => import('pages/mentor/AddLessonPage.vue'),
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
        path: 'discuss',
        name: 'MentorDiscussList',
        component: () => import('pages/mentor/DiscussListPage.vue'),
        meta: { requiresAuth: true, allowedRoles: ['mentor'] },
      },
      {
        path: 'discuss/:packageId',
        name: 'MentorDiscussDetail',
        component: () => import('pages/mentor/DiscussDetailPage.vue'),
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
