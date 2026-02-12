<template>
  <q-page
    class="roadmap-page bg-edulang-white q-pa-md q-pa-md-xl overflow-hidden relative-position"
  >
    <div class="bg-circle bg-circle-1"></div>

    <div class="content-wrapper">
      <div class="row items-center q-mb-xl animate-fade-in">
        <q-btn
          flat
          round
          color="edulang-navy"
          icon="arrow_back"
          class="bg-white shadow-soft q-mr-lg hover-scale"
          @click="$router.back()"
        />
        <div>
          <q-badge
            color="edulang-blue-10"
            text-color="edulang-blue"
            class="q-px-md q-py-xs q-mb-xs text-weight-bold rounded-8"
          >
            #{{ $t('alurBelajar.pathwayTag', 'UnlockTheWorld') }}
          </q-badge>
          <h1 class="text-h3 text-weight-bolder text-edulang-navy q-my-none">
            Alur Belajar Pendidikan
          </h1>
        </div>
      </div>

      <q-card flat class="filter-glass-card q-pa-xl q-mb-xl shadow-lg">
        <div class="row q-col-gutter-xl items-center">
          <div class="col-12 col-md-4">
            <div class="text-overline text-weight-bold text-edulang-blue q-mb-sm">PILIH BAHASA</div>
            <q-select
              v-model="selectedLanguageId"
              :options="languageOptions"
              outlined
              bg-color="white"
              color="edulang-blue"
              class="custom-select"
              label="Cari Bahasa..."
              :loading="loading"
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="language" color="edulang-blue" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-overline text-weight-bold text-edulang-blue q-mb-sm">
              TINGKAT KEMAMPUAN
            </div>
            <q-select
              v-model="selectedLevel"
              :options="levelOptions"
              outlined
              bg-color="white"
              color="edulang-blue"
              class="custom-select"
              label="Pilih Level..."
              :disable="!selectedLanguageId || levelOptions.length === 0"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="trending_up" color="edulang-blue" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-4">
            <div class="info-box-light q-pa-md rounded-16 border-blue-soft">
              <q-icon name="info" color="edulang-blue" size="sm" class="q-mb-xs" />
              <p class="text-caption text-grey-8 q-mb-none">
                Sistem kami akan merekomendasikan urutan kelas terbaik berdasarkan pilihan bahasa
                dan level Anda.
              </p>
            </div>
          </div>
        </div>
      </q-card>

      <div class="row q-col-gutter-xl">
        <div class="col-12 col-lg-5">
          <div class="sticky-container">
            <div v-if="loading" class="column q-gutter-md">
              <q-skeleton v-for="n in 3" :key="n" type="rect" height="110px" class="rounded-24" />
            </div>

            <div v-else class="relative-position q-pl-md">
              <div class="roadmap-line"></div>

              <div
                v-for="(item, index) in displayRoadmap"
                :key="item.id || index"
                class="roadmap-step q-mb-lg"
                :class="{ 'step-active': index === currentIndex }"
                @click="currentIndex = index"
              >
                <div class="roadmap-card-interactive shadow-soft row items-center no-wrap">
                  <div class="step-indicator">
                    <div class="step-circle shadow-sm">{{ index + 1 }}</div>
                  </div>

                  <div class="q-ml-lg full-width q-py-md">
                    <div class="text-subtitle1 text-weight-bolder ellipsis-2-lines title-text">
                      {{ item.title }}
                    </div>
                    <div class="row items-center q-gutter-x-sm q-mt-xs">
                      <q-badge rounded class="badge-level" :label="item.levelLabel" />
                      <span class="text-caption price-text">{{ item.priceDisplay }}</span>
                    </div>
                  </div>

                  <q-icon name="chevron_right" class="arrow-icon q-mx-md" size="24px" />
                </div>
              </div>

              <div
                v-if="selectedLanguageId && selectedLevel && displayRoadmap.length === 0"
                class="empty-glass q-pa-xl text-center"
              >
                <q-icon name="explore_off" size="56px" color="grey-4" />
                <div class="text-grey-6 q-mt-md">Roadmap belum tersedia untuk kombinasi ini.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-7">
          <transition name="fade-scale" mode="out-in">
            <q-card
              flat
              class="detail-glass-card shadow-2xl"
              :key="currentIndex"
              v-if="currentItem && !loading"
            >
              <div class="card-accent-gradient"></div>
              <div class="q-pa-xl column full-height">
                <div class="row justify-between items-start q-mb-lg">
                  <q-chip
                    unelevated
                    class="bg-edulang-blue-10 text-edulang-blue text-weight-bold"
                    icon="school"
                  >
                    {{ currentItem.languageLabel }}
                  </q-chip>
                  <div class="text-h2 text-grey-2 text-weight-bolder">0{{ currentIndex + 1 }}</div>
                </div>

                <h2 class="text-h3 text-weight-bolder text-edulang-navy q-mt-none q-mb-lg">
                  {{ currentItem.title }}
                </h2>

                <div class="row q-gutter-md q-mb-xl">
                  <div class="glass-info-pill">
                    <q-icon name="signal_cellular_alt" color="edulang-blue" />
                    <span>{{ currentItem.levelLabel }}</span>
                  </div>
                  <div class="glass-info-pill">
                    <q-icon name="payments" color="edulang-blue" />
                    <span>{{ currentItem.priceDisplay }}</span>
                  </div>
                </div>

                <div class="text-body1 text-grey-8 q-mb-auto description-text">
                  {{
                    currentItem.description ||
                    'Tingkatkan kompetensi Anda dengan modul kurikulum terstandarisasi Edulang.'
                  }}
                </div>

                <div class="row q-gutter-md q-mt-xl">
                  <q-btn
                    unelevated
                    class="btn-primary-gradient q-px-xl q-py-md text-weight-bold rounded-16"
                    no-caps
                    :label="currentItem.cta"
                    @click="goToCurrentCourse"
                  />
                  <q-btn
                    outline
                    color="edulang-navy"
                    class="rounded-16 q-px-xl text-weight-bold"
                    no-caps
                    label="Eksplor Kurikulum"
                    @click="goToCurrentCourse"
                  />
                </div>
              </div>
            </q-card>

            <div v-else-if="!loading" class="empty-detail-state flex flex-center column">
              <div class="icon-blob">
                <q-icon name="auto_awesome" size="100px" color="edulang-blue" />
              </div>
              <div class="text-h5 text-edulang-navy text-weight-bold q-mt-lg">
                Mulai Perjalanan Belajarmu
              </div>
              <p class="text-grey-6">
                Pilih bahasa dan modul di samping untuk melihat detail alur belajar.
              </p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const router = useRouter()
