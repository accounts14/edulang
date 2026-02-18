<template>
  <q-layout view="lHh Lpr lff" class="font-poppins">
    <!-- Google Translate Element (hidden) -->
    <div id="google_translate_element" style="display: none"></div>

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

        <!-- Language Selector in Drawer (Mobile) -->
        <q-item class="q-mb-md">
          <q-item-section>
            <div class="row q-gutter-sm">
              <q-btn
                v-for="lang in availableLanguages"
                :key="lang.code"
                :label="lang.label"
                :color="currentLanguage === lang.code ? 'primary' : 'grey-5'"
                :flat="currentLanguage !== lang.code"
                size="sm"
                @click="changeLanguage(lang.code)"
              />
            </div>
          </q-item-section>
        </q-item>

        <q-separator class="q-mb-md" />

        <!-- Navigasi Utama -->
        <q-item clickable v-ripple @click="$router.push('/')" class="text-weight-bold text-primary">
          <q-item-section>{{ getText('nav.home') }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onDrawerAlurBelajar">
          <q-item-section>{{ getText('nav.learningPath') }}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onDrawerLangganan">
          <q-item-section>{{ getText('nav.langganan') }}</q-item-section>
        </q-item>

        <!-- PROGRAM -->
        <q-expansion-item :label="getText('nav.program')" icon="school" class="text-primary">
          <q-expansion-item :label="getText('nav.videoCourses')" header-class="text-weight-medium">
            <q-item clickable v-ripple dense @click="onDrawerAllCourses">
              <q-item-section>{{ getText('nav.allCourses') }}</q-item-section>
            </q-item>
          </q-expansion-item>
          <q-item clickable v-ripple dense @click="onDrawerStudyAbroad">
            <q-item-section>{{ getText('nav.studyAbroad') }}</q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable v-ripple @click="onDrawerTips">
          <q-item-section>{{ getText('nav.tipsInfo') }}</q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <template v-if="!isLoggedIn">
          <q-item clickable v-ripple @click="$router.push('/login')">
            <q-item-section class="text-weight-medium">{{
              getText('nav.learningCenter')
            }}</q-item-section>
          </q-item>
        </template>

        <template v-else>
          <q-item class="q-py-sm">
            <q-item-section class="text-weight-bold">{{
              getText('auth.halo', { name: userName })
            }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="$router.push('/dashboard')">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>{{ getText('nav.dashboard') }}</q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="handleLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section class="text-negative text-weight-bold">{{
              getText('auth.logout')
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
                  {{ getText('nav.tagline') }}
                </div>
              </div>
            </div>
          </q-toolbar-title>

          <q-space />

          <!-- Nav Links (Desktop) -->
          <div class="gt-md row items-center nav-links-wrap text-weight-medium">
            <!-- Language Selector Button (Left of Learning Path) -->
            <div
              class="language-selector-wrapper relative-position q-mr-md"
              @mouseenter="onLangMouseEnter"
              @mouseleave="onLangMouseLeave"
            >
              <q-btn
                flat
                no-caps
                class="lang-selector-btn"
                :class="{ 'lang-active': showLangMenu }"
              >
                <div class="row items-center no-wrap">
                  <q-icon name="language" size="20px" class="q-mr-sm" />
                  <span class="text-weight-medium">{{ currentLanguageLabel }}</span>
                  <q-icon name="expand_more" size="16px" class="q-ml-xs" />
                </div>
              </q-btn>

              <transition name="dropdown-fade">
                <div v-show="showLangMenu" class="lang-dropdown shadow-2 rounded-borders">
                  <q-list style="min-width: 180px">
                    <q-item
                      v-for="lang in availableLanguages"
                      :key="lang.code"
                      clickable
                      :class="{ 'bg-primary text-white': currentLanguage === lang.code }"
                      @click="changeLanguage(lang.code)"
                    >
                      <q-item-section avatar>
                        <span class="text-h6">{{ lang.flag }}</span>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ lang.name }}</q-item-label>
                        <q-item-label
                          caption
                          :class="currentLanguage === lang.code ? 'text-white' : 'text-grey'"
                        >
                          {{ lang.localName }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side v-if="currentLanguage === lang.code">
                        <q-icon
                          name="check"
                          :color="currentLanguage === lang.code ? 'white' : 'primary'"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </transition>
            </div>

            <q-btn
              flat
              no-caps
              :label="getText('nav.learningPath')"
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
                :label="getText('nav.program')"
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
                        <div class="program-bwa-tag">{{ getText('nav.programTrusted') }}</div>
                        <div class="program-bwa-title">{{ getText('nav.programTitle') }}</div>
                        <p class="program-bwa-desc">{{ getText('nav.programDesc') }}</p>
                        <q-btn
                          unelevated
                          no-caps
                          class="program-bwa-btn"
                          :label="getText('nav.programCta')"
                          @click="onProgramAllRoadmap"
                        />
                      </div>
                    </div>
                    <!-- Kolom kanan -->
                    <div class="program-bwa-right">
                      <div class="program-bwa-card cursor-pointer" @click="onProgramAllCourses">
                        <div class="program-bwa-card-icon">
                          <q-icon name="play_circle_filled" size="24px" color="primary" />
                        </div>
                        <div class="program-bwa-card-text">
                          <div class="program-bwa-card-title">{{ getText('nav.allCourses') }}</div>
                          <div class="program-bwa-card-sub">{{ getText('nav.allCoursesSub') }}</div>
                        </div>
                      </div>

                      <div class="program-bwa-card cursor-pointer" @click="onProgramStudyAbroad">
                        <div class="program-bwa-card-icon">
                          <q-icon name="flight_takeoff" size="24px" color="primary" />
                        </div>
                        <div class="program-bwa-card-text">
                          <div class="program-bwa-card-title">{{ getText('nav.studyAbroad') }}</div>
                          <div class="program-bwa-card-sub">
                            {{ getText('nav.studyAbroadSub') }}
                          </div>
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
              :label="getText('nav.langganan')"
              :class="['nav-btn', { 'nav-btn-active': isNavActive('/berlangganan') }]"
              @click="$router.push('/berlangganan')"
            />
            <q-btn
              flat
              no-caps
              :label="getText('nav.tipsInfo')"
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
                :label="getText('nav.learningCenter')"
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
                  <span class="text-weight-medium">{{
                    getText('auth.halo', { name: userName })
                  }}</span>
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
                      <q-item-section class="text-negative">{{
                        getText('auth.logout')
                      }}</q-item-section>
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
                {{ getText('footer.ptName') }}
              </div>
              <p class="footer-alamat text-body2 q-ma-none">
                {{ getText('footer.alamatValue') }}
              </p>

              <div class="footer-subscribe q-mt-lg">
                <div class="footer-subscribe-title text-h6 q-mb-sm">
                  {{ getText('footer.subscribeTitle') }}
                </div>
                <p class="footer-subscribe-desc text-caption q-mb-md">
                  {{ getText('footer.subscribeDesc') }}
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
                  {{ getText('footer.subscribeBtn') }}
                </q-btn>
              </div>
            </div>

            <!-- Kolom 2: Program -->
            <div class="">
              <div class="footer-heading q-mb-md">{{ getText('footer.program') }}</div>
              <ul class="footer-list">
                <li v-for="lang in footerLanguagesWithIcons" :key="lang.id">
                  <router-link
                    :to="{
                      path: '/berlangganan',
                      query: { languageId: lang.id, languageName: lang.name },
                    }"
                    class="footer-link row items-center no-wrap"
                  >
                    <!-- TAMPILKAN ICON JIKA ADA -->
                    <template v-if="lang.iconUrl">
                      <q-img :src="lang.iconUrl" ratio="1" class="footer-lang-flag q-mr-sm" />
                    </template>
                    <!-- TAMPILKAN EMOJI FLAG JIKA TIDAK ADA ICON -->
                    <template v-else-if="lang.flag">
                      <span class="footer-lang-emoji q-mr-sm">{{ lang.flag }}</span>
                    </template>
                    <span>{{ lang.name }}</span>
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- Kolom 3: Panduan -->
            <div class="">
              <div class="footer-heading q-mb-md">{{ getText('footer.panduanInsight') }}</div>
              <ul class="footer-list">
                <li>
                  <router-link to="/alur-belajar" class="footer-link">{{
                    getText('footer.alurBelajar')
                  }}</router-link>
                </li>
                <li>
                  <a href="/#faq" class="footer-link">{{ getText('footer.faq') }}</a>
                </li>
                <li>
                  <router-link to="/tips" class="footer-link">{{
                    getText('footer.artikelTips')
                  }}</router-link>
                </li>
                <li>
                  <a href="/about" class="footer-link">{{ getText('footer.About') }}</a>
                </li>
                <li>
                  <a href="/tips#karir" class="footer-link">{{ getText('footer.insightKarir') }}</a>
                </li>
                <li>
                  <a href="/berlangganan" class="footer-link">{{
                    getText('footer.updateProgram')
                  }}</a>
                </li>
              </ul>
            </div>

            <!-- Kolom 4: Legal -->
            <div class="">
              <div class="footer-heading q-mb-md">{{ getText('footer.legalTrust') }}</div>
              <ul class="footer-list">
                <li>
                  <a href="/syarat-ketentuan" class="footer-link">{{
                    getText('footer.syaratKetentuan')
                  }}</a>
                </li>
                <li>
                  <a href="/kebijakan-privasi" class="footer-link">{{
                    getText('footer.kebijakanPrivasi')
                  }}</a>
                </li>
                <li>
                  <a href="/kebijakan-refund" class="footer-link">{{
                    getText('footer.kebijakanRefund')
                  }}</a>
                </li>
                <li>
                  <a href="/certificate/verify" class="footer-link">{{
                    getText('footer.CekSertifikat')
                  }}</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Metode Pembayaran -->
          <div class="footer-payment q-mt-lg q-pt-lg q-mb-xl">
            <div class="footer-heading q-mb-md">{{ getText('footer.metodePembayaran') }}</div>
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
              {{ getText('footer.copyright') }}
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
const scrollTimeout = ref(null)
const showHeader = ref(true)

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

