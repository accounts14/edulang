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
        <div class="text-caption text-grey-7 gt-sm">{{ mentorData.name || 'Mentor' }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="280"
      bordered
      show-if-above
      :breakpoint="768"
      class="bg-white q-pa-md"
    >
      <div class="flex flex-center q-mb-xl q-mt-md cursor-pointer" @click="router.push('/')">
        <img src="~assets/Edulang.png" style="width: 140px" alt="Edulang Logo" />
      </div>

      <div class="text-center q-mb-xl">
        <q-avatar size="100px" class="q-mb-md shadow-premium">
          <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
        </q-avatar>
        <div class="text-weight-bolder text-subtitle1 text-edulang-navy">
          {{ mentorData.name || 'Mentor Edulang' }}
        </div>
        <q-chip
          dense
          color="primary"
          text-color="white"
          class="q-px-md text-weight-bold q-mt-sm"
          style="text-transform: capitalize"
        >
          {{ mentorData.role || 'Mentor' }}
        </q-chip>
      </div>

      <q-list padding>
        <q-item
          clickable
          v-ripple
          to="/mentor/dashboard"
          active-class="active-menu"
          class="menu-item-non-active"
        >
          <q-item-section avatar><q-icon name="dashboard" size="sm" /></q-item-section>
          <q-item-section class="text-weight-medium">Dashboard</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/mentor/kelasku"
          active-class="active-menu"
          class="menu-item-non-active"
        >
          <q-item-section avatar><q-icon name="menu_book" size="sm" /></q-item-section>
          <q-item-section class="text-weight-medium">Kelasku</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/mentor/rating"
          active-class="active-menu"
          class="menu-item-non-active"
        >
          <q-item-section avatar><q-icon name="star_outline" size="sm" /></q-item-section>
          <q-item-section class="text-weight-medium">Rating dan Review</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/mentor/revenue"
          active-class="active-menu"
          class="menu-item-non-active"
        >
          <q-item-section avatar><q-icon name="payments" size="sm" /></q-item-section>
          <q-item-section class="text-weight-medium">Revenue</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/mentor/setting"
          active-class="active-menu"
          class="menu-item-non-active"
        >
          <q-item-section avatar><q-icon name="settings" size="sm" /></q-item-section>
          <q-item-section class="text-weight-medium">Setting</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="logout-item q-mt-xl" @click="handleLogout">
          <q-item-section avatar><q-icon name="logout" color="negative" /></q-item-section>
          <q-item-section class="text-weight-bold text-negative">Keluar</q-item-section>
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
  if (path === '/mentor/dashboard') return 'Dashboard'
  if (path.startsWith('/mentor/kelasku')) return 'Kelasku'
  if (path.startsWith('/mentor/rating')) return 'Rating dan Review'
  if (path.startsWith('/mentor/revenue')) return 'Revenue'
  if (path.startsWith('/mentor/setting')) return 'Setting'
  return 'Edulang Mentor'
})

const mentorData = ref({ name: '', role: '' })

onMounted(() => {
  updateMentorData()
})

watch(
  () => route.path,
  () => {
    if ($q.screen.lt.md) leftDrawerOpen.value = false
  },
)

function updateMentorData() {
  mentorData.value.name = localStorage.getItem('userName') || ''
  mentorData.value.role = localStorage.getItem('userRole') || 'Mentor'
}

const handleLogout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.text-edulang-navy {
  color: #003387;
}
.bg-edulang-white {
  background-color: #f5f7fa;
}
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.menu-item-non-active {
  color: #616161 !important;
  border-radius: 12px;
  margin-bottom: 6px;
  transition: all 0.3s ease;
  padding: 10px 16px;
}

.menu-item-non-active:hover {
  background-color: rgba(0, 137, 255, 0.08);
  color: #0089ff !important;
}

.active-menu {
  background-color: #0089ff !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(0, 137, 255, 0.3);
}

.active-menu .q-icon {
  color: white !important;
}

.logout-item {
  border-radius: 12px;
}

.shadow-premium {
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.15);
}
</style>
