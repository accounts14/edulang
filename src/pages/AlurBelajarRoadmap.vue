<template>
  <q-page class="roadmap-page q-pa-lg q-pa-md-xl bg-edulang-white">
    <div class="row items-center q-mb-xl">
      <q-btn
        flat
        round
        color="edulang-navy"
        icon="arrow_back"
        class="bg-white shadow-1 q-mr-md"
        @click="$router.back()"
      />
      <div>
        <div class="text-h4 text-weight-bolder text-edulang-navy">Alur Belajar Pendidikan</div>
        <div class="text-edulang-blue text-weight-bold">#UnlockTheWorld</div>
      </div>
    </div>

    <q-card flat class="filter-card q-pa-lg q-mb-xl">
      <div class="row q-col-gutter-lg items-center">
        <div class="col-12 col-md-4">
          <div class="text-caption text-weight-bold text-edulang-navy q-mb-xs">PILIH BAHASA</div>
          <q-select
            v-model="selectedLanguageId"
            :options="languageOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            outlined
            bg-color="white"
            color="edulang-blue"
            label="Pilih Bahasa"
            :loading="loading"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="translate" color="edulang-blue" />
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-caption text-weight-bold text-edulang-navy q-mb-xs">
            TINGKAT KEMAMPUAN
          </div>
          <q-select
            v-model="selectedLevel"
            :options="levelOptions"
            outlined
            bg-color="white"
            color="edulang-blue"
            label="Pilih Level"
            :disable="!selectedLanguageId || levelOptions.length === 0"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="bar_chart" color="edulang-blue" />
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-4 text-grey-7 text-body2">
          Pilih bahasa dan level untuk mendapatkan rekomendasi urutan kelas yang paling efektif
          untuk masa depanmu.
        </div>
      </div>
    </q-card>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-5">
        <div class="sticky-container">
          <div v-if="loading" class="column q-gutter-md">
            <q-skeleton v-for="n in 3" :key="n" type="rect" height="90px" class="rounded-16" />
          </div>

          <div v-else class="relative-position">
            <div class="roadmap-line"></div>

            <div
              v-for="(item, index) in displayRoadmap"
              :key="item.id || index"
              class="roadmap-card q-pa-md q-mb-lg cursor-pointer"
              :class="{ 'card-active': index === currentIndex }"
              @click="currentIndex = index"
            >
              <div class="row items-center no-wrap">
                <div class="step-number-container">
                  <div class="step-number shadow-2">{{ index + 1 }}</div>
                </div>

                <div class="q-ml-md full-width">
                  <div
                    class="text-subtitle1 text-weight-bolder ellipsis"
                    :class="index === currentIndex ? 'text-white' : 'text-edulang-navy'"
                  >
                    {{ item.title }}
                  </div>

                  <div class="row items-center q-gutter-x-sm q-mt-xs">
                    <q-badge
                      rounded
                      :color="index === currentIndex ? 'white' : 'edulang-yellow'"
                      :text-color="index === currentIndex ? 'edulang-blue' : 'dark'"
                      :label="item.levelLabel"
                      class="text-weight-bold"
                    />
                    <div
                      class="text-caption"
                      :class="index === currentIndex ? 'text-blue-1' : 'text-grey-7'"
                    >
                      {{ item.priceDisplay }}
                    </div>
                  </div>
                </div>

                <q-icon
                  name="chevron_right"
                  :color="index === currentIndex ? 'white' : 'grey-4'"
                  size="24px"
                />
              </div>
            </div>

            <div
              v-if="selectedLanguageId && selectedLevel && displayRoadmap.length === 0"
              class="empty-state-small text-center q-pa-lg"
            >
              <q-icon name="explore" size="48px" color="grey-4" />
              <div class="text-grey-6 q-mt-sm">Belum ada alur untuk kombinasi ini.</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-7">
        <transition name="fade-up" mode="out-in">
          <q-card
            flat
            class="detail-card full-height"
            :key="currentIndex"
            v-if="currentItem && !loading"
          >
            <div class="detail-header-bg"></div>
            <div class="q-pa-xl relative-position">
              <q-chip outline color="edulang-blue" class="q-mb-md text-weight-bold" icon="school">
                {{ currentItem.languageLabel }}
              </q-chip>

              <h1 class="text-h3 text-weight-bolder text-edulang-navy q-mb-md q-mt-none">
                {{ currentItem.title }}
              </h1>

              <div class="row q-gutter-md q-mb-xl">
                <div class="info-badge">
                  <q-icon name="schedule" size="20px" />
                  <span>{{ currentItem.levelLabel }}</span>
                </div>
                <div class="info-badge">
                  <q-icon name="payments" size="20px" />
                  <span>{{ currentItem.priceDisplay }}</span>
                </div>
              </div>

              <div class="text-body1 text-grey-8 q-mb-xl line-height-relaxed">
                {{
                  currentItem.description ||
                  'Pelajari materi ini untuk meningkatkan kompetensi bahasa kamu ke tingkat selanjutnya.'
                }}
              </div>

              <div class="row q-gutter-md">
                <q-btn
                  unelevated
                  class="btn-edulang-blue q-px-xl text-weight-bold"
                  size="lg"
                  no-caps
                  :label="currentItem.cta"
                  @click="goToCurrentCourse"
                />
                <q-btn
                  outline
                  color="edulang-navy"
                  class="rounded-12 q-px-lg text-weight-bold"
                  size="lg"
                  no-caps
                  label="Lihat Detail"
                  @click="goToCurrentCourse"
                />
              </div>
            </div>
          </q-card>

          <div v-else-if="!loading" class="placeholder-card flex flex-center column">
            <q-icon name="auto_awesome" size="80px" color="grey-3" />
            <div class="text-h6 text-grey-4 q-mt-md">Silakan pilih bahasa dan modul</div>
          </div>
        </transition>
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
/* Edulang Brand Colors */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-white {
  background-color: #f5f7fa;
}
.text-blue-1 {
  color: rgba(255, 255, 255, 0.8) !important;
}