const subscribeName = ref('')
const subscribeEmail = ref('')

const languages = ref([])

// ============================================
// GOOGLE TRANSLATE INTEGRATION
// ============================================

// Available languages configuration
const availableLanguages = [
  { code: 'id', name: 'Indonesia', localName: 'Bahasa Indonesia', label: 'ID', flag: '🇮🇩' },
  { code: 'en', name: 'English', localName: 'English', label: 'EN', flag: '🇬🇧' },
  { code: 'zh-CN', name: '中文', localName: 'Mandarin', label: '中文', flag: '🇨🇳' },
]

const currentLanguage = ref('id')
const showLangMenu = ref(false)
let langCloseTimer = null

// Default texts in Indonesian (fallback)
const defaultTexts = {
  'nav.home': 'Beranda',
  'nav.learningPath': 'Alur Belajar',
  'nav.langganan': 'Berlangganan',
  'nav.program': 'Program',
  'nav.videoCourses': 'Video Kursus',
  'nav.allCourses': 'Semua Kursus',
  'nav.allCoursesSub': 'Akses semua materi pembelajaran',
  'nav.studyAbroad': 'Studi ke Luar Negeri',
  'nav.studyAbroadSub': 'Program beasiswa dan kuliah internasional',
  'nav.tipsInfo': 'Tips & Info',
  'nav.tagline': 'Unlock the World with Education',
  'nav.programTrusted': 'TERPERCAYA 10.000+ SISWA',
  'nav.programTitle': 'Tingkatkan Skill',
  'nav.programDesc': 'Belajar bahasa',
  'nav.programCta': 'Lihat Semua Program',
  'nav.learningCenter': 'Learning Center',
  'nav.dashboard': 'Dashboard',
  'auth.halo': 'Halo, {name}',
  'auth.logout': 'Keluar',
  'footer.ptName': 'PT Active Edulang Global',
  'footer.alamatValue': 'Jl. ZA. Pagar Alam No.26, Labuhan Ratu, Kec. Kedaton, Kota Bandar Lampung',
  'footer.subscribeTitle': 'Subscribe Email',
  'footer.subscribeDesc': 'Dapatkan update terbaru tentang program dan promo',
  'footer.subscribeBtn': 'Berlangganan',
  'footer.program': 'Program Bahasa',
  'footer.panduanInsight': 'Panduan & Insight',
  'footer.alurBelajar': 'Alur Belajar',
  'footer.faq': 'FAQ',
  'footer.artikelTips': 'Artikel & Tips',
  'footer.insightKarir': 'Insight Karir',
  'footer.About': 'About Us',
  'footer.updateProgram': 'Update Program',
  'footer.legalTrust': 'Legal & Kepercayaan',
  'footer.syaratKetentuan': 'Syarat & Ketentuan',
  'footer.kebijakanPrivasi': 'Kebijakan Privasi',
  'footer.kebijakanRefund': 'Kebijakan Refund',
  'footer.CekSertifikat': 'Cek Sertifikat',
  'footer.metodePembayaran': 'Metode Pembayaran',
  'footer.copyright': '© 2026 Edulang. All rights reserved.',
}

