<template>
  <!-- SATU SECTION RESPONSIVE - KARAKTER EKSTRA BESAR - MARGIN ATAS BALANCED -->
  <section class="hero-section">
    <div class="container hero-inner">
      <div class="row hero-main-row items-center q-col-gutter-md">
        <!-- Left: Content - col-xs-12 col-md-6 -->
        <div class="col-xs-12 col-md-6 hero-left-col">
          <h1 class="hero-title text-weight-bold q-mb-md">
            <span class="text-edulang-blue">Unlock the World</span><br />
            <span class="text-edulang-black">with Education</span>
          </h1>
          <p class="hero-desc q-mb-lg">
            Belajar bahasa asing dengan mudah, cepat, dan terjangkau bersama mentor profesional
            melalui video pembelajaran interaktif.
          </p>
          <div class="hero-cta q-gutter-md">
            <q-btn
              unelevated
              no-caps
              class="btn-primary q-px-xl q-py-md"
              label="Mulai Belajar Gratis"
              icon-right="arrow_forward"
              :to="{ name: 'BerlanggananPage' }"
            />
            <q-btn
              outline
              no-caps
              class="btn-outline q-px-xl q-py-md"
              label="Lihat Demo"
              icon="play_arrow"
              :to="{ name: 'AlurBelajarPage' }"
            />
          </div>
          <div class="hero-stats row items-center no-wrap q-mt-xl q-gutter-xl">
            <div class="stat-item row items-center q-gutter-sm">
              <div class="stat-icon-wrap">
                <q-icon name="group" size="24px" color="primary" />
              </div>
              <div>
                <div class="stat-value text-weight-bold">10,000+</div>
                <div class="stat-label text-grey-7">Siswa Aktif</div>
              </div>
            </div>
            <div class="stat-item row items-center q-gutter-sm">
              <div class="stat-icon-wrap">
                <q-icon name="menu_book" size="24px" color="primary" />
              </div>
              <div>
                <div class="stat-value text-weight-bold">8</div>
                <div class="stat-label text-grey-7">Bahasa Tersedia</div>
              </div>
            </div>
            <div class="stat-item row items-center q-gutter-sm">
              <div class="stat-icon-wrap">
                <q-icon name="star_outline" size="24px" color="primary" />
              </div>
              <div>
                <div class="stat-value text-weight-bold">4.9</div>
                <div class="stat-label text-grey-7">Rating Pengguna</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: KARAKTER EKSTRA BESAR -->
        <div class="col-xs-12 col-md-6 hero-right-col">
          <div class="hero-right-inner">
            <div class="hero-character-area">
              <!-- Floating bubbles -->
              <div
                v-for="(lang, i) in floatingLanguages"
                :key="lang.id"
                class="hero-float-bubble hero-float-bubble-animated"
                :class="`hero-float-bubble-${i}`"
              >
                <q-img v-if="lang.iconUrl" :src="lang.iconUrl" ratio="1" class="hero-float-icon" />
                <span v-else class="hero-float-fallback">{{ lang.code }}</span>
                <span class="hero-float-text">{{ lang.nativeText || lang.name }}</span>
              </div>
              <!-- KARAKTER EKSTRA BESAR -->
              <div class="hero-character-wrap">
                <q-img
                  src="~assets/landing/character-cta.png"
                  class="hero-character"
                  fit="contain"
                  no-spinner
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom language pills -->
      <div class="hero-bottom-section">
        <div class="hero-divider" />
        <p class="hero-available-text">Tersedia dalam berbagai bahasa populer</p>
        <div class="hero-lang-pills row q-gutter-sm justify-center">
          <div
            v-for="lang in displayLanguages"
            :key="lang.id"
            class="hero-lang-pill row items-center no-wrap"
            @click="goToBerlangganan(lang)"
          >
            <q-img v-if="lang.iconUrl" :src="lang.iconUrl" ratio="1" class="hero-lang-pill-icon" />
            <span v-else class="hero-lang-pill-code">{{ lang.code }}</span>
            <span class="hero-lang-pill-name">{{ lang.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const languages = ref([])

const nameToCode = {
  arab: 'SA',
  jerman: 'DE',
  german: 'BA',
  inggris: 'US',
  english: 'US',
  jepang: 'JP',
  japanese: 'JP',
  korea: 'KR',
  korean: 'KR',
  mandarin: 'CN',
  chinese: 'CN',
  'bahasa arab': 'SA',
  'bahasa jerman': 'DE',
  'bahasa inggris': 'US',
  'bahasa jepang': 'JP',
  'bahasa korea': 'KR',
}

const nameToNative = {
  arab: 'العربية',
  jerman: 'Deutsch',
  german: 'Deutsch',
  inggris: 'English',
  english: 'English',
  jepang: '日本語',
  japanese: '日本語',
  korea: '한국어',
  korean: '한국어',
  mandarin: '中文',
  chinese: '中文',
}

function getCode(name) {
  if (!name) return 'XX'
  const lower = name.toLowerCase()
  for (const [key, code] of Object.entries(nameToCode)) {
    if (lower.includes(key)) return code
  }
  return name.slice(0, 2).toUpperCase() || 'XX'
}

function getNativeText(name) {
  if (!name) return ''
  const lower = name.toLowerCase()
  for (const [key, native] of Object.entries(nameToNative)) {
    if (lower.includes(key)) return native
  }
  return name
}

const floatingLanguages = computed(() =>
  languages.value.slice(0, 4).map((l) => ({
    id: l._id || l.id,
    name: l.name || l.label,
    code: l.code || getCode(l.name || l.label),
    nativeText: l.nativeName || getNativeText(l.name || l.label),
    iconUrl: l.iconUrl || l.icon_url || '',
  })),
)

const displayLanguages = computed(() =>
  languages.value.map((l) => ({
    id: l._id || l.id,
    name: l.name || l.label || 'Bahasa',
    code: l.code || getCode(l.name || l.label),
    iconUrl: l.iconUrl || l.icon_url || '',
  })),
)

function goToBerlangganan(lang) {
  router.push({
    path: '/berlangganan',
    query: { languageId: lang.id, languageName: lang.name },
  })
}

onMounted(async () => {
  try {
    const res = await api.get('/language-types')
    const data = res.data || {}
    const list = Array.isArray(data.languagetypes) ? data.languagetypes : data.data || []
    languages.value = list.map((l) => ({
      ...l,
      iconUrl: l.iconUrl || l.icon_url || '',
    }))
  } catch {
    languages.value = [
      { _id: 1, name: 'Bahasa Arab', iconUrl: '', code: 'SA' },
      { _id: 2, name: 'Bahasa Jerman', iconUrl: '', code: 'DE' },
      { _id: 3, name: 'Bahasa Inggris', iconUrl: '', code: 'US' },
      { _id: 4, name: 'Bahasa Jepang', iconUrl: '', code: 'JP' },
      { _id: 5, name: 'Bahasa Korea', iconUrl: '', code: 'KR' },
      { _id: 6, name: 'Mandarin', iconUrl: '', code: 'CN' },
    ]
  }
})
</script>

<style scoped>
/* ↑↑↑ KARAKTER EKSTRA BESAR + MARGIN ATAS BALANCED ↑↑↑ */
.hero-section {
  padding-top: 1.5rem; /* ↑ DARI 1rem - balanced */
  padding-bottom: 3rem;
  min-height: 88vh;
  display: flex;
  align-items: center;
  background: var(--edulang-white, #f5f7fa);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.hero-main-row {
  min-height: 75vh; /* ↑ DARI 70vh */
}

.hero-left-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-title {
  color: var(--edulang-black, #2d2d2d);
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.2;
}

.text-edulang-blue {
  color: var(--edulang-blue, #0089ff) !important;
}

.text-edulang-black {
  color: var(--edulang-black, #2d2d2d) !important;
}

.hero-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.9;
  max-width: 500px;
  line-height: 1.7;
}

.btn-primary {
  background: var(--edulang-blue, #0089ff) !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
}

.btn-outline {
  border: 2px solid var(--edulang-blue, #0089ff) !important;
  color: var(--edulang-blue, #0089ff) !important;
  border-radius: 8px;
  font-weight: 600;
  background: white !important;
}

.hero-stats .stat-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 137, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-stats .stat-value {
  font-size: 1.25rem;
  color: var(--edulang-black, #2d2d2d);
}

.hero-stats .stat-label {
  font-size: 0.8125rem;
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.8;
}

.hero-right-col {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 65vh; /* ↑ DARI 55vh */
}

.hero-right-inner {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 75vh; /* ↑ DARI 65vh - EKSTRA BESAR */
  min-height: 550px; /* ↑ DARI 450px */
}

.hero-character-area {
  position: relative;
  width: 100%;
  max-width: 600px; /* ↑ DARI 500px - EKSTRA BESAR */
  height: 100%;
  margin-left: auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-shadow: none;
}

.hero-character-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* ↑↑↑ KARAKTER EKSTRA BESAR ↑↑↑ */
.hero-character {
  width: 100%;
  height: auto;
  max-height: 95vh;
  min-height: 600px; /* ↑ DARI 500px - SUPER BESAR */
  object-fit: contain;
  object-position: bottom center;
}

@keyframes hero-bubble-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.hero-float-bubble-animated {
  animation: hero-bubble-float 2.5s ease-in-out infinite;
}

.hero-float-bubble-animated.hero-float-bubble-1 {
  animation-delay: 0.3s;
}
.hero-float-bubble-animated.hero-float-bubble-2 {
  animation-delay: 0.6s;
}
.hero-float-bubble-animated.hero-float-bubble-3 {
  animation-delay: 0.9s;
}

.hero-float-bubble {
  position: absolute;
  z-index: 2;
  min-width: 80px;
  height: 44px;
  padding: 0 12px;
  border-radius: 22px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
}

.hero-float-icon {
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hero-float-fallback {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--edulang-black, #2d2d2d);
}

.hero-float-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--edulang-black, #2d2d2d);
  white-space: nowrap;
}

.hero-float-bubble-0 {
  top: 28%;
  right: 2%;
}
.hero-float-bubble-1 {
  top: 42%;
  right: 0;
}
.hero-float-bubble-2 {
  top: 42%;
  left: 0;
}
.hero-float-bubble-3 {
  top: 28%;
  left: 2%;
}

.hero-bottom-section {
  margin-top: 4rem; /* ↑ DARI 3.5rem - balanced */
  padding-top: 0;
  text-align: center;
}

.hero-divider {
  height: 1px;
  background: #e2e8f0;
  margin-bottom: 1.5rem;
}

.hero-available-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.9;
  margin: 0 0 1.25rem 0;
}

.hero-lang-pills {
  flex-wrap: wrap;
  gap: 10px;
}

.hero-lang-pill {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 10px 18px;
  gap: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--edulang-black, #2d2d2d);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-lang-pill-icon {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
}

.hero-lang-pill-code {
  font-weight: 600;
}

.hero-lang-pill-name {
  white-space: nowrap;
}

.hero-lang-pill:hover {
  border-color: var(--edulang-blue, #0089ff);
  color: var(--edulang-blue, #0089ff);
}

/* Desktop responsive - KARAKTER SUPER BESAR */
@media (min-width: 1024px) {
  .hero-main-row {
    min-height: 82vh;
  } /* ↑ BESAR */
  .hero-right-col {
    align-items: center;
    justify-content: flex-end;
    min-height: 82vh;
  }
  .hero-right-inner {
    width: 100%;
    height: 82vh;
    min-height: 650px;
    justify-content: flex-end;
  }
  .hero-character-area {
    width: clamp(550px, 50vw, 750px); /* ↑ EKSTRA BESAR */
    margin-left: auto;
    margin-right: 0;
  }
  .hero-character {
    min-height: 700px; /* ↑ SUPER BESAR */
  }
}

@media (min-width: 1366px) {
  .hero-character-area {
    width: clamp(600px, 50vw, 800px);
  }
}

@media (min-width: 1440px) {
  .hero-character-area {
    width: clamp(650px, 48vw, 850px);
  }
}

@media (min-width: 1920px) {
  .container {
    max-width: 1600px;
  }
  .hero-character-area {
    width: clamp(750px, 45vw, 950px);
  } /* ↑ GIGANTIC */
}
</style>
