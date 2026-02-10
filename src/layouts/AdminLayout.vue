<template>
  <q-layout view="lHh Lpr lFf" class="bg-accent font-poppins">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title class="text-weight-bold">
          {{ pageTitle }}
        </q-toolbar-title>
        <q-space />
        <div class="text-caption text-grey-7 gt-sm">{{ adminData.name || 'Admin' }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="260"
      bordered
      behavior="mobile"
      class="bg-white q-pa-md"
      :breakpoint="768"
    >
      <div class="flex flex-center q-mb-xl q-mt-md cursor-pointer" @click="router.push('/')">
        <img src="~assets/Edulang.png" style="width: 140px" alt="Edulang Logo" />
      </div>

      <div class="text-center q-mb-xl">
        <q-avatar size="100px" class="q-mb-md shadow-2">
          <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
        </q-avatar>

        <div class="text-weight-bolder text-subtitle1 text-grey-9">
          {{ adminData.name || 'Admin Edulang' }}
        </div>

        <q-chip
          dense
          color="blue-6"
          text-color="white"
          class="q-px-md text-weight-bold q-mt-sm"
          style="text-transform: capitalize"
        >
          {{ adminData.role || 'Admin' }}
        </q-chip>
      </div>

      <q-list padding>
        <q-item
          clickable
          v-ripple
          to="/admin/dashboard"
          active-class="bg-blue-6 text-white rounded-borders"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Dashboard</q-item-section>
        </q-item>

        <q-item
          v-for="menu in menuList"
          :key="menu.label"
          clickable
          v-ripple
          :to="menu.to"
          active-class="bg-blue-6 text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar>
            <q-icon :name="menu.icon" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-medium">{{ menu.label }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="text-negative q-mt-xl" @click="handleLogout">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Keluar</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const leftDrawerOpen = ref(true)
const router = useRouter()
const route = useRoute()

const pageTitle = computed(() => {
  const t = route.meta?.title || route.name || ''
  if (t) return String(t)
  const path = route.path
  if (path === '/admin/dashboard') return 'Dashboard'
  if (path.startsWith('/admin/kategori')) return 'Kategori Bahasa'
  if (path.startsWith('/admin/mentor')) return 'Mentor'
  if (path.startsWith('/admin/revenue')) return 'Revenue'
  if (path.startsWith('/admin/user')) return 'User'
  if (path.startsWith('/admin/pendaftar')) return 'Mendaftar'
  if (path.startsWith('/admin/produk')) return 'Produk'
  if (path.startsWith('/admin/artikel')) return 'Artikel'
  if (path.startsWith('/admin/setting')) return 'Setting'
  return 'Edulang Admin'
})

// State untuk menyimpan data admin
const adminData = ref({
  name: '',
  role: '',
})

// Fungsi pengambil data (disamakan dengan MainLayout Anda)
const checkAdminStatus = () => {
  const token = localStorage.getItem('token')
  const storedName = localStorage.getItem('userName') // Mengambil userName dari storage
  const storedRole = localStorage.getItem('userRole') // Mengambil userRole dari storage

  if (token && storedName) {
    adminData.value.name = storedName
    adminData.value.role = storedRole || 'Admin'
  } else {
    // Jika tidak login, kembalikan ke home atau login
    router.push('/')
  }
}

onMounted(() => {
  checkAdminStatus()
})

// Memantau perubahan rute agar data selalu sinkron
watch(
  () => route.path,
  () => {
    checkAdminStatus()
    if ($q.screen.lt.md) leftDrawerOpen.value = false
  },
)

const menuList = [
  { label: 'Kategori', icon: 'assignment', to: '/admin/kategori' },
  { label: 'Mentor', icon: 'groups', to: '/admin/mentor' },
  { label: 'Revenue', icon: 'payments', to: '/admin/revenue' },
  { label: 'User', icon: 'person_outline', to: '/admin/user' },
  { label: 'Mendaftar', icon: 'person_add', to: '/admin/pendaftar' },
  { label: 'Produk', icon: 'inventory_2', to: '/admin/produk' },
  { label: 'Artikel', icon: 'article', to: '/admin/artikel' },
  { label: 'Setting', icon: 'settings', to: '/admin/setting' },
]

// Fungsi logout sinkron dengan MainLayout
const handleLogout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
.rounded-borders {
  border-radius: 10px;
  margin-bottom: 4px;
}
</style>
