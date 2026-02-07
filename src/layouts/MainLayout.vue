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
            <img src="~assets/Edulang.png" style="height: 40px; width: auto" alt="Edulang Logo" />
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
            <q-item class="text-caption text-weight-bold q-px-md q-pt-sm">
              <q-item-section>{{ $t('nav.semuaBahasaTerdaftar') }}</q-item-section>
            </q-item>
            <q-item
              v-for="lang in headerLanguages"
              :key="lang.id"
              clickable
              v-ripple
              dense
              @click="onDrawerKelasBahasa(lang)"
            >
              <q-item-section v-if="lang.iconUrl" avatar>
                <q-img :src="lang.iconUrl" ratio="1" class="language-flag-drawer" />
              </q-item-section>
              <q-item-section>{{ lang.name }}</q-item-section>
            </q-item>
          </q-expansion-item>
          <q-item clickable v-ripple dense @click="onDrawerStudyAbroad">
            <q-item-section>{{ $t('nav.studyAbroad') }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable v-ripple @click="onDrawerTips">
          <q-item-section>{{ $t('nav.tipsInfo') }}</q-item-section>
        </q-item>

        <!-- Pemisah -->
        <q-separator class="q-my-md" />

        <!-- Bahasa + Theme -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="language" size="sm" />
          </q-item-section>
          <q-item-section>{{ $t('lang.pilihBahasa') }}</q-item-section>
          <q-item-section side>
            <q-btn flat dense no-caps :label="currentLangLabel">
              <q-menu>
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup @click="setLocale('id-ID')">
                    <q-item-section>{{ $t('lang.ind') }}</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="setLocale('en-US')">
                    <q-item-section>{{ $t('lang.eng') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-icon :name="isDark ? 'dark_mode' : 'light_mode'" size="sm" />
          </q-item-section>
          <q-item-section>{{ $t('theme.darkMode') }}</q-item-section>
          <q-item-section side>
            <q-toggle dense v-model="isDark" @update:model-value="toggleDark" />
          </q-item-section>
        </q-item>

        <!-- Auth -->
        <q-separator class="q-my-md" />

        <template v-if="!isLoggedIn">
          <q-item clickable v-ripple @click="$router.push('/login')">
            <q-item-section>{{ $t('auth.masuk') }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="$router.push('/register')">
            <q-item-section class="text-warning text-weight-bold">{{
              $t('auth.daftar')
            }}</q-item-section>
          </q-item>
        </template>

        <template v-else>
          <q-item class="q-py-sm">
            <q-item-section class="text-weight-bold">{{
              $t('auth.halo', { name: userName })
            }}</q-item-section>
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
      <header
        :class="[
          'main-layout-header shadow-1',
          isDark ? 'bg-dark text-white' : 'bg-white text-dark',
        ]"
      >
        <q-toolbar class="q-px-xl q-py-xs">
          <q-toolbar-title
            shrink
            class="flex items-center cursor-pointer"
            @click="$router.push('/')"
          >
            <img src="~assets/Edulang.png" class="main-logo" alt="Edulang Logo" />
          </q-toolbar-title>

          <q-space />

          <div class="gt-md row items-center q-gutter-x-lg text-weight-medium">
            <!-- Learning path → Alur Belajar -->
            <q-btn
              flat
              no-caps
              :label="$t('nav.learningPath')"
              class="nav-btn"
              @click="$router.push('/alur-belajar')"
            />
            <!-- Langganan → Berlangganan -->
            <q-btn
              flat
              no-caps
              :label="$t('nav.langganan')"
              class="nav-btn"
              @click="$router.push('/berlangganan')"
            />
            <!-- PROGRAM: hover → Video courses (sub: All courses + Semua bahasa) + Study abroad -->
            <div
              class="program-nav-wrapper relative-position"
              @mouseenter="onProgramMouseEnter"
              @mouseleave="onProgramMouseLeave"
            >
              <q-btn flat no-caps :label="$t('nav.program')" class="nav-btn" />
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
                    <!-- Kolom kanan: daftar program dengan icon + title + subtitle -->
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
                      <div class="program-bwa-section">
                        <div class="program-bwa-section-label">
                          {{ $t('nav.semuaBahasaTerdaftar') }}
                        </div>
                        <div
                          v-for="lang in headerLanguages"
                          :key="lang.id"
                          class="program-bwa-lang row items-center cursor-pointer"
                          @click="onProgramLanguage(lang)"
                        >
                          <q-img
                            v-if="lang.iconUrl"
                            :src="lang.iconUrl"
                            ratio="1"
                            class="program-bwa-flag"
                          />
                          <span>{{ lang.name }}</span>
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
            <!-- Tips & Informasi -->
            <q-btn
              flat
              no-caps
              :label="$t('nav.tipsInfo')"
              class="nav-btn"
              @click="$router.push('/tips')"
            />
          </div>

          <q-space />

          <div class="gt-sm row items-center q-gutter-md">
            <!-- Language Selector -->
            <q-btn flat dense no-caps class="lang-btn">
              <q-icon name="language" size="sm" class="q-mr-xs" />
              <span class="text-weight-medium">{{ currentLangLabel }}</span>
              <q-menu anchor="bottom right" self="top right">
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup @click="setLocale('id-ID')">
                    <q-item-section>{{ $t('lang.ind') }}</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="setLocale('en-US')">
                    <q-item-section>{{ $t('lang.eng') }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <q-toggle
              dense
              v-model="isDark"
              @update:model-value="toggleDark"
              :label="$t('theme.darkMode')"
              class="theme-toggle"
            />

            <!-- Auth Buttons / User Info -->
            <template v-if="!isLoggedIn">
              <q-btn
                flat
                no-caps
                :label="$t('auth.masuk')"
                class="text-weight-medium"
                @click="$router.push('/login')"
              />
              <q-btn
                unelevated
                no-caps
                :label="$t('auth.daftar')"
                color="warning"
                text-color="dark"
                class="text-weight-medium q-px-md rounded-borders"
                @click="$router.push('/register')"
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
                      <q-item-section>Home</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="$router.push('/profile')">
                      <q-item-section avatar>
                        <q-icon name="person" />
                      </q-item-section>
                      <q-item-section>Profil Saya</q-item-section>
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

      <footer :class="[isDark ? 'bg-dark text-white' : 'bg-white text-dark', 'border-top']">
        <div class="container footer-content">
          <div class="row q-col-gutter-xl">
            <!-- Brand + tagline -->
            <div class="col-12 col-md-5 col-lg-4">
              <img src="~assets/Edulang.png" alt="Edulang" class="footer-logo q-mb-md" />
              <p class="footer-tagline text-body2">
                {{ $t('footer.tagline') }}
              </p>
            </div>

            <!-- Kontak -->
            <div class="col-6 col-sm-4 col-md-2">
              <div class="footer-heading q-mb-md">{{ $t('footer.kontak') }}</div>
              <ul class="footer-list">
                <li>
                  <a
                    href="mailto:contactedulang@gmail.com"
                    class="footer-link row items-center no-wrap"
                  >
                    <q-icon name="mail" size="18px" class="q-mr-sm" />
                    {{ $t('footer.emailSupport') }}
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/6282279506450"
                    target="_blank"
                    rel="noopener"
                    class="footer-link row items-center no-wrap"
                  >
                    <q-icon name="fab fa-whatsapp" size="18px" class="q-mr-sm" />
                    {{ $t('footer.whatsappKonsultasi') }}
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/edulang.id"
                    target="_blank"
                    rel="noopener"
                    class="footer-link row items-center no-wrap"
                  >
                    <q-icon name="fab fa-instagram" size="18px" class="q-mr-sm" />
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@edulang.id"
                    target="_blank"
                    rel="noopener"
                    class="footer-link row items-center no-wrap"
                  >
                    <q-icon name="fab fa-tiktok" size="18px" class="q-mr-sm" />
                    Tiktok
                  </a>
                </li>
              </ul>
            </div>

            <!-- Program - Bahasa Yang Tersedia (dari endpoint) -->
            <div class="col-6 col-sm-4 col-md-2">
              <div class="footer-heading q-mb-md">{{ $t('footer.program') }}</div>
              <div class="footer-heading-sub q-mb-sm">{{ $t('footer.bahasaTersedia') }}</div>
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

            <!-- Panduan -->
            <div class="col-6 col-sm-4 col-md-2">
              <div class="footer-heading q-mb-md">{{ $t('footer.panduan') }}</div>
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
                  <router-link to="/contact" class="footer-link">{{
                    $t('footer.konsultasi')
                  }}</router-link>
                </li>
              </ul>
            </div>

            <!-- Insight -->
            <div class="col-6 col-sm-4 col-md-2">
              <div class="footer-heading q-mb-md">{{ $t('footer.insight') }}</div>
              <ul class="footer-list">
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
        </div>

        <div class="footer-bottom">
          <div class="container text-center text-body2">
            {{ $t('footer.copyright') }}
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
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

// i18n
const { locale, t } = useI18n({ useScope: 'global' })

// Bahasa untuk dropdown Kelas Bahasa di header
const languages = ref([])

const headerLanguages = computed(() =>
  languages.value.map((lang) => ({
    id: String(lang._id || lang.id),
    name: lang.name || lang.label || 'Bahasa',
    iconUrl: lang.iconUrl || lang.icon_url || '',
  })),
)

// Theme (Dark mode)
const isDark = ref(Dark.isActive)
const applyStoredTheme = () => {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark') Dark.set(true)
  if (stored === 'light') Dark.set(false)
  isDark.value = Dark.isActive
}

const toggleDark = (val) => {
  Dark.set(!!val)
  isDark.value = Dark.isActive
  localStorage.setItem('theme', Dark.isActive ? 'dark' : 'light')
}

// Language switch
const currentLangLabel = computed(() => (locale.value === 'en-US' ? t('lang.eng') : t('lang.ind')))
const setLocale = (l) => {
  locale.value = l
  localStorage.setItem('locale', l)
}

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

const goToBerlanggananByLanguage = (lang) => {
  router.push({
    path: '/berlangganan',
    query: {
      languageId: lang.id,
      languageName: lang.name,
    },
  })
}

const onDrawerKelasBahasa = (lang) => {
  goToBerlanggananByLanguage(lang)
  leftDrawerOpen.value = false
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
  router.push('/contact')
  leftDrawerOpen.value = false
}

const onDrawerTips = () => {
  router.push('/tips')
  leftDrawerOpen.value = false
}

const goToBerlangganan = () => {
  router.push('/berlangganan')
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

const onProgramLanguage = (lang) => {
  goToBerlanggananByLanguage(lang)
  closeProgramMenu()
}

const onProgramStudyAbroad = () => {
  router.push('/contact')
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
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
.main-logo {
  height: 42px;
  max-height: 42px;
  width: auto;
  display: block;
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
.bg-dark .theme-toggle {
  color: var(--edulang-white) !important;
}
.rounded-borders {
  border-radius: 8px;
}

a {
  text-decoration: none;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

/* Footer baru */
.footer-main {
  margin-top: 2rem;
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
.footer-bottom {
  background: var(--edulang-navy, #003387);
  color: var(--edulang-white, #f5f7fa);
  padding: 1rem 0;
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
  color: #0089ff !important;
  background: rgba(0, 137, 255, 0.05);
}

/* Light mode only (override dark rules above) */
.bg-white .nav-btn:hover {
  color: #0089ff !important;
  background: rgba(0, 137, 255, 0.05);
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
  display: inline-flex;
}

.program-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  z-index: 100;
  border: 1px solid rgba(0, 0, 0, 0.08);
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
</style>
