<template>
  <q-layout view="lHh Lpr lff" class="font-poppins">
    
    <q-header class="bg-white text-dark q-py-sm shadow-1">
      <q-toolbar class="container">
        <q-toolbar-title class="flex items-center cursor-pointer" @click="$router.push('/')">
          <img src="~assets/Edulang.png" style="height: 40px; width: auto;" alt="Edulang Logo" />
        </q-toolbar-title>

        <div class="gt-md row q-gutter-sm text-weight-medium">
          <q-btn flat no-caps label="Kelas Bahasa" class="nav-btn text-primary text-weight-bold" />
          <q-btn flat no-caps label="Berlangganan" class="nav-btn" />
          <q-btn flat no-caps label="Metode Belajar" class="nav-btn" />
          <q-btn flat no-caps label="Alur Belajar" class="nav-btn" />
          <q-btn flat no-caps label="Produk" class="nav-btn" />
        </div>

        <q-space />

        <div class="gt-sm row items-center q-gutter-md">
          <div class="row items-center cursor-pointer text-grey-9">
            <q-icon name="language" size="sm" class="q-mr-xs" />
            <span class="text-weight-bolder">IND</span>
          </div>

          <template v-if="!isLoggedIn">
            <q-btn flat no-caps label="Masuk" class="text-weight-bold text-dark" @click="$router.push('/login')"/>
            <q-btn unelevated no-caps label="Daftar Sekarang" color="warning" text-color="dark" class="text-weight-bold q-px-md rounded-borders" @click="$router.push('/register')" />
          </template>

          <template v-else>
            <div class="row items-center q-gutter-sm">
              <span class="text-weight-bold text-grey-9">Halo, {{ userName }}</span>
              <q-btn round flat>
                <q-avatar size="40px" color="warning" text-color="white" icon="person" class="shadow-1" />
                <q-menu transition-show="jump-down" transition-hide="jump-up">
                  <q-list style="min-width: 150px">
                    <q-item clickable v-close-popup @click="handleLogout">
                      <q-item-section avatar><q-icon name="logout" color="negative" size="xs" /></q-item-section>
                      <q-item-section class="text-negative text-weight-bold">Logout</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </template>
        </div>

        <q-btn flat dense round icon="menu" aria-label="Menu" class="lt-lg" @click="toggleLeftDrawer" />
      </q-toolbar>
    </q-header>

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
        <img src="~assets/Edulang.png" style="height: 40px; width: auto;" alt="Edulang Logo" />
      </q-item-section>
    </q-item>

    <!-- Navigasi Utama -->
    <q-item clickable v-ripple @click="$router.push('/')" class="text-weight-bold text-primary">
      <q-item-section>Home</q-item-section>
    </q-item>
    
    <q-item clickable v-ripple @click="$router.push('/kelas-bahasa')">
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
      <router-view />
      
      <footer class="bg-white text-dark q-mt-xl q-pt-xl border-top">
        <div class="container q-pb-xl">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <img src="~assets/Edulang.png" style="height: 45px;" alt="Edulang Logo" class="q-mb-lg" />
              <p class="text-grey-8 line-height-1-8 text-body1" style="max-width: 500px;">
                Edulang adalah platform pembelajaran bahasa untuk tujuan karir atau pembelajaran masa depan.
              </p>
              <div class="q-mt-lg">
                <div class="text-weight-bolder text-h6 q-mb-xs">Alamat</div>
                <p class="text-grey-8">Jl. ZA. Pagar Alam No.26, Labuhan Ratu, Kec. Kedaton, Kota Bandar Lampung</p>
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
                  <q-item-section avatar min-width="32px"><q-icon name="mail" size="20px" /></q-item-section>
                  <q-item-section class="text-grey-8">contactedulang@gmail.com</q-item-section>
                </q-item>
                <q-item class="q-pa-none q-mb-sm">
                  <q-item-section avatar min-width="32px"><q-icon name="fab fa-tiktok" size="20px" /></q-item-section>
                  <q-item-section class="text-grey-8">edulang.id</q-item-section>
                </q-item>
                <q-item class="q-pa-none q-mb-sm">
                  <q-item-section avatar min-width="32px"><q-icon name="fab fa-instagram" size="20px" /></q-item-section>
                  <q-item-section class="text-grey-8">edulang.id</q-item-section>
                </q-item>
                <q-item class="q-pa-none q-mb-sm">
                  <q-item-section avatar min-width="32px"><q-icon name="public" size="20px" /></q-item-section>
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
          <div class="container text-center row justify-center items-center q-gutter-x-sm text-body2">
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
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('') // Tambahkan state role

const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  const storedName = localStorage.getItem('userName')
  const storedRole = localStorage.getItem('userRole') // Ambil role dari localStorage
  
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

onMounted(() => {
  checkLoginStatus()
})

watch(() => route.path, () => {
  checkLoginStatus() // Fungsi yang mengambil data dari localStorage
})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = () => {
  localStorage.clear() // Lebih aman hapus semua data login
  isLoggedIn.value = false
  router.push('/')
}
</script>

<style scoped>
.font-poppins { font-family: 'Poppins', sans-serif; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 16px; width: 100%; }
.nav-btn { font-weight: 500; color: #333; }
.rounded-borders { border-radius: 8px; }

/* Menghilangkan garis bawah default pada link */
a { text-decoration: none; }

.border-top {
  border-top: 1px solid #e0e0e0;
}

.line-height-1-8 {
  line-height: 1.8;
}

/* Warna biru gelap untuk bar bawah sesuai desain */
.bg-indigo-10 {
  background-color: #0d2a5c !important;
}

/* Menghilangkan padding default Quasar list agar sejajar kiri */
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
</style>