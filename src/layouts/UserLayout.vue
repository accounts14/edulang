<template>
  <q-layout view="lHh Lpr lFf" class="bg-edulang-white font-poppins">
    <q-header class="bg-white text-dark q-py-xs border-bottom">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="text-edulang-navy"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-space />
        <div class="row items-center q-gutter-md">
          <div class="text-subtitle2 text-grey-8 gt-xs">
            Halo, <span class="text-weight-bold">{{ userData.name || 'User' }}</span>
          </div>
          <q-btn
            round
            flat
            icon="notifications_none"
            color="grey-7"
            size="12px"
            to="/dashboard/notifikasi"
          >
            <q-badge floating color="orange" rounded />
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="260"
      bordered
      show-if-above
      side="left"
      class="bg-white sidebar-drawer"
    >
      <div class="column full-height">
        <div class="col-auto">
          <div
            class="flex flex-center q-mb-lg q-mt-lg cursor-pointer"
            @click="router.push('/dashboard')"
          >
            <img src="~assets/Edulang.png" style="width: 140px" alt="Edulang Logo" />
          </div>

          <div class="column items-center q-mb-md q-mt-md">
            <q-avatar size="85px" class="q-mb-sm shadow-premium">
              <img :src="userAvatar" alt="Avatar" />
            </q-avatar>
            <div class="text-weight-bolder text-subtitle1 text-edulang-navy">
              {{ userData.name || 'User Edulang' }}
            </div>
            <q-chip
              dense
              color="primary"
              text-color="white"
              class="q-px-md text-weight-bold q-mt-xs text-caption"
            >
              Siswa
            </q-chip>
          </div>
        </div>

        <q-scroll-area class="col">
          <q-list class="q-pr-md q-pt-sm">
            <q-item
              v-for="menu in menuItems"
              :key="menu.path"
              clickable
              v-ripple
              :to="menu.path"
              exact
              active-class="active-menu-pill"
              class="menu-item-style q-mb-sm"
            >
              <q-item-section avatar>
                <q-icon :name="menu.icon" size="22px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">{{ menu.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div class="col-auto q-pr-md q-pb-md">
          <q-separator q-mb-sm class="q-ml-md" />
          <q-item clickable v-ripple class="menu-item-style logout-item" @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="grey-6" size="22px" />
            </q-item-section>
            <q-item-section class="text-weight-medium text-grey-7">Keluar</q-item-section>
          </q-item>

          <div class="flex flex-center q-mt-md">
            <q-btn
              flat
              dense
              round
              icon="keyboard_double_arrow_left"
              color="grey-4"
              size="sm"
              @click="leftDrawerOpen = false"
            />
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const leftDrawerOpen = ref(true)
const router = useRouter()

const userData = ref({ name: '' })
const userAvatar = ref('https://cdn.quasar.dev/img/avatar2.jpg')

const menuItems = [
  { label: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
  { label: 'Langganan', icon: 'credit_card', path: '/dashboard/langganan' },
  { label: 'Progres Belajar', icon: 'bar_chart', path: '/dashboard/progres' },
  { label: 'Notifikasi', icon: 'notifications_none', path: '/dashboard/notifikasi' },
  { label: 'Transaksi', icon: 'shopping_bag', path: '/dashboard/transaksi' },
  { label: 'Setting', icon: 'settings', path: '/dashboard/setting' },
]

onMounted(() => {
  userData.value.name = localStorage.getItem('userName') || 'Suika'
})

const handleLogout = () => {
  console.log('Logging out...') // Cek di console log
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.bg-edulang-white {
  background-color: #f8fafc;
}
.border-bottom {
  border-bottom: 1px solid #f1f5f9;
}

.column.full-height {
  height: 100vh;
}

.menu-item-style {
  color: #64748b;
  border-radius: 0 25px 25px 0;
  margin-right: 12px;
  min-height: 48px;
  transition: all 0.2s ease-in-out;
}

.menu-item-style:hover {
  background-color: #f1f5f9;
  color: #0089ff;
}

.active-menu-pill {
  background-color: #0089ff !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 137, 255, 0.25);
}

.active-menu-pill .q-icon {
  color: white !important;
}

.shadow-premium {
  box-shadow: 0 8px 25px rgba(0, 51, 135, 0.12);
  border: 3px solid white;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.logout-item:hover {
  background-color: #fff1f2;
  color: #e11d48 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
