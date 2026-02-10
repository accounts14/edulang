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
        <div class="text-caption text-grey-7 gt-sm">{{ userData.name || 'User' }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="260"
      bordered
      behavior="mobile"
      :breakpoint="768"
      class="bg-white q-pa-md"
    >
      <div class="flex flex-center q-mb-xl q-mt-md cursor-pointer" @click="router.push('/')">
        <img src="~assets/Edulang.png" style="width: 140px" alt="Edulang Logo" />
      </div>

      <div class="text-center q-mb-xl">
        <q-avatar size="100px" class="q-mb-md shadow-2">
          <img :src="userAvatar" alt="" />
        </q-avatar>

        <div class="text-weight-bolder text-subtitle1 text-grey-9">
          {{ userData.name || 'User' }}
        </div>

        <q-chip
          dense
          color="blue-6"
          text-color="white"
          class="q-px-md text-weight-bold q-mt-sm"
          style="text-transform: capitalize"
        >
          User
        </q-chip>
      </div>

      <q-list padding>
        <q-item
          clickable
          v-ripple
          to="/dashboard"
          active-class="bg-blue-6 text-white rounded-borders"
          exact
        >
          <q-item-section avatar>
            <q-icon name="dashboard" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-bold">Dashboard</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/langganan"
          active-class="bg-blue-6 text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar>
            <q-icon name="description" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Langganan</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/progres"
          active-class="bg-blue-6 text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar>
            <q-icon name="list_alt" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Progres Belajar</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/notifikasi"
          active-class="bg-blue-6 text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar>
            <q-icon name="notifications" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Notifikasi</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/transaksi"
          active-class="bg-blue-6 text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar>
            <q-icon name="shopping_bag" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Transaksi</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/setting"
          active-class="bg-blue-6 text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar>
            <q-icon name="settings" size="sm" />
          </q-item-section>
          <q-item-section class="text-weight-medium">Setting</q-item-section>
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

const userData = ref({ name: '' })
const userAvatar = ref('https://cdn.quasar.dev/img/avatar2.jpg')

const pageTitle = computed(() => {
  const t = route.meta?.title || route.name || ''
  if (t) return String(t)
  const path = route.path
  if (path === '/dashboard') return 'Dashboard'
  if (path.startsWith('/dashboard/langganan')) return 'Langganan'
  if (path.startsWith('/dashboard/progres')) return 'Progres Belajar'
  if (path.startsWith('/dashboard/notifikasi')) return 'Notifikasi'
  if (path.startsWith('/dashboard/transaksi')) return 'Transaksi'
  if (path.startsWith('/dashboard/setting')) return 'Setting'
  return 'Edulang'
})

onMounted(() => {
  userData.value.name = localStorage.getItem('userName') || 'User'
})

watch(
  () => localStorage.getItem('userName'),
  (newName) => {
    userData.value.name = newName || 'User'
  },
)
watch(
  () => route.path,
  () => {
    if ($q.screen.lt.md) leftDrawerOpen.value = false
  },
)

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