// Computed property for current language label
const currentLanguageLabel = computed(() => {
  const lang = availableLanguages.find((l) => l.code === currentLanguage.value)
  return lang ? lang.label : 'ID'
})

// Function to get text (fallback to default if Google Translate hasn't loaded)
const getText = (key, params = {}) => {
  let text = defaultTexts[key] || key

  // Replace params
  Object.keys(params).forEach((param) => {
    text = text.replace(`{${param}}`, params[param])
  })

  return text
}

// Initialize Google Translate
const initGoogleTranslate = () => {
  // Check if already loaded
  if (window.google && window.google.translate) {
    return
  }

  // Add Google Translate script
  const script = document.createElement('script')
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  script.async = true
  document.head.appendChild(script)

  // Define global callback
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'id',
        includedLanguages: 'id,en,zh-CN',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      'google_translate_element',
    )

    // Restore saved language after Google Translate loads
    setTimeout(() => {
      restoreLanguage()
    }, 1000)
  }
}

// Change language function
const changeLanguage = (langCode) => {
  currentLanguage.value = langCode
  localStorage.setItem('edulang_language', langCode)

  // Use Google Translate to change language
  const selectElement = document.querySelector('.goog-te-combo')
  if (selectElement) {
    selectElement.value = langCode
    selectElement.dispatchEvent(new Event('change'))
  } else {
    // Fallback: reload with cookie approach
    setGoogleTranslateCookie(langCode)
  }

  showLangMenu.value = false

  // Force refresh to apply translation
  if (langCode === 'id') {
    // Reset to original (Indonesian)
    const iframe = document.querySelector('.goog-te-banner-frame')
    if (iframe) {
      const resetBtn = iframe.contentDocument?.querySelector('.goog-te-button button')
      if (resetBtn) resetBtn.click()
    }
  }
}

