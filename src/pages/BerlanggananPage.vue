<template>
  <q-page class="berlangganan-page bg-grey-1">
    <div class="bg-edulang-gradient q-pb-xl">
      <div class="container-center q-pa-md q-pa-md-xl">
        <section class="q-mb-xl">
          <div class="row items-center justify-between q-mb-lg">
            <div class="col-12 col-md-8">
              <div class="row items-center q-gutter-x-sm q-mb-xs">
                <q-icon name="stars" color="warning" size="sm" />
                <span class="text-orange-9 text-weight-bold text-uppercase letter-spacing-1">
                  {{ $t('subscription.recomendedTag') }}
                </span>
              </div>
              <h1 class="text-h3 text-weight-bolder text-edulang-navy q-ma-none leading-tight">
                {{ $t('subscription.recomendedTitle') }}
              </h1>
            </div>
            <div class="col-12 col-md-auto q-mt-md q-mt-md-none">
              <q-btn
                v-if="recommendedCourses.length"
                unelevated
                color="warning"
                text-color="edulang-navy"
                no-caps
                class="rounded-borders-12 q-px-xl text-weight-bold shadow-btn"
                :label="$t('subscription.lihatSemuaFastTrack')"
                @click="scrollToFilter"
              />
            </div>
          </div>

          <div v-if="loading" class="row q-col-gutter-xl">
            <div v-for="n in 3" :key="n" class="col-12 col-md-4">
              <q-card flat class="rounded-borders-24 overflow-hidden shadow-edulang">
                <q-skeleton height="220px" square />
                <q-card-section class="q-pa-lg">
                  <q-skeleton type="text" class="text-h6" width="80%" />
                  <q-skeleton type="text" width="40%" class="q-mt-sm" />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div
            v-else-if="recommendedCourses.length === 0"
            class="text-center q-pa-xl text-grey-6 bg-white rounded-borders-24 shadow-sm"
          >
            {{ $t('subscription.kosongFastTrack') }}
          </div>

          <div v-else class="row q-col-gutter-xl">
            <div v-for="course in recommendedCourses" :key="course._id" class="col-12 col-md-4">
              <CourseCard :course="course" class="recommended-card" />
            </div>
          </div>
        </section>
      </div>
    </div>

    <div class="container-center q-pa-md q-pa-md-xl">
      <section ref="filterSectionRef" class="q-mb-xl">
        <div class="text-center q-mb-xl">
          <h2 class="text-h4 text-weight-bolder text-edulang-navy q-mb-sm">
            {{ $t('subscription.cariKelasTitle') }}
          </h2>
          <div class="bg-warning divider-center rounded-borders"></div>
        </div>

        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-3">
            <div
              class="filter-sidebar bg-white rounded-borders-24 q-pa-lg shadow-edulang border-light"
            >
              <div class="row items-center q-mb-md">
                <q-icon name="tune" color="primary" size="sm" class="q-mr-sm" />
                <span class="text-subtitle1 text-weight-bold text-edulang-navy"
                  >Filter Pencarian</span
                >
              </div>

              <q-separator class="q-mb-lg" />

              <div class="filter-group q-mb-xl">
                <div class="text-caption text-weight-bold text-grey-6 q-mb-sm text-uppercase">
                  Kategori
                </div>
                <div class="column q-gutter-xs">
                  <q-checkbox
                    v-model="filterCategoryAll"
                    :label="$t('subscription.categoryAll')"
                    color="primary"
                  />
                  <q-checkbox
                    v-model="filterCategoryPopuler"
                    :label="$t('subscription.categoryPopuler')"
                    color="primary"
                  />
                </div>
              </div>

              <div class="filter-group q-mb-xl">
                <div class="text-caption text-weight-bold text-grey-6 q-mb-sm text-uppercase">
                  Pilihan Bahasa
                </div>
                <div class="column q-gutter-sm">
                  <div
                    v-for="lang in languageOptions"
                    :key="lang.id"
                    class="filter-bahasa-item row items-center no-wrap"
                  >
                    <q-checkbox v-model="filterBahasa" :val="lang.id" dense color="primary" />
                    <img
                      v-if="lang.iconUrl"
                      :src="lang.iconUrl"
                      class="filter-bahasa-icon q-mx-sm"
                    />
                    <span class="text-body2 text-grey-9">{{ lang.name }}</span>
                  </div>
                </div>
              </div>

              <div class="filter-group">
                <div class="text-caption text-weight-bold text-grey-6 q-mb-sm text-uppercase">
                  Tingkatan Level
                </div>
                <div class="column q-gutter-xs">
                  <q-checkbox
                    v-for="lvl in levelOptions"
                    :key="lvl"
                    v-model="filterLevel"
                    :val="lvl"
                    :label="lvl"
                    color="primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-9">
            <div v-if="loading" class="row q-col-gutter-lg">
              <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
                <q-card flat class="rounded-borders-16 shadow-sm">
                  <q-skeleton height="160px" square />
                  <q-card-section>
                    <q-skeleton type="text" class="text-h6" />
                    <q-skeleton type="text" width="80%" />
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div
              v-else-if="filteredCourses.length === 0"
              class="empty-state flex flex-center column q-pa-xl bg-white rounded-borders-24 shadow-edulang"
            >
              <q-icon name="search_off" size="120px" color="grey-3" class="q-mb-md" />
              <div class="text-h6 text-grey-5">{{ $t('subscription.courseBelumTersedia') }}</div>
              <p class="text-grey-4">Coba ubah filter pencarian Anda</p>
            </div>

            <div v-else class="row q-col-gutter-lg">
              <div
                v-for="course in filteredCourses"
                :key="course._id"
                class="col-12 col-sm-6 col-md-4"
              >
                <CourseCard :course="course" class="full-height-card" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CourseCard from 'components/Subscription/CourseCard.vue'