const currentIndex = ref(0)
const loading = ref(true)

const languages = ref([])
const packages = ref([])

const selectedLanguageId = ref(null)
const selectedLevel = ref(null)

const languageOptions = computed(() => {
  const list = languages.value || []
  return list.map((l) => ({
    label: l.name || l.label || 'Bahasa',
    value: String(l._id || l.id),
  }))
})

const levelOptions = computed(() => {
  const set = new Set()
  ;(packages.value || []).forEach((p) => {
    const langId =
      typeof p.languageType === 'object' && p.languageType
        ? String(p.languageType._id || p.languageType.id)
        : String(p.languageType)

    if (selectedLanguageId.value && langId !== String(selectedLanguageId.value)) return

    const level = p.level || p.levelName
    if (level) set.add(level)
  })
  return Array.from(set).sort()
})

const filteredPackages = computed(() => {
  let list = packages.value || []
  if (!list.length) return []

  if (selectedLanguageId.value) {
    const targetId = String(selectedLanguageId.value)
    list = list.filter((p) => {
      const lang = p.languageType
      const langId = typeof lang === 'object' && lang ? String(lang._id || lang.id) : String(lang)
      return langId === targetId
    })
  }

  if (selectedLevel.value) {
    list = list.filter((p) => (p.level || p.levelName) === selectedLevel.value)
  }

  return list
})

const displayRoadmap = computed(() => {
  const list = filteredPackages.value
  if (!list.length) return []

  return list.map((pkg) => {
    const price = Number(pkg.price || 0)
    const priceLabel =
      price === 0
        ? 'Gratis'
        : new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
          }).format(price)

    const level = pkg.level || pkg.levelName || 'Level'

    return {
      id: pkg._id || pkg.id,
      packageId: pkg._id || pkg.id,
      title: pkg.name || pkg.title || 'Nama Kursus',
      description: pkg.description,
      levelLabel: level,
      languageLabel:
        (typeof pkg.languageType === 'object' && pkg.languageType ? pkg.languageType.name : '') ||
        'Bahasa',
      priceDisplay: priceLabel,
      cta: 'Mulai Belajar Sekarang',
    }
  })
})

