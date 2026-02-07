<template>
  <q-layout view="lHh Lpr lFf" class="user-layout font-poppins">
    <q-header elevated class="bg-white text-dark lt-md">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-weight-bold">Edulang</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="260"
      bordered
      behavior="mobile"
      :breakpoint="768"
      class="user-drawer bg-white"
    >
      <div class="flex flex-center q-mb-lg q-mt-md">
        <img src="~assets/Edulang.png" alt="Edulang" class="user-logo" />
      </div>

      <div class="text-center q-mb-xl q-px-sm">
        <q-avatar size="80px" class="q-mb-md shadow-2">
          <img :src="userAvatar" alt="" />
        </q-avatar>
        <div class="text-weight-bolder text-subtitle1 text-grey-9">
          {{ userData.name || 'User' }}
        </div>
        <q-chip
          dense
          color="primary"
          text-color="white"
          class="q-px-md text-weight-bold"
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
          active-class="bg-primary text-white rounded-borders"
          exact
        >
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section class="text-weight-bold">Dashboard</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/langganan"
          active-class="bg-primary text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar><q-icon name="description" /></q-item-section>
          <q-item-section class="text-weight-medium">Langganan</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/progres"
          active-class="bg-primary text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar><q-icon name="list_alt" /></q-item-section>
          <q-item-section class="text-weight-medium">Progres Belajar</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/notifikasi"
          active-class="bg-primary text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar><q-icon name="notifications" /></q-item-section>
          <q-item-section class="text-weight-medium">Notifikasi</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/transaksi"
          active-class="bg-primary text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar><q-icon name="shopping_bag" /></q-item-section>
          <q-item-section class="text-weight-medium">Transaksi</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/dashboard/setting"
          active-class="bg-primary text-white rounded-borders"
          class="text-grey-7"
        >
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section class="text-weight-medium">Setting</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="text-negative q-mt-xl" @click="handleLogout">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
          <q-item-section class="text-weight-bold">Keluar</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="user-page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const leftDrawerOpen = ref(true)
const router = useRouter()
const route = useRoute()

const userData = ref({ name: '' })
const userAvatar = ref('https://cdn.quasar.dev/img/avatar2.jpg')

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
.user-layout {
  background: var(--edulang-white, #f5f7fa);
}
.user-layout :deep(.q-page-container) {
  background: var(--edulang-white, #f5f7fa);
}
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
.user-logo {
  width: 140px;
  height: auto;
}
.user-drawer {
  background: #fff !important;
}
.rounded-borders {
  border-radius: 10px;
  margin-bottom: 4px;
}
</style>