const $q = useQuasar()
const filterSectionRef = ref(null)
const loading = ref(true)
const languages = ref([])
const courses = ref([])

const filterCategoryAll = ref(true)
const filterCategoryPopuler = ref(false)
const filterBahasa = ref([])
const filterLevel = ref([])

const languageOptions = computed(() => {
  const list = languages.value || []
  return list.map((l) => ({
    id: String(l._id || l.id),
    name: l.name || l.label || 'Bahasa',
    iconUrl: l.iconUrl || l.icon_url || '',
  }))
})

const levelOptions = computed(() => {
  const levels = new Set()
  ;(courses.value || []).forEach((c) => {
    const l = c.level || c.levelName
    if (l) levels.add(l)
  })
  return Array.from(levels).sort()
})

const recommendedCourses = computed(() => {
  const list = courses.value || []
  if (list.length === 0) return []
  const shuffled = [...list].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
})

const filteredCourses = computed(() => {
  let list = courses.value || []
  if (list.length === 0) return []

  const hasBahasa = filterBahasa.value && filterBahasa.value.length > 0
  const hasLevel = filterLevel.value && filterLevel.value.length > 0

  if (hasBahasa) {
    const ids = new Set(filterBahasa.value)
    list = list.filter((c) => {
      const cLang = c.languageType
      const cLangId =
        typeof cLang === 'object' && cLang ? String(cLang._id || cLang.id) : String(cLang)
      return ids.has(cLangId)
    })
  }

  if (hasLevel) {
    const levels = new Set(filterLevel.value)
    list = list.filter((c) => levels.has(c.level || c.levelName))
  }

  return list
})

const scrollToFilter = async () => {
  await nextTick()
  const el = filterSectionRef.value
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const [langRes, pkgRes] = await Promise.all([api.get('/language-types'), api.get('/packages')])

    const langData = langRes.data || {}
    const langs = Array.isArray(langData.languagetypes)
      ? langData.languagetypes
      : langData.data || []
    languages.value = langs

    const pkgData = pkgRes.data || {}
    const list = Array.isArray(pkgData.packages)
      ? pkgData.packages
      : Array.isArray(pkgData.data)
        ? pkgData.data
        : []

    if (list.length === 0) {
      courses.value = []
      return
    }

    const results = await Promise.allSettled(list.map((p) => api.get(`/packages/${p._id || p.id}`)))
    const fullPackages = results.map((r, i) => {
      if (r.status === 'fulfilled' && r.value?.data) {
        const data = r.value.data
        const pkg = data.package ?? data.data ?? (typeof data === 'object' ? data : null)
        if (pkg && typeof pkg === 'object') {
          return { ...list[i], ...pkg, _id: pkg._id ?? list[i]._id }
        }
      }
      return list[i]
    })
    courses.value = fullPackages
  } catch (error) {
    console.error('[BERLANGGANAN] Gagal memuat data', error)
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Gagal memuat data course. Pastikan endpoint /language-types dan /packages tersedia.',
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
/* Brand Colors & Layout */
.text-edulang-navy {
  color: #003387;
}
.bg-edulang-gradient {
  background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
}

.container-center {
  max-width: 1400px;
  margin: 0 auto;
}

/* Custom UI Elements */
.rounded-borders-24 {
  border-radius: 24px;
}
.rounded-borders-12 {
  border-radius: 12px;
}
.border-light {
  border: 1px solid rgba(0, 51, 135, 0.05);
}

.divider-center {
  width: 60px;
  height: 5px;
  margin: 12px auto 0;
}

.shadow-edulang {
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.05) !important;
}

.shadow-btn {
  box-shadow: 0 4px 15px rgba(255, 196, 44, 0.3);
}

.leading-tight {
  line-height: 1.2;
}
.letter-spacing-1 {
  letter-spacing: 1.5px;
}

/* Filter Sidebar Sticky */
.filter-sidebar {
  position: sticky;
  top: 100px;
  z-index: 10;
}

.filter-bahasa-icon {
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Hover effects for cards */
.recommended-card,
.full-height-card {
  transition: all 0.3s ease;
}

.recommended-card:hover,
.full-height-card:hover {
  transform: translateY(-8px);
}

.empty-state {
  min-height: 450px;
  border: 2px dashed #eceff1;
}

/* Responsivitas */
@media (max-width: 600px) {
  .text-h3 {
    font-size: 1rem;
  }
  .q-pa-xl {
    padding: 24px !important;
  }
}
</style>
