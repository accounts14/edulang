<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-1 font-poppins">
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      :width="260"
      bordered
      class="bg-white q-pa-md"
    >
      <div class="flex flex-center q-mb-xl q-mt-md">
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
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const leftDrawerOpen = ref(true)
const router = useRouter()
const route = useRoute()

// State untuk menyimpan data admin
const adminData = ref({
  name: '',
  role: ''
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
watch(() => route.path, () => {
  checkAdminStatus()
})

const menuList = [
  { label: 'Kategori', icon: 'assignment', to: '/admin/kategori' },
  { label: 'Mentor', icon: 'groups', to: '/admin/mentor' },
  { label: 'Revenue', icon: 'payments', to: '/admin/revenue' },
  { label: 'User', icon: 'person_outline', to: '/admin/user' },
  { label: 'Mendaftar', icon: 'person_add', to: '/admin/pendaftar' },
  { label: 'Produk', icon: 'inventory_2', to: '/admin/produk' },
  { label: 'Artikel', icon: 'article', to: '/admin/artikel' },
  { label: 'Setting', icon: 'settings', to: '/admin/setting' }
]

// Fungsi logout sinkron dengan MainLayout
const handleLogout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.font-poppins { font-family: 'Poppins', sans-serif; }
.rounded-borders { 
  border-radius: 10px; 
  margin-bottom: 4px;
}
</style>