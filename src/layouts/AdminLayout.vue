<template>
  <q-layout view="lHh Lpr lFf" class="bg-edulang-white font-poppins">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="q-mr-sm"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title class="text-weight-bold text-edulang-navy">
          {{ pageTitle }}
        </q-toolbar-title>
        <q-space />
        <div class="text-caption text-grey-7 gt-sm q-mr-md">
          Terhubung sebagai: <strong>{{ adminData.name || 'Admin' }}</strong>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" :width="280" bordered show-if-above class="bg-white q-pa-md">
      <div class="flex flex-center q-mb-xl q-mt-md cursor-pointer" @click="router.push('/')">
        <img src="~assets/Edulang.png" style="width: 140px" alt="Edulang Logo" />
      </div>

      <div class="text-center q-mb-xl">
        <q-avatar size="100px" class="q-mb-md shadow-premium">
          <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
        </q-avatar>

        <div class="text-weight-bolder text-subtitle1 text-edulang-navy">
          {{ adminData.name || 'Admin Edulang' }}
        </div>

        <q-chip
          dense
          color="primary"
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
          active-class="active-menu"
          class="menu-item-non-active"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Dashboard</q-item-section>
        </q-item>

        <q-item
          v-for="menu in menuList"
          :key="menu.label"
          clickable
          v-ripple
          :to="menu.to"
          active-class="active-menu"
          class="menu-item-non-active"
        >
          <q-item-section avatar>
            <q-icon :name="menu.icon" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-medium">{{ menu.label }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="logout-item q-mt-xl" @click="handleLogout">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section class="text-weight-bold text-negative">Keluar</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
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

const adminData = ref({
  name: '',
  role: '',
})

const checkAdminStatus = () => {
  const token = localStorage.getItem('token')
  const storedName = localStorage.getItem('userName')
  const storedRole = localStorage.getItem('userRole')

  if (token && storedName) {
    adminData.value.name = storedName
    adminData.value.role = storedRole || 'Admin'
  } else {
    router.push('/')
  }
}

onMounted(() => {
  checkAdminStatus()
})

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
  { label: 'Daftar Mentor Baru', icon: 'person_add_alt', to: '/admin/mentor/register' },
  { label: 'Revenue', icon: 'payments', to: '/admin/revenue' },
  { label: 'User', icon: 'person_outline', to: '/admin/user' },
  { label: 'Mendaftar', icon: 'person_add', to: '/admin/pendaftar' },
  { label: 'Produk', icon: 'inventory_2', to: '/admin/produk' },
  { label: 'Artikel', icon: 'article', to: '/admin/artikel' },
  { label: 'Setting', icon: 'settings', to: '/admin/setting' },
]

const handleLogout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
/* Edulang Brand Colors */
.text-edulang-navy {
  color: #003387;
}
.bg-edulang-white {
  background-color: #f5f7fa;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* Base style untuk menu yang TIDAK aktif */
.menu-item-non-active {
  color: #616161 !important; /* text-grey-7 */
  border-radius: 12px;
  margin-bottom: 6px;
  transition: all 0.3s ease;
  padding: 10px 16px;
}

.menu-item-non-active:hover {
  background-color: rgba(0, 137, 255, 0.08);
  color: #0089ff !important;
}

/* Style KHUSUS saat menu AKTIF (Diklik/Dipilih) */
.active-menu {
  background-color: #0089ff !important; /* Edulang Blue */
  color: white !important; /* PAKSA teks jadi putih */
  box-shadow: 0 4px 15px rgba(0, 137, 255, 0.3);
}

/* Pastikan icon di dalam menu aktif juga jadi putih */
.active-menu .q-icon {
  color: white !important;
}

.logout-item {
  border-radius: 12px;
  border: 1px solid rgba(193, 0, 21, 0.1);
}

.shadow-premium {
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.15);
}
</style>