// Set Google Translate cookie
const setGoogleTranslateCookie = (lang) => {
  const domain = window.location.hostname
  document.cookie = `googtrans=/id/${lang}; domain=${domain}; path=/`
  document.cookie = `googtrans=/id/${lang}; path=/`

  // Reload page to apply
  window.location.reload()
}

// Restore language from localStorage
const restoreLanguage = () => {
  const savedLang = localStorage.getItem('edulang_language') || 'id'
  if (savedLang !== 'id') {
    changeLanguage(savedLang)
  }
}

// FIXED: Language menu hover handlers dengan delay lebih lama
const onLangMouseEnter = () => {
  if (langCloseTimer) {
    clearTimeout(langCloseTimer)
    langCloseTimer = null
  }
  showLangMenu.value = true
}

const onLangMouseLeave = () => {
  langCloseTimer = setTimeout(() => {
    showLangMenu.value = false
  }, 500) // Increased to 500ms for better UX
}

// Function to hide all Google Translate elements
const hideGoogleTranslateElements = () => {
  // Hide banner frame
  const bannerFrame = document.querySelector('.goog-te-banner-frame')
  if (bannerFrame) {
    bannerFrame.style.cssText =
      'display: none !important; height: 0 !important; overflow: hidden !important;'
  }

  // Hide banner
  const banner = document.querySelector('.goog-te-banner')
  if (banner) {
    banner.style.cssText =
      'display: none !important; height: 0 !important; overflow: hidden !important;'
  }

  // Hide the main GT wrapper
  const gtWrapper = document.querySelector('#goog-gt-tt')
  if (gtWrapper) {
    gtWrapper.style.cssText =
      'display: none !important; height: 0 !important; overflow: hidden !important;'
  }

  // Hide tooltips
  const tooltips = document.querySelectorAll('.goog-tooltip, .goog-tooltip:hover')
  tooltips.forEach((tooltip) => {
    tooltip.style.cssText = 'display: none !important;'
  })

  // Hide text highlights
  const highlights = document.querySelectorAll('.goog-text-highlight')
  highlights.forEach((hl) => {
    hl.style.cssText = 'display: none !important;'
  })

  // Hide the translation popup
  const popups = document.querySelectorAll(
    '.VIpgJd-ZVi9od-ORHb-OEVmcd, .VIpgJd-ZVi9od-xl07Ob-lTBxed',
  )
  popups.forEach((popup) => {
    popup.style.cssText = 'display: none !important;'
  })

  // Remove body padding-top that Google Translate adds
  document.body.style.cssText = 'position: relative !important; top: 0 !important;'

  // Hide any remaining Google Translate containers
  const skiptranslate = document.querySelector('.skiptranslate')
  if (skiptranslate) {
    skiptranslate.style.cssText = 'display: none !important;'
  }
}

