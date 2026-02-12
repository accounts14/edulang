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

        <!-- Navigasi Utama: sama urutan seperti header -->
        <q-item clickable v-ripple @click="$router.push('/')" class="text-weight-bold text-primary">
          <q-item-section>{{ $t('nav.home') }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onDrawerAlurBelajar">
          <q-item-section>{{ $t('nav.learningPath') }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onDrawerLangganan">
          <q-item-section>{{ $t('nav.langganan') }}</q-item-section>
        </q-item>

        <!-- PROGRAM: Video courses (All + bahasa) + Study abroad -->
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

        <!-- Auth -->
        <q-separator class="q-my-md" />

        <!-- BAGIAN BAHASA & THEME DI-DISABLE (DIHAPUS DARI DRAWER) -->

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

          <!-- Dashboard (baru ditambahkan) -->
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
      <!-- Header floating: ikut scroll (bukan fixed) -->
      <header :class="['main-layout-header', isDark ? 'bg-dark text-white' : 'bg-white text-dark']">
        <q-toolbar class="q-px-xl main-layout-toolbar">
          <q-toolbar-title
            shrink
            class="relative-position cursor-pointer header-brand"
            @click="$router.push('/')"
            style="min-width: 200px; height: 50px"
          >
            <div class="absolute-center-left">
              <!-- Logo Image -->
              <img src="~assets/Edulang1.png" class="main-logo" alt="Edulang Logo" />

              <!-- Kontainer untuk teks: Edulang (di atas) + tagline (di bawah) -->
              <div class="header-text-container gt-sm">
                <!-- Edulang (di atas, warna #003387, lebar sesuai 'World with Education') -->
                <div
                  class="edulang-header-text"
                  style="color: #003387; font-weight: bold; font-size: 1.9rem; line-height: 1.2"
                >
                  Edulang
                </div>

                <!-- Tagline: Unlock The World with Education -->
                <div class="header-tagline">
                  {{ $t('nav.tagline') }}
                </div>
              </div>
            </div>
          </q-toolbar-title>

          <q-space />

          <div class="gt-md row items-center nav-links-wrap text-weight-medium">
            <!-- Learning Path -->
            <q-btn
              flat
              no-caps
              :label="$t('nav.learningPath')"
              :class="['nav-btn', { 'nav-btn-active': isNavActive('/alur-belajar') }]"
              @click="$router.push('/alur-belajar')"
            />
            <!-- PROGRAM (sekarang di posisi ke-2) -->
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
                    <!-- Kolom kiri: dark blue CTA (konsep BWA) -->
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
                    <!-- Kolom kanan: daftar program -->
                    <div class="program-bwa-right">
                      <div class="program-bwa-card cursor-pointer" @click="onProgramAllCourses">
                        <div class="program-bwa-card-icon">
                          <q-icon name="play_circle_filled" size="28px" color="primary" />
                        </div>
                        <div class="program-bwa-card-text">
                          <div class="program-bwa-card-title">{{ $t('nav.allCourses') }}</div>
                          <div class="program-bwa-card-sub">{{ $t('nav.allCoursesSub') }}</div>
                        </div>
                      </div>
                      <div class="program-bwa-card cursor-pointer" @click="onProgramStudyAbroad">
                        <div class="program-bwa-card-icon">
                          <q-icon name="flight_takeoff" size="28px" color="primary" />
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
            <!-- Langganan (sekarang di posisi ke-3) -->
            <q-btn
              flat
              no-caps
              :label="$t('nav.langganan')"
              :class="['nav-btn', { 'nav-btn-active': isNavActive('/berlangganan') }]"
              @click="$router.push('/berlangganan')"
            />
            <!-- Tips & Informasi -->
            <q-btn
              flat
              no-caps
              :label="$t('nav.tipsInfo')"
              :class="['nav-btn', { 'nav-btn-active': isNavActive('/tips') }]"
              @click="$router.push('/tips')"
            />
          </div>

          <q-space />

          <div class="gt-sm row items-center q-gutter-md">
            <!-- BAGIAN LANGUAGE SELECTOR DI-DISABLE (DIHAPUS) -->

            <!-- BAGIAN THEME TOGGLE DI-DISABLE (DIHAPUS) -->

            <!-- Learning Center (→ login) / User Info -->
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
              <!-- User Menu -->
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

      <footer :class="[isDark ? 'bg-dark text-white' : 'bg-white text-dark', 'footer-main']">
        <div class="container footer-content">
          <div class="row q-col-gutter-xl">
            <!-- Brand + PT + Alamat + Subscribe Email -->
            <div class="col-12 col-md-5 col-lg-4">
              <img src="~assets/Edulang.png" alt="Edulang" class="footer-logo q-mb-md" />
              <div class="footer-pt text-weight-bold text-body1 q-mb-xs">
                {{ $t('footer.ptName') }}
              </div>
              <p class="footer-alamat text-body2 q-ma-none">
                {{ $t('footer.alamatValue') }}
              </p>

              <!-- 🔹 SUBSCRIBE EMAIL (dibawah alamat, seperti gambar 2) -->
              <div class="footer-subscribe q-mt-md">
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

            <!-- Program - Bahasa Yang Tersedia -->
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

            <!-- Panduan & Insight -->
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

            <!-- Legal & Trust -->
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

        <!-- Footer bottom (copyright) -->
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
                href="https://instagram.com/edulang.id"
                class="footer-social-icon"
              />
              <q-btn
                flat
                round
                size="sm"
                icon="fab fa-tiktok"
                target="_blank"
                href="https://tiktok.com/@edulang.id"
                class="footer-social-icon"
              />
              <q-btn
                flat
                round
                size="sm"
                icon="fab fa-whatsapp"
                target="_blank"
                href="https://wa.me/6282279506450"
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
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { Dark } from 'quasar'

const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

// Subscribe form state
const subscribeName = ref('')
const subscribeEmail = ref('')

// i18n

// Bahasa untuk dropdown Kelas Bahasa di header
const languages = ref([])

const headerLanguages = computed(() =>
  languages.value.map((lang) => ({
    id: String(lang._id || lang.id),
    name: lang.name || lang.label || 'Bahasa',
    iconUrl: lang.iconUrl || lang.icon_url || '',
  })),
)

// Icon metode pembayaran (public/icon-trans)
const paymentIcons = [
  { name: 'BRI', src: '/icon-trans/BANK_BRI_logo.svg.png' },
  { name: 'Mandiri', src: '/icon-trans/Bank_Mandiri_logo_2016.svg.png' },
  { name: 'CIMB Niaga', src: '/icon-trans/CIMB_Niaga_logo.svg.png' },
  { name: 'Gopay', src: '/icon-trans/Gopay_logo.svg.png' },
  { name: 'Permata Bank', src: '/icon-trans/Permata_Bank_(2024).svg.png' },
  { name: 'QRIS', src: '/icon-trans/QRIS_logo.svg.png' },
]

// Theme (Dark mode)
const isDark = ref(Dark.isActive)
const applyStoredTheme = () => {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') Dark.set(true)
  if (stored === 'light') Dark.set(false)
  isDark.value = Dark.isActive
}

// Active nav (route) – warna biru untuk item yang aktif ($info / --edulang-blue)
const isNavActive = (path) => route.path === path
const isProgramNavActive = computed(() => {
  // Hanya aktif jika di halaman Study Abroad (atau halaman khusus program lain di masa depan)
  return route.path === '/study-abroad'
})

// Language switch

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
  window.location.href = 'https://study.edulang.id/'
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
  // Add your subscribe logic here
}

// PROGRAM hover dropdown
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
  window.location.href = 'https://study.edulang.id/'
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

onMounted(() => {
  checkLoginStatus()
  fetchLanguages()
  applyStoredTheme()
})

watch(
  () => route.path,
  () => {
    checkLoginStatus()
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
  background: #c1f7a0; /* hijau muda seperti gambar 2 */
  color: #003387;
}

.bg-dark .q-btn.full-width {
  background: #a8e67a;
  color: #00225a;
}

/* Social icons at very bottom (gambar 3) */
.footer-social-bottom {
  background: var(--edulang-navy, #003387);
  padding: 12px 0;
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

/* Pastikan tidak ada margin/padding berlebih */
.row.justify-center.items-center.q-gutter-x-md {
  margin: 0;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.header-text-container {
  display: flex;
  flex-direction: column;
  margin-left: 16px; /* jarak antara logo dan teks */
}

.edulang-header-text {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.5px;
  /* Agar lebar visual ≈ 'World with Education' */
  /* Gunakan fit-content + max-width sesuai panjang string */
  display: inline-block;
  white-space: nowrap;
  /* Kita gunakan trick: width ~ panjang 'World with Education' dalam px */
  /* Estimasi: 'World with Education' ≈ 160px pada font Poppins 10px (tagline), tapi untuk Edulang kita pakai ukuran lebih besar */
  /* Lebih aman: gunakan width: 160px (sesuai estimasi visual), tidak gepeng */
  width: 160px;
  text-align: left;
  overflow: visible;
}

.header-brand {
  overflow: visible !important;
}
.main-logo {
  height: 50px; /* Ukuran logo sedikit dikecilkan agar elegan */
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

.header-tagline-container {
  position: absolute;
  bottom: -10px; /* Menempel tepat di bawah logo */
  left: 40px; /* Geser ke kanan agar lurus dengan teks 'Edulang' (sesuaikan dengan lebar icon logo Anda) */
  white-space: nowrap;
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

/* Dark mode: nav & kontrol di header/footer/drawer pakai --edulang-white */
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

/* Footer – tanpa border garis */
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
.footer-tagline {
  color: inherit;
  opacity: 0.85;
  line-height: 1.6;
  max-width: 320px;
}
.footer-heading {
  font-size: 0.9375rem;
  font-weight: 700;
  color: inherit;
}
.footer-heading-sub {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.03em;
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
  margin-bottom: 0.5rem;
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
/* Footer bottom strip – Edulang Navy per Brand Guideline (#003387) */
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

.line-height-1-8 {
  line-height: 1.8;
}

.bg-indigo-10 {
  background-color: #003387 !important;
}

.main-layout-header {
  position: relative;
  z-index: 1;
  border: none;
  box-shadow: none;
}
.main-layout-toolbar {
  padding-top: 14px;
  padding-bottom: 14px;
  min-height: 56px;
}
.nav-links-wrap {
  gap: 28px;
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
  padding: 6px 10px;
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

/* Nav item aktif (route saat ini) – biru dari $info / --edulang-blue */
.nav-btn-active,
.nav-btn.nav-btn-active {
  color: var(--edulang-blue, #0089ff) !important;
  font-weight: 600;
}
.bg-dark .nav-btn-active,
.bg-dark .nav-btn.nav-btn-active {
  color: var(--edulang-yellow, #ffc42c) !important;
}

/* Learning Center: outline biru (seperti gambar), aktif = isi biru */
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

/* Light mode only (override dark rules above) */
.bg-white .nav-btn:hover {
  color: var(--edulang-blue, #0089ff) !important;
  background: rgba(0, 137, 255, 0.05);
}

/* Hilangkan background saat diklik/active */
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

/* User Menu Button */
.user-menu-btn {
  padding: 4px 12px;
  font-weight: 500;
}

.user-menu-btn:hover {
  background: rgba(0, 137, 255, 0.05);
}

/* Fix text weight */
.text-weight-medium {
  font-weight: 500 !important;
}

.text-weight-bold {
  font-weight: 600 !important;
}

.text-weight-bolder {
  font-weight: 700 !important;
}

/* No wrap untuk user menu agar tidak break */
.no-wrap {
  white-space: nowrap;
}

/* PROGRAM dropdown konsep BWA: kiri dark blue CTA, kanan list program */
.program-nav-wrapper {
  position: relative; /* wajib agar absolute child berada tepat */
  z-index: 1; /* biar tidak ikut tertimpa oleh stacking context lain */
}

.program-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  z-index: 2000; /* ⚠️ DITINGKATKAN DARI 100 → 2000 */
  border: 1px solid rgba(0, 0, 0, 0.08);
  /* Tambahkan ini jika masih tertimpa oleh overflow parent */
  transform: translateZ(0); /* force GPU layer, hindari clipping */
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
  width: 320px; /* Ubah dari 280px menjadi 320px */
  min-width: 320px; /* Ubah dari 280px menjadi 320px */
  background: var(--edulang-navy, #003387);
  padding: 28px 24px;
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
  margin-bottom: 10px;
}

.program-bwa-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--edulang-white, #f5f7fa);
  line-height: 1.3;
  margin-bottom: 8px;
}

.program-bwa-desc {
  font-size: 0.875rem;
  color: rgba(245, 247, 250, 0.95);
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.program-bwa-btn {
  background: var(--edulang-blue, #0089ff) !important;
  color: var(--edulang-white, #f5f7fa) !important;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
}

.program-bwa-right {
  flex: 1;
  min-width: 380px;
  padding: 20px 24px;
  background: var(--edulang-white, #f5f7fa);
  max-height: 400px;
  overflow-y: auto;
}

.program-bwa-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 12px;
  border-radius: 10px;
  transition: background 0.2s;
}

.program-bwa-card:hover {
  background: rgba(0, 137, 255, 0.08);
}

.program-bwa-card-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 10px;
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
  font-size: 1rem;
  font-weight: 600;
  color: var(--edulang-black, #2d2d2d);
}

.program-bwa-card-sub {
  font-size: 0.8125rem;
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.7;
  margin-top: 4px;
}

.program-bwa-section {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(45, 45, 45, 0.12);
}

.program-bwa-section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding-left: 2px;
}

.program-bwa-lang {
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: var(--edulang-black, #2d2d2d);
  transition: background 0.2s;
}

.program-bwa-lang:hover {
  background: rgba(0, 137, 255, 0.08);
  color: var(--edulang-blue, #0089ff);
}

.program-bwa-flag {
  width: 24px;
  height: 16px;
  min-width: 24px;
  border-radius: 4px;
  margin-right: 10px;
  object-fit: cover;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
}

/* ========================================
   🎯 RESPONSIVE BREAKPOINTS LENGKAP
   ======================================== */

/* MOBILE (< 768px) - SUDAH OK */
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
}

/* IPAD (768px - 1023px) - BARU */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    max-width: 100%;
    padding: 0 24px;
  }

  /* Header: compact nav */
  .nav-links-wrap {
    gap: 16px;
  }

  .nav-btn {
    font-size: 14px;
    padding: 4px 12px;
  }

  /* Program dropdown: lebih compact */
  .program-dropdown-bwa {
    min-width: 600px;
    max-width: 85vw;
  }

  .program-bwa-left {
    width: 280px;
    min-width: 280px;
    padding: 20px 16px;
  }

  .program-bwa-right {
    min-width: 320px;
    padding: 16px 20px;
  }

  /* Footer: 2 kolom */
  .footer-content .row {
    flex-direction: column;
  }

  .col-12.col-md-5.col-lg-4,
  .col-6.col-sm-4.col-md-2 {
    width: 100% !important;
    max-width: 100% !important;
  }

  .footer-payment-icons {
    justify-content: center;
  }
}

/* DESKTOP SMALL (1024px - 1365px) */
@media (min-width: 1024px) and (max-width: 1365px) {
  .container {
    max-width: 100%;
    padding: 0 32px;
  }

  .program-dropdown-bwa {
    min-width: 680px;
  }
}

/* DESKTOP LARGE (≥1366px) - SUDAH OK */
@media (min-width: 1366px) {
  .container {
    max-width: 1400px;
    padding: 0 48px;
  }
}

/* DARK MODE FIXES */
@media (prefers-color-scheme: dark) {
  .bg-dark .q-drawer {
    border-left: 1px solid rgba(255, 255, 255, 0.12) !important;
  }
}

/* IPAD PORTRAIT FIX (768x1024) */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .main-layout-header {
    position: sticky;
    top: 0;
    z-index: 1000;
  }
}

/* SAFARI IPAD FIX */
@supports (-webkit-touch-callout: none) {
  .lt-md .main-layout-header {
    position: sticky !important;
    top: 0 !important;
  }
}

/* ANIMATION SMOOTHNESS */
@media (prefers-reduced-motion: no-preference) {
  .program-dropdown {
    will-change: opacity, transform;
  }

  .nav-btn {
    will-change: color, background;
  }
}

/* PRINT OPTIMIZATION */
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
</style>