.rounded-16 {
  border-radius: 16px;
}
.rounded-12 {
  border-radius: 12px;
}

/* Filter Card Area */
.filter-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 51, 135, 0.04);
}

/* Roadmap List Styles */
.sticky-container {
  position: sticky;
  top: 100px;
}

.roadmap-line {
  position: absolute;
  left: 30px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  background: #e0e6ed;
  z-index: 0;
}

.roadmap-card {
  background: white;
  border-radius: 18px;
  border: 1px solid transparent;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1;
  position: relative;
}

.roadmap-card:hover {
  transform: translateX(5px);
  border-color: rgba(0, 137, 255, 0.2);
}

/* KUNCI: Style saat Kartu Aktif */
.card-active {
  background: #0089ff !important; /* Edulang Blue */
  border: 1px solid #0089ff;
  box-shadow: 0 10px 25px rgba(0, 137, 255, 0.25);
}

.card-active .step-number {
  background: white !important;
  color: #0089ff !important;
  border-color: white !important;
}

.step-number-container {
  width: 32px;
  display: flex;
  justify-content: center;
}

.step-number {
  width: 34px;
  height: 34px;
  background: white;
  border: 2px solid #0089ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #0089ff;
  font-size: 14px;
  transition: all 0.3s;
}

/* Detail Card Styles */
.detail-card {
  border-radius: 30px;
  overflow: hidden;
  background: white;
  box-shadow: 0 15px 40px rgba(0, 51, 135, 0.05);
  position: relative;
}

.detail-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, #003387, #0089ff);
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0f4f8;
  padding: 8px 16px;
  border-radius: 12px;
  color: #003387;
  font-weight: 600;
}

.btn-edulang-blue {
  background: #0089ff !important;
  color: white !important;
  border-radius: 14px;
}

.placeholder-card {
  border: 2px dashed #e0e6ed;
  border-radius: 30px;
  min-height: 400px;
}

.line-height-relaxed {
  line-height: 1.8;
}

/* Transition Animation */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