// Watch for Google Translate changes and hide elements
const observeGoogleTranslate = () => {
  const observer = new MutationObserver(() => {
    hideGoogleTranslateElements()
  })

  // Observe body for added nodes
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
}

// ============================================
// FOOTER LANGUAGES WITH FALLBACK ICONS
// ============================================

// Fallback flag emoji mapping untuk bahasa yang tidak punya iconUrl
const languageFlagMap = {
  'Bahasa Arab': '🇸🇦',
  'Bahasa Inggris': '🇺🇸',
  'Bahasa Jepang': '🇯🇵',
  'Bahasa Jerman': '🇩🇪',
  'Bahasa Korea': '🇰🇷',
  'Bahasa Mandarin': '🇨🇳',
  'Bahasa Mandarin(Taiwan)': '🇹🇼',
  'Bahasa Mandarin Taiwan': '🇹🇼',
  'Bahasa inggris (British)': '🇬🇧',
  'Bahasa Inggris (British)': '🇬🇧',
  'Bahasa Inggris British': '🇬🇧',
}

const footerLanguagesWithIcons = computed(() => {
  return languages.value.map((lang) => {
    const name = lang.name || lang.label || 'Bahasa'
    // Cari flag emoji berdasarkan nama bahasa
    const flag = languageFlagMap[name] || ''
    return {
      id: String(lang._id || lang.id),
      name: name,
      iconUrl: lang.iconUrl || lang.icon_url || '',
      flag: flag,
    }
  })
})

// ============================================

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
  }, 300)
}

const handleScroll = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop

  if (scrollY <= 10) {
    showHeader.value = true
    if (scrollTimeout.value) {
      window.clearTimeout(scrollTimeout.value)
    }
    return
  }

  showHeader.value = true

  if (scrollTimeout.value) {
    window.clearTimeout(scrollTimeout.value)
  }

  scrollTimeout.value = window.setTimeout(() => {
    showHeader.value = false
  }, 1500)
}

