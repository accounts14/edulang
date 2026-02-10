<!-- Hero - Unlock the World with Education (sesuai gambar + Brand Guideline) -->
<template>
  <section class="hero-section">
    <div class="container hero-inner">
      <div class="row items-center q-col-gutter-xl">
        <!-- Left: Content -->
        <div class="col-12 col-lg-6">
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
          <div class="hero-stats row q-mt-xl q-gutter-xl">
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

        <!-- Right: Character + floating bubbles (isi dari gambar kedua) -->
        <div
          class="col-12 col-lg-6 flex flex-center q-mt-lg q-mt-none hero-right-col hero-right-align-top"
        >
          <div class="hero-right-inner">
            <div class="hero-character-area">
              <!-- Floating oval bubbles: iconUrl + teks (animasi) -->
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
              <!-- Character (lebih besar) -->
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

      <!-- Bottom: Tersedia dalam berbagai bahasa populer + language pills -->
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

// Mapping nama bahasa ke kode negara (SA, BA/DE, US, JP, KR, CN)
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

// Teks native untuk floating bubbles (JP 日本語, DE Deutsch, dll)
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

// Floating bubbles: iconUrl + teks native (gambar 2: JP 日本語, DE Deutsch)
const floatingLanguages = computed(() =>
  languages.value.slice(0, 4).map((l) => ({
    id: l._id || l.id,
    name: l.name || l.label,
    code: l.code || getCode(l.name || l.label),
    nativeText: l.nativeName || getNativeText(l.name || l.label),
    iconUrl: l.iconUrl || l.icon_url || '',
  })),
)

// Bottom pills: iconUrl + teks (gambar 3: SA Bahasa Arab, dll)
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
    // Fallback jika API gagal
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
.hero-section {
  padding-top: 2.5rem;
  padding-bottom: 3.5rem;
  min-height: 88vh;
  display: flex;
  align-items: center;
  background: var(--edulang-white, #f5f7fa);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
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
  max-width: 500px; /* Atur angka ini sesuai kebutuhan */
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
}

.hero-right-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 300px;
}

.hero-character-area {
  position: relative;
  width: 100%;
  max-width: 500px;
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}

.hero-character-wrap {
  position: relative;
  z-index: 1;
  width: 360px;
  max-width: 100%;
}

.hero-character {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
}

/* Animasi floating bubbles (bukan karakter) */
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

/* Floating oval bubbles: iconUrl + teks (gambar 2: JP 日本語, DE Deutsch) */
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
  top: 6%;
  right: 4%;
}
.hero-float-bubble-1 {
  bottom: 22%;
  right: 0;
}
.hero-float-bubble-2 {
  bottom: 28%;
  left: 0;
}
.hero-float-bubble-3 {
  top: 12%;
  left: 2%;
}

/* Bottom section: Tersedia dalam berbagai bahasa populer */
.hero-bottom-section {
  margin-top: 2.5rem;
  padding-top: 0;
  text-align: center;
}

.hero-divider {
  height: 1px;
  background: #e2e8f0;
  margin-bottom: 1.5rem;
}

/* Teks dibesarkan dan agak dibawahin sedikit */
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

@media (min-width: 1024px) {
  .hero-right-col {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }
  .hero-character-area {
    max-width: 560px;
    min-height: 520px;
    box-shadow: none;
  }
  .hero-character-wrap {
    width: 420px;
  }
  .hero-character {
    max-height: 580px;
  }
}
</style>
