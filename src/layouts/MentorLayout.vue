<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-1 font-poppins">
    <q-drawer show-if-above v-model="leftDrawerOpen" :width="260" bordered class="bg-white q-pa-md">
      <div class="flex flex-center q-mb-xl q-mt-md">
        <img src="~assets/Edulang.png" style="width: 140px" />
      </div>

      <div class="text-center q-mb-xl">
            <q-avatar size="100px" class="q-mb-md shadow-2">
    <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
  </q-avatar>
  <div class="text-weight-bolder text-subtitle1 text-grey-9">
    {{ mentorData.name || 'Mentor Edulang' }}
  </div>
  <q-chip 
    dense 
    color="blue-6" 
    text-color="white" 
    class="q-px-md text-weight-bold" 
    style="text-transform: capitalize"
  >
    {{ mentorData.role || 'Mentor' }}
  </q-chip>
</div>

      <q-list padding>
        <q-item clickable v-ripple to="/mentor/dashboard" active-class="bg-primary text-white rounded-borders">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section class="text-weight-bold">Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="text-grey-7">
          <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
          <q-item-section class="text-weight-medium">Kelasku</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="text-grey-7">
          <q-item-section avatar><q-icon name="star_outline" /></q-item-section>
          <q-item-section class="text-weight-medium">Rating dan Review</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="text-grey-7">
          <q-item-section avatar><q-icon name="payments" /></q-item-section>
          <q-item-section class="text-weight-medium">Revenue</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="text-grey-7">
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section class="text-weight-medium">Setting</q-item-section>
        </q-item>

        <q-item clickable v-ripple class="text-negative q-mt-xl" @click="handleLogout">
          <q-item-section avatar><q-icon name="logout" /></q-item-section>
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
import { useRouter } from 'vue-router'

const leftDrawerOpen = ref(true)
const router = useRouter()
const mentorData = ref({ name: '', role: '' })

// Ambil dari localStorage saat mount
onMounted(() => {
  updateMentorData()
})

// Update jika localStorage berubah (misal: login di tab lain)
watch(
  () => localStorage.getItem('userName'),
  (newName) => {
    mentorData.value.name = newName || ''
  }
)
watch(
  () => localStorage.getItem('userRole'),
  (newRole) => {
    mentorData.value.role = newRole || 'user'
  }
)

function updateMentorData() {
  mentorData.value.name = localStorage.getItem('userName') || ''
  mentorData.value.role = localStorage.getItem('userRole') || 'user'
}

const handleLogout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.font-poppins { font-family: 'Poppins', sans-serif; }
.rounded-borders { border-radius: 10px; margin-bottom: 4px; }
</style>