const currentItem = computed(() => {
  const list = displayRoadmap.value
  if (!list.length) return null
  if (currentIndex.value < 0 || currentIndex.value >= list.length) return list[0]
  return list[currentIndex.value]
})

const fetchData = async () => {
  loading.value = true
  try {
    const [langRes, pkgRes] = await Promise.all([api.get('/language-types'), api.get('/packages')])

    const langData = langRes.data || {}
    languages.value = Array.isArray(langData.languagetypes)
      ? langData.languagetypes
      : langData.data || []

    const pkgData = pkgRes.data || {}
    packages.value = Array.isArray(pkgData.packages)
      ? pkgData.packages
      : Array.isArray(pkgData.data)
        ? pkgData.data
        : []
  } catch (error) {
    console.error('[AlurBelajar] Gagal memuat data', error)
  } finally {
    loading.value = false
  }
}

const goToCurrentCourse = () => {
  const id = currentItem.value?.packageId
  if (!id) return
  router.push(`/courses/${id}`)
}

onMounted(fetchData)
</script>

<style scoped>
/* Branding & Layout */
.bg-edulang-white {
  background-color: #f5f7fa;
}
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-blue-10 {
  background: rgba(0, 137, 255, 0.08);
}
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

/* Decor */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  z-index: 0;
}
.bg-circle-1 {
  width: 400px;
  height: 400px;
  background: #0089ff;
  top: -100px;
  right: -100px;
}

/* Filter Glass Card */
.filter-glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  border: 1px solid white;
}
.custom-select :deep(.q-field__control) {
  border-radius: 16px !important;
}
.border-blue-soft {
  border: 1px solid rgba(0, 137, 255, 0.1);
}

/* Roadmap Timeline */
.sticky-container {
  position: sticky;
  top: 120px;
}
.roadmap-line {
  position: absolute;
  left: 28px;
  top: 10px;
  bottom: 10px;
  width: 4px;
  background: #e0e6ed;
  border-radius: 2px;
  z-index: 0;
}

/* Roadmap Step Interactive Card */
.roadmap-card-interactive {
  background: white;
  border-radius: 24px;
  padding: 8px;
  border: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  cursor: pointer;
  z-index: 1;
  position: relative;
}

.step-indicator {
  width: 60px;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}
.step-circle {
  width: 44px;
  height: 44px;
  background: #f0f4f8;
  color: #003387;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  transition: all 0.3s;
}

.badge-level {
  background: #f0f4f8;
  color: #003387;
  padding: 4px 10px;
  font-weight: 700;
}
.price-text {
  color: #616161;
}
.arrow-icon {
  color: #e0e0e0;
  transition: transform 0.3s;
}

/* Step Active State */
.step-active .roadmap-card-interactive {
  background: #003387;
  transform: translateX(12px);
  box-shadow: 0 20px 40px rgba(0, 51, 135, 0.15) !important;
}
.step-active .title-text {
  color: white;
}
.step-active .price-text {
  color: rgba(255, 255, 255, 0.7);
}
.step-active .step-circle {
  background: #0089ff;
  color: white;
  transform: scale(1.1);
}
.step-active .badge-level {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
.step-active .arrow-icon {
  color: white;
  transform: translateX(5px);
}

/* Detail Glass Card */
.detail-glass-card {
  background: white;
  border-radius: 40px;
  min-height: 600px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);
}
.card-accent-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, #003387, #0089ff, #ffc42c);
}

.glass-info-pill {
  background: #f8fafc;
  padding: 10px 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #003387;
}

.description-text {
  line-height: 1.8;
  font-size: 1.15rem;
}

