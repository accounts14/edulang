<template>
  <q-layout view="lHh Lpr lff" class="font-poppins">
    <q-drawer
      v-model="leftDrawerOpen"
      side="right"
      bordered
      behavior="mobile"
      :class="isDark ? 'bg-dark text-white' : 'bg-white'"
      :width="280"
    >
      <q-list class="q-pa-md">
        <!-- Logo -->
        <q-item class="q-mb-md">
          <q-item-section>
            <img src="~assets/Edulang.png" style="width: 200px; height: auto" alt="Edulang Logo" />
          </q-item-section>
        </q-item>

        <!-- Navigasi Utama -->
        <q-item clickable v-ripple @click="$router.push('/')" class="text-weight-bold text-primary">
          <q-item-section>{{ $t('nav.home') }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onDrawerAlurBelajar">
          <q-item-section>{{ $t('nav.learningPath') }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onDrawerLangganan">
          <q-item-section>{{ $t('nav.langganan') }}</q-item-section>
        </q-item>

        <!-- PROGRAM -->
        <q-expansion-item :label="$t('nav.program')" icon="school" class="text-primary">
          <q-expansion-item :label="$t('nav.videoCourses')" header-class="text-weight-medium">
            <q-item clickable v-ripple dense @click="onDrawerAllCourses">
              <q-item-section>{{ $t('nav.allCourses') }}</q-item-section>
            </q-item>
          </q-expansion-item>
          <q-item clickable v-ripple dense @click="onDrawerStudyAbroad">
            <q-item-section>{{ $t('nav.studyAbroad') }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable v-ripple @click="onDrawerTips">
          <q-item-section>{{ $t('nav.tipsInfo') }}</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <template v-if="!isLoggedIn">
          <q-item clickable v-ripple @click="$router.push('/login')">
            <q-item-section class="text-weight-medium">{{
              $t('nav.learningCenter')
            }}</q-item-section>
          </q-item>
        </template>

        <template v-else>
          <q-item class="q-py-sm">
            <q-item-section class="text-weight-bold">{{
              $t('auth.halo', { name: userName })
            }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="$router.push('/dashboard')">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>{{ $t('nav.dashboard') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section class="text-negative text-weight-bold">{{
              $t('auth.logout')
            }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- Header dengan animasi scroll -->
      <header
        :class="[
          'main-layout-header',
          isDark ? 'bg-dark text-white' : 'bg-white text-dark',
          !showHeader ? 'header-hidden' : '',
        ]"
      >
        <q-toolbar class="q-px-xl main-layout-toolbar">
          <q-toolbar-title
            shrink
            class="relative-position cursor-pointer header-brand"
            @click="$router.push('/')"
            style="min-width: 200px; height: 50px"
          >
            <div class="absolute-center-left">
              <img src="~assets/Edulang1.png" class="main-logo" alt="Edulang Logo" />

              <div class="header-text-container gt-sm">
                <div
                  class="edulang-header-text"
                  style="color: #003387; font-weight: bold; font-size: 1.9rem; line-height: 1.2"
                >
                  Edulang
                </div>
                <div class="header-tagline">
                  {{ $t('nav.tagline') }}
                </div>
              </div>
            </div>
          </q-toolbar-title>

          <q-space />

          <!-- Nav Links (Desktop) -->
          <div class="gt-md row items-center nav-links-wrap text-weight-medium">
            <q-btn
              flat
              no-caps
              :label="$t('nav.learningPath')"
              :class="['nav-btn', { 'nav-btn-active': isNavActive('/alur-belajar') }]"
              @click="$router.push('/alur-belajar')"
            />

            <!-- Program Dropdown -->
            <div
              class="program-nav-wrapper relative-position"
              @mouseenter="onProgramMouseEnter"
              @mouseleave="onProgramMouseLeave"
            >
              <q-btn
                flat
                no-caps
                :label="$t('nav.program')"
                :class="['nav-btn', { 'nav-btn-active': isProgramNavActive }]"
              />
              <transition name="dropdown-fade">
                <div
                  v-show="programOpen"
                  class="program-dropdown program-dropdown-bwa shadow-2 rounded-borders overflow-hidden"
                >
                  <div class="row no-wrap program-dropdown-bwa-inner">
                    <!-- Kolom kiri -->
                    <div class="program-bwa-left">
                      <div class="program-bwa-left-content">
                        <div class="program-bwa-tag">{{ $t('nav.programTrusted') }}</div>
                        <div class="program-bwa-title">{{ $t('nav.programTitle') }}</div>
                        <p class="program-bwa-desc">{{ $t('nav.programDesc') }}</p>
                        <q-btn
                          unelevated
                          no-caps
                          class="program-bwa-btn"
                          :label="$t('nav.programCta')"
                          @click="onProgramAllRoadmap"
                        />
                      </div>
                    </div>
                    <!-- Kolom kanan -->
                    <div class="program-bwa-right">
                      <div class="program-bwa-card cursor-pointer" @click="onProgramAllCourses">
                        <div class="program-bwa-card-icon">
                          <q-icon name="play_circle_filled" size="32px" color="primary" />
                        </div>
                        <div class="program-bwa-card-text">
                          <div class="program-bwa-card-title">{{ $t('nav.allCourses') }}</div>
                          <div class="program-bwa-card-sub">{{ $t('nav.allCoursesSub') }}</div>
                        </div>
                      </div>

                      <div class="program-bwa-card cursor-pointer" @click="onProgramStudyAbroad">
                        <div class="program-bwa-card-icon">
                          <q-icon name="flight_takeoff" size="32px" color="primary" />
                        </div>
                        <div class="program-bwa-card-text">
                          <div class="program-bwa-card-title">{{ $t('nav.studyAbroad') }}</div>
                          <div class="program-bwa-card-sub">{{ $t('nav.studyAbroadSub') }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <q-btn
              flat
              no-caps
              :label="$t('nav.langganan')"
              :class="['nav-btn', { 'nav-btn-active': isNavActive('/berlangganan') }]"
              @click="$router.push('/berlangganan')"
            />
            <q-btn
              flat
              no-caps
              :label="$t('nav.tipsInfo')"
              :class="['nav-btn', { 'nav-btn-active': isNavActive('/tips') }]"
              @click="$router.push('/tips')"
            />
          </div>

          <q-space />

          <!-- Right Actions -->
          <div class="gt-sm row items-center q-gutter-md">
            <template v-if="!isLoggedIn">
              <q-btn
                no-caps
                :label="$t('nav.learningCenter')"
                :class="[
                  'learning-center-btn',
                  { 'learning-center-btn-active': isNavActive('/login') },
                ]"
                @click="$router.push('/login')"
              />
            </template>

            <template v-else>
              <q-btn flat no-caps class="user-menu-btn">
                <div class="row items-center q-gutter-sm no-wrap">
                  <q-avatar size="32px" color="primary" text-color="white">
                    <span class="text-weight-medium">{{ getUserInitial() }}</span>
                  </q-avatar>
                  <span class="text-weight-medium">{{ $t('auth.halo', { name: userName }) }}</span>
                </div>
                <q-menu anchor="bottom right" self="top right">
                  <q-list style="min-width: 180px">
                    <q-item clickable v-close-popup @click="$router.push('/dashboard')">
                      <q-item-section avatar>
                        <q-icon name="home" />
                      </q-item-section>
                      <q-item-section>Dashboard</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup @click="handleLogout">
                      <q-item-section avatar>
                        <q-icon name="logout" color="negative" />
                      </q-item-section>
                      <q-item-section class="text-negative">{{ $t('auth.logout') }}</q-item-section>
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

      <!-- Footer -->
      <footer :class="[isDark ? 'bg-dark text-white' : 'bg-white text-dark', 'footer-main']">
        <div class="container footer-content">
          <!-- PERBAIKAN: Tambah q-col-gutter-lg untuk jarak antar kolom -->
          <div class="row q-col-gutter-xl">
            <!-- Kolom 1: Brand & Subscribe -->
            <div class="col-12 col-md-5 col-lg-4">
              <img src="~assets/Edulang.png" alt="Edulang" class="footer-logo q-mb-md" />
              <div class="footer-pt text-weight-bold text-body1 q-mb-xs">
                {{ $t('footer.ptName') }}
              </div>
              <p class="footer-alamat text-body2 q-ma-none">
                {{ $t('footer.alamatValue') }}
              </p>

              <div class="footer-subscribe q-mt-lg">
                <div class="footer-subscribe-title text-h6 q-mb-sm">
                  {{ $t('footer.subscribeTitle') }}
                </div>
                <p class="footer-subscribe-desc text-caption q-mb-md">
                  {{ $t('footer.subscribeDesc') }}
                </p>
                <q-input
                  v-model="subscribeName"
                  outlined
                  dense
                  placeholder="Your full name"
                  class="q-mb-sm"
                  :class="isDark ? 'bg-grey-9' : 'bg-grey-1'"
                />
                <q-input
                  v-model="subscribeEmail"
                  type="email"
                  outlined
                  dense
                  placeholder="Your email"
                  class="q-mb-sm"
                  :class="isDark ? 'bg-grey-9' : 'bg-grey-1'"
                />
                <q-btn
                  unelevated
                  color="primary"
                  text-color="white"
                  class="full-width"
                  @click="onSubscribe"
                >
                  {{ $t('footer.subscribeBtn') }}
                </q-btn>
              </div>
            </div>

            <!-- Kolom 2: Program -->
            <div class="col-6 col-sm-4 col-md-2">
              <div class="footer-heading q-mb-md">{{ $t('footer.program') }}</div>
              <ul class="footer-list">
                <li v-for="lang in headerLanguages" :key="lang.id">
                  <router-link
                    :to="{
                      path: '/berlangganan',
                      query: { languageId: lang.id, languageName: lang.name },
                    }"
                    class="footer-link row items-center no-wrap"
                  >
                    <q-img
                      v-if="lang.iconUrl"
                      :src="lang.iconUrl"
                      ratio="1"
                      class="footer-lang-flag q-mr-sm"
                    />
                    <span>{{ lang.name }}</span>
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- Kolom 3: Panduan -->
            <div class="col-6 col-sm-4 col-md-2">
              <div class="footer-heading q-mb-md">{{ $t('footer.panduanInsight') }}</div>
              <ul class="footer-list">
                <li>
                  <router-link to="/alur-belajar" class="footer-link">{{
                    $t('footer.alurBelajar')
                  }}</router-link>
                </li>
                <li>
                  <a href="/#faq" class="footer-link">{{ $t('footer.faq') }}</a>
                </li>
                <li>
                  <router-link to="/tips" class="footer-link">{{
                    $t('footer.artikelTips')
                  }}</router-link>
                </li>
                <li>
                  <a href="/tips#karir" class="footer-link">{{ $t('footer.insightKarir') }}</a>
                </li>
                <li>
                  <a href="/berlangganan" class="footer-link">{{ $t('footer.updateProgram') }}</a>
                </li>
              </ul>
            </div>

            <!-- Kolom 4: Legal -->
            <div class="col-6 col-sm-4 col-md-2">
              <div class="footer-heading q-mb-md">{{ $t('footer.legalTrust') }}</div>
              <ul class="footer-list">
                <li>
                  <a href="/syarat-ketentuan" class="footer-link">{{
                    $t('footer.syaratKetentuan')
                  }}</a>
                </li>
                <li>
                  <a href="/kebijakan-privasi" class="footer-link">{{
                    $t('footer.kebijakanPrivasi')
                  }}</a>
                </li>
                <li>
                  <a href="/kebijakan-refund" class="footer-link">{{
                    $t('footer.kebijakanRefund')
                  }}</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Metode Pembayaran -->
          <div class="footer-payment q-mt-lg q-pt-lg q-mb-xl">
            <div class="footer-heading q-mb-md">{{ $t('footer.metodePembayaran') }}</div>
            <div class="footer-payment-icons">
              <div v-for="icon in paymentIcons" :key="icon.name" class="footer-payment-icon-wrap">
                <img :src="icon.src" :alt="icon.name" class="footer-payment-icon" />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer bottom -->
        <div class="footer-bottom">
          <div class="container footer-bottom-inner">
            <div class="footer-bottom-left text-body2">
              {{ $t('footer.copyright') }}
            </div>

            <div class="footer-bottom-right row items-center q-gutter-x-sm">
              <q-btn
                flat
                round
                size="sm"
                icon="fab fa-instagram"
                target="_blank"
                href="https://instagram.com/edulang.id "
                class="footer-social-icon"
              />
              <q-btn
                flat
                round
                size="sm"
                icon="fab fa-tiktok"
                target="_blank"
                href="https://tiktok.com/@edulang.id "
                class="footer-social-icon"
              />
              <q-btn
                flat
                round
                size="sm"
                icon="far fa-envelope"
                target="_blank"
                href="mailto:contactedulang@gmail.com"
                class="footer-social-icon"
              />
            </div>
          </div>
        </div>
      </footer>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { Dark } from 'quasar'

const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

// TAMBAHAN: State untuk header scroll
const scrollTimeout = ref(null) // ref() bukan let
const showHeader = ref(true)

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

const subscribeName = ref('')
const subscribeEmail = ref('')

const languages = ref([])

const headerLanguages = computed(() =>
  languages.value.map((lang) => ({
    id: String(lang._id || lang.id),
    name: lang.name || lang.label || 'Bahasa',
    iconUrl: lang.iconUrl || lang.icon_url || '',
  })),
)

const paymentIcons = [
  { name: 'BRI', src: '/icon-trans/BANK_BRI_logo.svg.png' },
  { name: 'Mandiri', src: '/icon-trans/Bank_Mandiri_logo_2016.svg.png' },
  { name: 'CIMB Niaga', src: '/icon-trans/CIMB_Niaga_logo.svg.png' },
  { name: 'Gopay', src: '/icon-trans/Gopay_logo.svg.png' },
  { name: 'Permata Bank', src: '/icon-trans/Permata_Bank_(2024).svg.png' },
  { name: 'QRIS', src: '/icon-trans/QRIS_logo.svg.png' },
]

const isDark = ref(Dark.isActive)
const applyStoredTheme = () => {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') Dark.set(true)
  if (stored === 'light') Dark.set(false)
  isDark.value = Dark.isActive
}

const isNavActive = (path) => route.path === path
const isProgramNavActive = computed(() => {
  return route.path === '/study-abroad'
})

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

const onDrawerAlurBelajar = () => {
  router.push('/alur-belajar')
  leftDrawerOpen.value = false
}

const onDrawerLangganan = () => {
  router.push('/berlangganan')
  leftDrawerOpen.value = false
}

const onDrawerAllCourses = () => {
  goToBerlangganan()
  leftDrawerOpen.value = false
}

const onDrawerStudyAbroad = () => {
  window.location.href = 'https://study.edulang.id/ '
  leftDrawerOpen.value = false
}

const onDrawerTips = () => {
  router.push('/tips')
  leftDrawerOpen.value = false
}

const goToBerlangganan = () => {
  router.push('/berlangganan')
}

const onSubscribe = () => {
  console.log('Subscribe:', subscribeName.value, subscribeEmail.value)
}

const programOpen = ref(false)
const videoSubOpen = ref(false)
let programCloseTimer = null

const closeProgramMenu = () => {
  programOpen.value = false
  videoSubOpen.value = false
}

const onProgramAllCourses = () => {
  goToBerlangganan()
  closeProgramMenu()
}

const onProgramStudyAbroad = () => {
  window.location.href = 'https://study.edulang.id/ '
  closeProgramMenu()
}

const onProgramAllRoadmap = () => {
  router.push('/alur-belajar')
  closeProgramMenu()
}

const onProgramMouseEnter = () => {
  if (programCloseTimer) {
    clearTimeout(programCloseTimer)
    programCloseTimer = null
  }
  programOpen.value = true
}

const onProgramMouseLeave = () => {
  programCloseTimer = setTimeout(() => {
    programOpen.value = false
    videoSubOpen.value = false
  }, 150)
}

// TAMBAHAN: Handler scroll untuk header
// GANTI handleScroll() INI
// ✅ REPLACE handleScroll() INI
const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop

  // 🔥 UTAMA: SELALU TERLIHAT saat di ATAS (scrollY <= 10px)
  if (scrollY <= 10) {
    showHeader.value = true
    if (scrollTimeout.value) {
      window.clearTimeout(scrollTimeout.value) // Cancel hide
    }
    return // STOP - jangan lanjut
  }

  // Hanya saat scroll > 10px (sudah agak ke bawah)
  showHeader.value = true

  if (scrollTimeout.value) {
    window.clearTimeout(scrollTimeout.value)
  }

  scrollTimeout.value = window.setTimeout(() => {
    showHeader.value = false // Hanya hide saat scroll agak bawah + stop 1.5s
  }, 1500)
}

onMounted(() => {
  checkLoginStatus()
  fetchLanguages()
  applyStoredTheme()

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    showHeader.value = true // ✅ FORCE TERLIHAT di awal
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
  if (scrollTimeout.value) {
    window.clearTimeout(scrollTimeout.value)
  }
})

watch(
  () => route.path,
  () => {
    checkLoginStatus()
    showHeader.value = true // ✅ RESET TERLIHAT saat pindah halaman
    if (scrollTimeout.value) {
      window.clearTimeout(scrollTimeout.value)
    }
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
/* ... (CSS tetap sama seperti sebelumnya, pastikan bagian spacing di bawah di-apply) ... */

.footer-subscribe {
  max-width: 320px;
}

.footer-subscribe-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: inherit;
}

.footer-subscribe-desc {
  color: inherit;
  opacity: 0.8;
  line-height: 1.5;
}

.q-input {
  border-radius: 8px;
}

.q-btn.full-width {
  padding: 12px 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: #c1f7a0;
  color: #003387;
}

.bg-dark .q-btn.full-width {
  background: #a8e67a;
  color: #00225a;
}

.footer-social-icon {
  color: #f5f7fa;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border-radius: 50%;
  background: rgba(245, 247, 250, 0.1);
  transition: all 0.3s ease;
}

.footer-social-icon:hover {
  background: rgba(245, 247, 250, 0.2);
  transform: translateY(-2px);
}

.row.justify-center.items-center.q-gutter-x-md {
  margin: 0;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.header-text-container {
  display: flex;
  flex-direction: column;
  margin-left: 16px;
}

.edulang-header-text {
  font-size: 1.9rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.5px;
  display: inline-block;
  white-space: nowrap;
  width: 160px;
  text-align: left;
  overflow: visible;
}

.header-brand {
  overflow: visible !important;
}
.main-logo {
  height: 50px;
  width: auto;
  display: block;
}
.header-tagline {
  font-size: 8px;
  font-weight: 600;
  line-height: 1;
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.8;
  letter-spacing: 0px;
  margin-top: 4px;
}

.bg-dark .header-tagline {
  color: rgba(255, 255, 255, 0.7);
}

.absolute-center-left {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
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

.bg-dark .nav-btn {
  color: var(--edulang-white) !important;
}
.bg-dark .nav-btn:hover {
  color: var(--edulang-yellow) !important;
  background: rgba(255, 255, 255, 0.08);
}
.bg-dark .nav-btn.text-primary {
  color: var(--edulang-yellow) !important;
}
.bg-dark .q-item__section--side {
  color: var(--edulang-white) !important;
}
.bg-dark .lang-btn,
.bg-dark .lang-btn .text-weight-medium,
.bg-dark .user-menu-btn,
.bg-dark .user-menu-btn span {
  color: var(--edulang-white) !important;
}
.bg-dark .theme-icon-btn {
  color: var(--edulang-white) !important;
}
.rounded-borders {
  border-radius: 8px;
}

a {
  text-decoration: none;
}

.footer-main {
  margin-top: 2rem;
  border: none;
}
.footer-content {
  padding-top: 2.5rem;
  padding-bottom: 2rem;
}
.footer-logo {
  height: 42px;
  width: auto;
  display: block;
}
.footer-heading {
  font-size: 0.9375rem;
  font-weight: 700;
  color: inherit;
}
.footer-pt {
  color: inherit;
}
.footer-alamat {
  color: inherit;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 320px;
}
.footer-payment {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.bg-white .footer-payment {
  border-top-color: rgba(0, 0, 0, 0.08);
}
.footer-payment-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.footer-payment-icon-wrap {
  background: #fff;
  border-radius: 8px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  box-sizing: border-box;
}
.footer-payment-icon {
  height: 24px;
  width: auto;
  max-width: 80px;
  object-fit: contain;
}
.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-list li {
  margin-bottom: 0.75rem; /* Perbaikan: Tambah jarak antar list item */
}
.footer-link {
  font-size: 0.875rem;
  color: inherit;
  opacity: 0.9;
  text-decoration: none;
  transition: opacity 0.2s;
}
.footer-link:hover {
  opacity: 1;
  color: var(--edulang-blue, #0089ff);
}
.footer-lang-flag {
  width: 22px;
  height: 16px;
  min-width: 22px;
  border-radius: 3px;
  object-fit: cover;
}

.footer-bottom {
  background: #003387;
  color: #f5f7fa;
  padding: 1rem 0;
}

.footer-bottom-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-bottom-left {
  text-align: left;
}

.footer-bottom-right {
  justify-content: flex-end;
}

.footer-bottom .container {
  color: inherit;
}
.bg-dark .footer-link:hover {
  color: var(--edulang-yellow, #ffc42c);
  opacity: 1;
}

/* TAMBAHAN: CSS untuk animasi header scroll */
.main-layout-header {
  position: sticky !important; /* Ubah dari fixed ke sticky */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000 !important;
  border: none;
  box-shadow: none;
  transition:
    transform 0.4s ease-in-out,
    opacity 0.4s ease-in-out;
  transform: translateY(0);
}

.main-layout-header.header-hidden {
  transform: translateY(-100%) !important;
  opacity: 0 !important;
}

.main-layout-header:not(.header-hidden) {
  transform: translateY(0) !important;
  opacity: 1 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.main-layout-toolbar {
  padding-top: 14px;
  padding-bottom: 14px;
  min-height: 56px;
}

/* PERBAIKAN UTAMA: Spacing Navigation */
.nav-links-wrap {
  gap: 36px; /* Tambah jarak antar menu utama */
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
  padding: 8px 14px; /* Perbaikan: Tambah padding horizontal & vertikal */
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: #2d2d2d;
  margin: 0 2px;
}

.nav-btn:hover {
  color: var(--edulang-blue, #0089ff) !important;
  background: rgba(0, 137, 255, 0.05);
}

.nav-btn-active,
.nav-btn.nav-btn-active {
  color: var(--edulang-blue, #0089ff) !important;
  font-weight: 600;
}
.bg-dark .nav-btn-active,
.bg-dark .nav-btn.nav-btn-active {
  color: var(--edulang-yellow, #ffc42c) !important;
}

.learning-center-btn {
  background: transparent !important;
  border: 2px solid var(--edulang-blue, #0089ff);
  color: var(--edulang-blue, #0089ff) !important;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 9999px;
}
.learning-center-btn:hover {
  background: rgba(0, 137, 255, 0.08) !important;
  color: var(--edulang-blue, #0089ff) !important;
}
.learning-center-btn-active {
  background: var(--edulang-blue, #0089ff) !important;
  border-color: var(--edulang-blue, #0089ff) !important;
  color: var(--edulang-white, #f5f7fa) !important;
}
.bg-dark .learning-center-btn {
  border-color: var(--edulang-yellow, #ffc42c);
  color: var(--edulang-yellow, #ffc42c) !important;
}
.bg-dark .learning-center-btn-active {
  background: var(--edulang-yellow, #ffc42c) !important;
  border-color: var(--edulang-yellow, #ffc42c) !important;
  color: var(--edulang-black, #2d2d2d) !important;
}

.bg-white .nav-btn:hover {
  color: var(--edulang-blue, #0089ff) !important;
  background: rgba(0, 137, 255, 0.05);
}

.nav-btn:active,
.nav-btn:focus,
.nav-btn:active:focus {
  background: transparent !important;
}

.nav-btn::before {
  display: none !important;
}

.language-flag,
.language-flag-drawer {
  width: 24px;
  height: 16px;
  border-radius: 4px;
  object-fit: cover;
}

.user-menu-btn {
  padding: 4px 12px;
  font-weight: 500;
}

.user-menu-btn:hover {
  background: rgba(0, 137, 255, 0.05);
}

.text-weight-medium {
  font-weight: 500 !important;
}

.text-weight-bold {
  font-weight: 600 !important;
}

.text-weight-bolder {
  font-weight: 700 !important;
}

.no-wrap {
  white-space: nowrap;
}

.program-nav-wrapper {
  position: relative;
  z-index: 1;
}

.program-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px; /* Perbaikan: Tambah jarak dari tombol */
  z-index: 2000;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transform: translateZ(0);
  will-change: opacity, transform;
}

.program-dropdown-bwa {
  background: var(--edulang-white, #f5f7fa);
  min-width: 720px;
  max-width: 90vw;
}

.program-dropdown-bwa-inner {
  min-height: 300px;
}

.program-bwa-left {
  width: 320px;
  min-width: 320px;
  background: var(--edulang-navy, #003387);
  padding: 32px 28px; /* Perbaikan: Tambah padding */
  display: flex;
  align-items: center;
}

.program-bwa-left-content {
  text-align: center;
  width: 100%;
}

.program-bwa-tag {
  font-size: 0.8125rem;
  color: var(--edulang-yellow, #ffc42c);
  font-weight: 600;
  margin-bottom: 12px;
}

.program-bwa-title {
  font-size: 1.4rem; /* Perbaikan: Font size sedikit besar */
  font-weight: 700;
  color: var(--edulang-white, #f5f7fa);
  line-height: 1.4;
  margin-bottom: 12px;
}

.program-bwa-desc {
  font-size: 0.9rem; /* Perbaikan: Sedikit besar */
  color: rgba(245, 247, 250, 0.95);
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.program-bwa-btn {
  background: var(--edulang-blue, #0089ff) !important;
  color: var(--edulang-white, #f5f7fa) !important;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 8px;
}

.program-bwa-right {
  flex: 1;
  min-width: 380px;
  padding: 24px 28px; /* Perbaikan: Tambah padding */
  background: var(--edulang-white, #f5f7fa);
  max-height: 400px;
  overflow-y: auto;
}

.program-bwa-card {
  display: flex;
  align-items: flex-start;
  gap: 16px; /* Perbaikan: Tambah gap */
  padding: 18px; /* Perbaikan: Tambah padding internal card */
  border-radius: 12px;
  transition: background 0.2s;
  margin-bottom: 8px; /* Jarak antar card */
}

.program-bwa-card:last-child {
  margin-bottom: 0;
}

.program-bwa-card:hover {
  background: rgba(0, 137, 255, 0.08);
}

.program-bwa-card-icon {
  width: 52px; /* Perbaikan: Icon lebih besar */
  height: 52px;
  min-width: 52px;
  border-radius: 12px;
  background: rgba(0, 137, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-bwa-card-text {
  flex: 1;
  min-width: 0;
}

.program-bwa-card-title {
  font-size: 1.05rem; /* Perbaikan: Ukuran font */
  font-weight: 600;
  color: var(--edulang-black, #2d2d2d);
  margin-bottom: 4px;
}

.program-bwa-card-sub {
  font-size: 0.85rem;
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.7;
  margin-top: 4px;
  line-height: 1.4;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 767px) {
  .container {
    padding: 0 16px;
  }

  .main-layout-toolbar {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  .nav-links-wrap {
    display: none !important;
  }
  .edulang-header-text {
    font-size: 1rem; /* Lebih kecil lagi untuk hp kecil */
  }

  .header-tagline {
    font-size: 0.55rem;
    max-width: 120px; /* Batasi lebar agar tidak overflow */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    max-width: 100%;
    padding: 0 24px;
  }

  .nav-links-wrap {
    gap: 20px;
  }

  .nav-btn {
    font-size: 14px;
    padding: 6px 10px;
  }

  .program-dropdown-bwa {
    min-width: 600px;
    max-width: 85vw;
  }

  .program-bwa-left {
    width: 240px;
    min-width: 240px;
    padding: 20px 16px;
  }

  .program-bwa-right {
    min-width: 320px;
    padding: 16px 20px;
  }

  .footer-content .row {
    flex-direction: column;
  }

  .col-12.col-md-5.col-lg-4,
  .col-6.col-sm-4.col-md-2 {
    width: 100% !important;
    max-width: 100% !important;
    margin-bottom: 24px;
  }

  .footer-payment-icons {
    justify-content: center;
  }
  .header-text-container {
    margin-left: 8px;
    display: flex !important; /* Pastikan tetap visible */
  }

  .edulang-header-text {
    font-size: 1.2rem; /* Lebih kecil untuk mobile */
    width: auto; /* Hapus fixed width 160px */
  }

  .header-tagline {
    font-size: 0.6rem; /* Lebih kecil untuk mobile */
    margin-top: 2px;
  }
}

@media (min-width: 1024px) and (max-width: 1365px) {
  .container {
    max-width: 100%;
    padding: 0 32px;
  }

  .program-dropdown-bwa {
    min-width: 680px;
  }
}

@media (min-width: 1366px) {
  .container {
    max-width: 1400px;
    padding: 0 48px;
  }
}

@media (prefers-color-scheme: dark) {
  .bg-dark .q-drawer {
    border-left: 1px solid rgba(255, 255, 255, 0.12) !important;
  }
}

@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .main-layout-header {
    position: fixed;
    top: 0;
    z-index: 1000;
  }
}

@supports (-webkit-touch-callout: none) {
  .lt-md .main-layout-header {
    position: fixed !important;
    top: 0 !important;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .program-dropdown {
    will-change: opacity, transform;
  }

  .nav-btn {
    will-change: color, background;
  }
}

@media print {
  .q-drawer,
  .main-layout-header,
  .footer-main {
    display: none !important;
  }

  .container {
    max-width: none !important;
    padding: 0 !important;
  }
}

@media (max-width: 1023px) {
  .header-text-container {
    display: flex !important;
    margin-left: 8px;
  }

  .edulang-header-text {
    font-size: 1.2rem !important; /* Override inline style */
  }
}
</style>
