<template>
  <q-layout view="lHh Lpr lff" class="font-poppins">
    <q-drawer
      v-model="leftDrawerOpen"
      side="right"
      bordered
      behavior="mobile"
      class="bg-white"
      :width="280"
    >
      <q-list class="q-pa-md">
        <!-- Logo -->
        <q-item class="q-mb-md">
          <q-item-section>
            <img src="~assets/Edulang.png" style="height: 40px; width: auto" alt="Edulang Logo" />
          </q-item-section>
        </q-item>

        <!-- Navigasi Utama -->
        <q-item clickable v-ripple @click="$router.push('/')" class="text-weight-bold text-primary">
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/berlangganan')">
          <q-item-section>Kelas Bahasa</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/berlangganan')">
          <q-item-section>Berlangganan</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/metode-belajar')">
          <q-item-section>Metode Belajar</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/alur-belajar')">
          <q-item-section>Alur Belajar</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/produk')">
          <q-item-section>Produk</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="$router.push('/tips')">
          <q-item-section>Tips</q-item-section>
        </q-item>

        <!-- Pemisah -->
        <q-separator class="q-my-md" />

        <!-- Bahasa -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="language" size="sm" />
          </q-item-section>
          <q-item-section>IND</q-item-section>
        </q-item>

        <!-- Auth -->
        <q-separator class="q-my-md" />

        <template v-if="!isLoggedIn">
          <q-item clickable v-ripple @click="$router.push('/login')">
            <q-item-section>Masuk</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="$router.push('/register')">
            <q-item-section class="text-warning text-weight-bold">Daftar Sekarang</q-item-section>
          </q-item>
        </template>

        <template v-else>
          <q-item class="q-py-sm">
            <q-item-section class="text-weight-bold">Halo, {{ userName }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section class="text-negative text-weight-bold">Logout</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- Header floating: ikut scroll (bukan fixed) -->
      <header class="main-layout-header bg-white text-dark shadow-1">
        <q-toolbar class="q-px-xl q-py-xs">
          <q-toolbar-title
            shrink
            class="flex items-center cursor-pointer"
            @click="$router.push('/')"
          >
            <img src="~assets/Edulang.png" class="main-logo" alt="Edulang Logo" />
          </q-toolbar-title>

          <q-space />

          <div class="gt-md row items-center q-gutter-x-lg text-weight-medium">
            <!-- Kelas Bahasa dengan dropdown -->
            <q-btn flat no-caps label="Kelas Bahasa" class="nav-btn text-primary">
              <q-menu anchor="bottom middle" self="top middle">
                <q-list style="min-width: 220px">
                  <q-item
                    v-for="lang in headerLanguages"
                    :key="lang.id"
                    clickable
                    v-close-popup
                    @click="goToBerlanggananByLanguage(lang)"
                  >
                    <q-item-section v-if="lang.iconUrl" avatar>
                      <q-img :src="lang.iconUrl" ratio="1" class="language-flag" />
                    </q-item-section>
                    <q-item-section class="text-body2">
                      {{ lang.name }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <q-btn
              flat
              no-caps
              label="Berlangganan"
              class="nav-btn"
              @click="$router.push('/berlangganan')"
            />
            <q-btn flat no-caps label="Metode Belajar" class="nav-btn" />
            <q-btn flat no-caps label="Alur Belajar" class="nav-btn" />
            <q-btn flat no-caps label="Produk" class="nav-btn" />
            <q-btn
              flat
              no-caps
              label="Tips & Informasi"
              class="nav-btn"
              @click="$router.push('/tips')"
            />
          </div>

          <q-space />

          <div class="gt-sm row items-center q-gutter-md">
            <!-- Language Selector -->
            <div class="row items-center cursor-pointer text-grey-9">
              <q-icon name="language" size="sm" class="q-mr-xs" />
              <span class="text-weight-medium">IND</span>
            </div>

            <!-- Auth Buttons / User Info -->
            <template v-if="!isLoggedIn">
              <q-btn
                flat
                no-caps
                label="Masuk"
                class="text-weight-medium text-dark"
                @click="$router.push('/login')"
              />
              <q-btn
                unelevated
                no-caps
                label="Daftar Sekarang"
                color="warning"
                text-color="dark"
                class="text-weight-medium q-px-md rounded-borders"
                @click="$router.push('/register')"
              />
            </template>

            <template v-else>
              <!-- User Menu -->
              <q-btn flat no-caps class="user-menu-btn">
                <div class="row items-center q-gutter-sm no-wrap">
                  <q-avatar size="32px" color="primary" text-color="white">
                    <span class="text-weight-medium">{{ getUserInitial() }}</span>
                  </q-avatar>
                  <span class="text-weight-medium text-dark">Halo, {{ userName }}</span>
                </div>
                <q-menu anchor="bottom right" self="top right">
                  <q-list style="min-width: 180px">
                    <q-item clickable v-close-popup @click="$router.push('/profile')">
                      <q-item-section avatar>
                        <q-icon name="person" />
                      </q-item-section>
                      <q-item-section>Profil Saya</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="handleLogout">
                      <q-item-section avatar>
                        <q-icon name="logout" color="negative" />
                      </q-item-section>
                      <q-item-section class="text-negative">Logout</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </template>
          </div>

          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            class="lt-lg"
            @click="toggleLeftDrawer"
          />
        </q-toolbar>
      </header>

      <router-view />

      <footer class="bg-white text-dark q-mt-xl q-pt-xl border-top">
        <div class="container q-pb-xl">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <img
                src="~assets/Edulang.png"
                style="height: 45px"
                alt="Edulang Logo"
                class="q-mb-lg"
              />
              <p class="text-grey-8 line-height-1-8 text-body1" style="max-width: 500px">
                Edulang adalah platform pembelajaran bahasa untuk tujuan karir atau pembelajaran
                masa depan.
              </p>
              <div class="q-mt-lg">
                <div class="text-weight-bolder text-h6 q-mb-xs">Alamat</div>
                <p class="text-grey-8">
                  Jl. ZA. Pagar Alam No.26, Labuhan Ratu, Kec. Kedaton, Kota Bandar Lampung
                </p>
              </div>
              <div class="q-mt-md">
                <div class="text-weight-bolder text-h6 q-mb-xs">Kontak</div>
                <p class="text-grey-8">+62 822-7950-6450</p>
              </div>
            </div>

            <div class="col-12 col-md-3">
              <div class="text-weight-bolder text-h6 q-mb-lg">Social Media</div>
              <q-list dense class="social-list">
                <q-item class="q-pa-none q-mb-sm">
                  <q-item-section avatar min-width="32px"
                    ><q-icon name="mail" size="20px"
                  /></q-item-section>
                  <q-item-section class="text-grey-8">contactedulang@gmail.com</q-item-section>
                </q-item>
                <q-item class="q-pa-none q-mb-sm">
                  <q-item-section avatar min-width="32px"
                    ><q-icon name="fab fa-tiktok" size="20px"
                  /></q-item-section>
                  <q-item-section class="text-grey-8">edulang.id</q-item-section>
                </q-item>
                <q-item class="q-pa-none q-mb-sm">
                  <q-item-section avatar min-width="32px"
                    ><q-icon name="fab fa-instagram" size="20px"
                  /></q-item-section>
                  <q-item-section class="text-grey-8">edulang.id</q-item-section>
                </q-item>
                <q-item class="q-pa-none q-mb-sm">
                  <q-item-section avatar min-width="32px"
                    ><q-icon name="public" size="20px"
                  /></q-item-section>
                  <q-item-section class="text-grey-8">edulang.id</q-item-section>
                </q-item>
              </q-list>
            </div>

            <div class="col-12 col-md-3">
              <div class="text-weight-bolder text-h6 q-mb-lg">General</div>
              <q-list dense class="text-grey-8">
                <q-item clickable class="q-pa-none q-mb-sm">tentang kami</q-item>
                <q-item clickable class="q-pa-none q-mb-sm">produk</q-item>
                <q-item clickable class="q-pa-none q-mb-sm">Kelas Bahasa</q-item>
                <q-item clickable class="q-pa-none">Berlangganan</q-item>
              </q-list>
            </div>
          </div>
        </div>

        <div class="bg-indigo-10 text-white q-py-lg">
          <div
            class="container text-center row justify-center items-center q-gutter-x-sm text-body2"
          >
            <span>© 2026 All Right Reserved</span>
            <q-separator vertical color="white" inset dark />
            <span class="text-weight-medium">PT Active Edulang Global</span>
          </div>
        </div>
      </footer>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from 'src/boot/axios'

const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

// Bahasa untuk dropdown Kelas Bahasa di header
const languages = ref([])

const headerLanguages = computed(() =>
  languages.value.map((lang) => ({
    id: String(lang._id || lang.id),
    name: lang.name || lang.label || 'Bahasa',
    iconUrl: lang.iconUrl || lang.icon_url || '',
  })),
)

const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  const storedName = localStorage.getItem('userName')
  const storedRole = localStorage.getItem('userRole')

  if (token && storedName) {
    isLoggedIn.value = true
    userName.value = storedName
    userRole.value = storedRole || 'user'
  } else {
    isLoggedIn.value = false
    userName.value = ''
    userRole.value = ''
  }
}

const getUserInitial = () => {
  if (!userName.value) return 'U'
  return userName.value.charAt(0).toUpperCase()
}

const fetchLanguages = async () => {
  try {
    const res = await api.get('/language-types')
    const data = res.data || {}
    const list = Array.isArray(data.languagetypes) ? data.languagetypes : data.data || []
    languages.value = list
  } catch (error) {
    console.error('[MAIN LAYOUT] Gagal memuat bahasa', error)
  }
}

const goToBerlanggananByLanguage = (lang) => {
  router.push({
    path: '/berlangganan',
    query: {
      languageId: lang.id,
      languageName: lang.name,
    },
  })
}

onMounted(() => {
  checkLoginStatus()
  fetchLanguages()
})

watch(
  () => route.path,
  () => {
    checkLoginStatus()
  },
)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = () => {
  localStorage.clear()
  isLoggedIn.value = false
  router.push('/')
}
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
.main-logo {
  height: 42px;
  max-height: 42px;
  width: auto;
  display: block;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  width: 100%;
}
.nav-btn {
  font-weight: 500;
  color: var(--edulang-black, #2d2d2d);
}
.nav-btn.text-primary {
  color: var(--edulang-blue, #0089ff) !important;
}
.rounded-borders {
  border-radius: 8px;
}

a {
  text-decoration: none;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

.line-height-1-8 {
  line-height: 1.8;
}

.bg-indigo-10 {
  background-color: #003387 !important;
}

.main-layout-header {
  position: relative;
  z-index: 1;
}

.q-item__section--side {
  padding-right: 8px;
  color: #000;
}

.text-h6 {
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.social-list .q-item {
  min-height: unset;
}

.nav-btn {
  padding: 6px 10px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: #2d2d2d;
  margin: 0 2px;
}

.nav-btn:hover {
  color: #0089ff !important;
  background: rgba(0, 137, 255, 0.05);
}

.language-flag {
  width: 24px;
  height: 16px;
  border-radius: 4px;
  object-fit: cover;
}

/* User Menu Button */
.user-menu-btn {
  padding: 4px 12px;
  font-weight: 500;
}

.user-menu-btn:hover {
  background: rgba(0, 137, 255, 0.05);
}

/* Fix text weight */
.text-weight-medium {
  font-weight: 500 !important;
}

.text-weight-bold {
  font-weight: 600 !important;
}

.text-weight-bolder {
  font-weight: 700 !important;
}

/* No wrap untuk user menu agar tidak break */
.no-wrap {
  white-space: nowrap;
}
</style>