onMounted(() => {
  checkLoginStatus()
  fetchLanguages()
  applyStoredTheme()

  // Initialize Google Translate
  initGoogleTranslate()

  // Load saved language preference
  const savedLang = localStorage.getItem('edulang_language')
  if (savedLang) {
    currentLanguage.value = savedLang
  }

  // Start observing and hiding Google Translate elements
  hideGoogleTranslateElements()
  observeGoogleTranslate()

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('load', hideGoogleTranslateElements)
    showHeader.value = true
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('load', hideGoogleTranslateElements)
  }
  if (scrollTimeout.value) {
    window.clearTimeout(scrollTimeout.value)
  }
  if (langCloseTimer) {
    clearTimeout(langCloseTimer)
  }
})

watch(
  () => route.path,
  () => {
    checkLoginStatus()
    showHeader.value = true
    if (scrollTimeout.value) {
      window.clearTimeout(scrollTimeout.value)
    }
    // Hide Google Translate elements on route change
    setTimeout(hideGoogleTranslateElements, 100)
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

<!-- GLOBAL STYLE untuk menyembunyikan Google Translate Banner -->
<style>
/* ============================================
   HIDE GOOGLE TRANSLATE BANNER - GLOBAL STYLES
   ============================================ */

/* Hide Google Translate banner frame */
.goog-te-banner-frame,
.goog-te-banner {
  display: none !important;
  height: 0 !important;
  width: 0 !important;
  max-height: 0 !important;
  max-width: 0 !important;
  overflow: hidden !important;
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
  position: absolute !important;
  top: -9999px !important;
  left: -9999px !important;
}

/* Hide the Google Translate tooltip */
.goog-tooltip,
.goog-tooltip:hover,
.VIpgJd-ZVi9od-ORHb-OEVmcd,
.VIpgJd-ZVi9od-xl07Ob-lTBxed,
.VIpgJd-ZVi9od-SmfZ-OEVmcd,
.VIpgJd-yAWNEb-L7lbkb,
.VIpgJd-yAWNEb-L7lbkb-IPJ7ec,
.VIpgJd-yAWNEb-hvhgNd,
.VIpgJd-yAWNEb-hvhgNd-B7I4Od {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Hide the translation helper element */
#goog-gt-tt,
.goog-te-ftab,
.goog-te-ftab-link,
.goog-te-menu,
.goog-te-menu2,
.goog-te-menu-frame,
.goog-te-menu2-item-selected,
.goog-te-menu2-item,
.goog-te-menu2-item-link {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  width: 0 !important;
}

/* Hide text highlights */
.goog-text-highlight {
  display: none !important;
  background: none !important;
  box-shadow: none !important;
}

/* Hide the main translate widget wrapper */
.goog-te-gadget,
.goog-te-gadget-simple,
.goog-te-combo {
  display: none !important;
}

/* Hide the skip translate element */
.skiptranslate,
.goog-te-spinner-pos,
.goog-te-spinner,
.goog-te-handles,
.goog-te-float-mask,
.goog-te-gadget-icon,
.goog-te-gadget-logo {
  display: none !important;
  visibility: hidden !important;
}

/* Remove body padding that Google Translate adds */
body {
  top: 0 !important;
  position: relative !important;
  padding-top: 0 !important;
}

/* Hide any iframe from Google Translate */
iframe[src*='translate.google.com'],
iframe[src*='google.com/translate'],
iframe.goog-te-banner-frame,
iframe.goog-te-menu-frame,
iframe#goog-gt-tt,
iframe.VIpgJd-ZVi9od-xl07Ob-OEVmcd {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  width: 0 !important;
  position: absolute !important;
  top: -9999px !important;
  left: -9999px !important;
  border: none !important;
}

/* Hide translation suggestion popup */
.translation-ltr,
.translation-rtl {
  display: none !important;
}

/* Hide Google Translate footer/suggestion bar */
.VIpgJd-ZVi9od-ORHb-OEVmcd,
.VIpgJd-ZVi9od-ORHb-OEVmcd:empty {
  display: none !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  overflow: hidden !important;
}

/* Force hide any remaining Google Translate elements */
div[class*='goog-te'],
span[class*='goog-te'],
a[class*='goog-te'] {
  display: none !important;
}

/* Hide the language selection dropdown that Google creates */
.goog-te-options {
  display: none !important;
  visibility: hidden !important;
}

/* Section header override to prevent padding issues */
.section-header {
  margin-top: 0 !important;
}
</style>

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
  margin-bottom: 0.75rem;
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
  width: 28px; /* Diperbesar dari 22px */
  height: 20px; /* Diperbesar dari 16px (rasio bendera standar) */
  min-width: 28px; /* Mencegah menyusut */
  border-radius: 3px;
  object-fit: contain; /* Diubah dari 'cover' ke 'contain' agar tidak terpotong */
  background-color: #f0f0f0; /* Warna background agar area transparan terlihat */
}

/* FOOTER LANGUAGE EMOJI FLAG */
.footer-lang-emoji {
  font-size: 18px; /* Diperbesar sedikit */
  line-height: 1;
  width: 28px; /* Disamakan dengan lebar gambar */
  text-align: center;
  display: inline-block;
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
  position: sticky !important;
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
  gap: 24px;
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
  padding: 8px 14px;
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
  margin-top: 8px;
  z-index: 2000;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transform: translateZ(0);
  will-change: opacity, transform;
}

/* ============================================
   PERBAIKAN: DROPDOWN PROGRAM - DIKECILKAN
   ============================================ */
.program-dropdown-bwa {
  background: var(--edulang-white, #f5f7fa);
  min-width: 520px; /* Dari 720px jadi 520px */
  max-width: 85vw;
}

.program-dropdown-bwa-inner {
  min-height: 220px; /* Dari 300px jadi 220px */
}

.program-bwa-left {
  width: 220px; /* Dari 320px jadi 220px */
  min-width: 220px;
  background: var(--edulang-navy, #003387);
  padding: 20px 18px; /* Dari 32px 28px jadi 20px 18px */
  display: flex;
  align-items: center;
}

.program-bwa-left-content {
  text-align: center;
  width: 100%;
}

.program-bwa-tag {
  font-size: 0.7rem; /* Dari 0.8125rem jadi 0.7rem */
  color: var(--edulang-yellow, #ffc42c);
  font-weight: 600;
  margin-bottom: 8px; /* Dari 12px jadi 8px */
}

.program-bwa-title {
  font-size: 1.1rem; /* Dari 1.4rem jadi 1.1rem */
  font-weight: 700;
  color: var(--edulang-white, #f5f7fa);
  line-height: 1.3;
  margin-bottom: 8px; /* Dari 12px jadi 8px */
}

.program-bwa-desc {
  font-size: 0.8rem; /* Dari 0.9rem jadi 0.8rem */
  color: rgba(245, 247, 250, 0.95);
  margin: 0 0 16px 0; /* Dari 24px jadi 16px */
  line-height: 1.5;
}

.program-bwa-btn {
  background: var(--edulang-blue, #0089ff) !important;
  color: var(--edulang-white, #f5f7fa) !important;
  font-weight: 600;
  padding: 8px 20px; /* Dari 12px 28px jadi 8px 20px */
  border-radius: 8px;
  font-size: 0.85rem;
}

.program-bwa-right {
  flex: 1;
  min-width: 260px; /* Dari 380px jadi 260px */
  padding: 16px 18px; /* Dari 24px 28px jadi 16px 18px */
  background: var(--edulang-white, #f5f7fa);
  max-height: 280px; /* Dari 400px jadi 280px */
  overflow-y: auto;
}

.program-bwa-card {
  display: flex;
  align-items: flex-start;
  gap: 12px; /* Dari 16px jadi 12px */
  padding: 12px 14px; /* Dari 18px jadi 12px 14px */
  border-radius: 10px; /* Dari 12px jadi 10px */
  transition: background 0.2s;
  margin-bottom: 6px; /* Dari 8px jadi 6px */
}

.program-bwa-card:last-child {
  margin-bottom: 0;
}

.program-bwa-card:hover {
  background: rgba(0, 137, 255, 0.08);
}

.program-bwa-card-icon {
  width: 40px; /* Dari 52px jadi 40px */
  height: 40px; /* Dari 52px jadi 40px */
  min-width: 40px;
  border-radius: 10px; /* Dari 12px jadi 10px */
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
  font-size: 0.95rem; /* Dari 1.05rem jadi 0.95rem */
  font-weight: 600;
  color: var(--edulang-black, #2d2d2d);
  margin-bottom: 2px; /* Dari 4px jadi 2px */
}

.program-bwa-card-sub {
  font-size: 0.78rem; /* Dari 0.85rem jadi 0.78rem */
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.7;
  margin-top: 2px; /* Dari 4px jadi 2px */
  line-height: 1.3;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
}

/* ============================================
   LANGUAGE SELECTOR STYLES - FIXED
   ============================================ */
.language-selector-wrapper {
  position: relative;
  z-index: 1001;
}

.lang-selector-btn {
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--edulang-black, #2d2d2d);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.lang-selector-btn:hover {
  background: rgba(0, 137, 255, 0.08);
  color: var(--edulang-blue, #0089ff);
}

.lang-selector-btn.lang-active {
  background: rgba(0, 137, 255, 0.12);
  color: var(--edulang-blue, #0089ff);
}

.bg-dark .lang-selector-btn {
  color: var(--edulang-white, #f5f7fa);
}

.bg-dark .lang-selector-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--edulang-yellow, #ffc42c);
}

.bg-dark .lang-selector-btn.lang-active {
  background: rgba(255, 255, 255, 0.15);
  color: var(--edulang-yellow, #ffc42c);
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  z-index: 2001;
  background: var(--edulang-white, #f5f7fa);
  border: 1px solid rgba(0, 0, 0, 0.08);
  min-width: 200px;
  border-radius: 12px;
  overflow: hidden;
  padding: 4px;
}

.bg-dark .lang-dropdown {
  background: var(--edulang-dark, #1a1a1a);
  border-color: rgba(255, 255, 255, 0.12);
}

.lang-dropdown .q-item {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 2px 4px;
  transition: all 0.2s ease;
}

.lang-dropdown .q-item:hover:not(.bg-primary) {
  background: rgba(0, 137, 255, 0.08);
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
    font-size: 1rem;
  }

  .header-tagline {
    font-size: 0.55rem;
    max-width: 120px;
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
    gap: 16px;
  }

  .nav-btn {
    font-size: 14px;
    padding: 6px 10px;
  }

  .lang-selector-btn {
    padding: 4px 8px;
    font-size: 13px;
  }

  /* PERBAIKAN: Dropdown lebih kecil di tablet */
  .program-dropdown-bwa {
    min-width: 450px;
    max-width: 90vw;
  }

  .program-bwa-left {
    width: 180px;
    min-width: 180px;
    padding: 16px 14px;
  }

  .program-bwa-right {
    min-width: 240px;
    padding: 14px 16px;
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
    display: flex !important;
  }

  .edulang-header-text {
    font-size: 1.2rem;
    width: auto;
  }

  .header-tagline {
    font-size: 0.6rem;
    margin-top: 2px;
  }
}

@media (min-width: 1024px) and (max-width: 1365px) {
  .container {
    max-width: 100%;
    padding: 0 32px;
  }

  .nav-links-wrap {
    gap: 20px;
  }

  .program-dropdown-bwa {
    min-width: 480px;
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
    font-size: 1.2rem !important;
  }
}
</style>