/* Buttons */
.btn-primary-gradient {
  background: linear-gradient(135deg, #0089ff 0%, #003387 100%) !important;
  color: white !important;
  box-shadow: 0 10px 25px rgba(0, 137, 255, 0.3);
}
.rounded-16 {
  border-radius: 16px;
}

/* Animations & States */
.empty-detail-state {
  min-height: 500px;
  border: 2px dashed #e0e6ed;
  border-radius: 40px;
}
.icon-blob {
  padding: 40px;
  background: rgba(0, 137, 255, 0.05);
  border-radius: 50% 30% 70% 40% / 50% 60% 30% 60%;
  animation: blob-bounce 8s infinite alternate ease-in-out;
}

@keyframes blob-bounce {
  from {
    border-radius: 50% 30% 70% 40% / 50% 60% 30% 60%;
  }
  to {
    border-radius: 30% 60% 40% 70% / 60% 30% 60% 40%;
  }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-20px);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .sticky-container {
    position: relative;
    top: 0;
  }
  .detail-glass-card {
    min-height: auto;
    margin-top: 40px;
  }
  .text-h2 {
    display: none;
  }
}

/* ========================================
   🎯 MOBILE (<768px) - FULL RESPONSIVE
   ======================================== */
@media (max-width: 767px) {
  .roadmap-page {
    padding: 1rem !important;
  }

  .content-wrapper {
    padding: 0 12px;
  }

  /* Header responsive */
  .row.items-center.q-mb-xl {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .text-h3 {
    font-size: 1.75rem !important;
  }

  /* Filter card: stacked vertical */
  .col-12.col-md-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .filter-glass-card {
    padding: 1.5rem !important;
  }

  .custom-select :deep(.q-field__control) {
    height: 56px !important;
  }

  /* Main layout: Roadmap FULL → Detail BAWAH */
  .col-12.col-lg-5 {
    order: 1;
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 2rem;
  }

  .col-12.col-lg-7 {
    order: 2;
    flex: 0 0 100%;
    max-width: 100%;
  }

  /* Roadmap compact */
  .step-indicator {
    width: 50px;
  }

  .step-circle {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .roadmap-card-interactive {
    padding: 12px !important;
  }

  /* Detail card compact */
  .detail-glass-card {
    min-height: 450px !important;
  }

  .text-h2 {
    font-size: 2.5rem !important;
  }

  .description-text {
    font-size: 1rem;
  }
}

/* ========================================
   ✅ IPAD (768px-1023px) - 40/60 SPLIT
   ======================================== */
@media (min-width: 768px) and (max-width: 1023px) {
  .content-wrapper {
    padding: 0 24px;
  }

  .roadmap-page {
    padding: 1.5rem !important;
  }

  /* Filter: 2 kolom + info 1 kolom */
  .col-12.col-md-4:nth-child(1),
  .col-12.col-md-4:nth-child(2) {
    flex: 0 0 50%;
    max-width: 50%;
  }

  /* Main layout: 40% roadmap | 60% detail */
  .col-12.col-lg-5 {
    flex: 0 0 40%;
    max-width: 40%;
  }

  .col-12.col-lg-7 {
    flex: 0 0 60%;
    max-width: 60%;
  }

  .filter-glass-card {
    padding: 2rem !important;
  }

  .detail-glass-card {
    min-height: 550px !important;
  }

  .sticky-container {
    position: relative;
    top: 0;
  }
}

/* ========================================
   ✅ IPAD PORTRAIT (768x1024) FIX
   ======================================== */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .col-12.col-lg-5 {
    flex: 0 0 45%;
    max-width: 45%;
  }

  .col-12.col-lg-7 {
    flex: 0 0 55%;
    max-width: 55%;
  }
}

/* ========================================
   ✅ DESKTOP SMALL (1024px-1365px)
   ======================================== */
@media (min-width: 1024px) and (max-width: 1365px) {
  .content-wrapper {
    padding: 0 32px;
  }
}

/* ========================================
   ✅ DESKTOP LARGE (≥1366px)
   ======================================== */
@media (min-width: 1366px) {
  .content-wrapper {
    max-width: 1600px;
    padding: 0 64px;
  }
}

/* ========================================
   ✅ BACKGROUND CIRCLE RESPONSIVE
   ======================================== */
@media (max-width: 1023px) {
  .bg-circle-1 {
    width: 300px;
    height: 300px;
    top: -80px;
    right: -80px;
  }
}

@media (max-width: 767px) {
  .bg-circle-1 {
    width: 200px;
    height: 200px;
    top: -60px;
    right: -60px;
  }
}

/* ========================================
   ✅ BUTTONS MOBILE STACK
   ======================================== */
@media (max-width: 767px) {
  .row.q-gutter-md.q-mt-xl > div:last-child {
    order: 1;
    margin-top: 0.5rem;
  }
}
</style>
