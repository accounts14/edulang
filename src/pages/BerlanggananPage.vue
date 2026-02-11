<template>
  <q-page class="berlangganan-page q-pa-xl bg-edulang-white">
    <section class="q-mb-xl">
      <div class="row items-end justify-between q-mb-xl">
        <div class="col-12 col-md-8">
          <div class="row items-center q-gutter-x-sm q-mb-sm">
            <q-icon name="auto_awesome" color="edulang-blue" size="20px" />
            <div class="text-edulang-blue text-weight-bold letter-spacing-1">
              {{ $t('subscription.recomendedTag').toUpperCase() }}
            </div>
          </div>
          <div class="text-h3 text-weight-bolder text-edulang-navy q-mt-xs">
            {{ $t('subscription.recomendedTitle') }}
          </div>
        </div>
        <div class="col-12 col-md-auto q-mt-md">
          <q-btn
            v-if="recommendedCourses.length"
            unelevated
            class="btn-edulang-blue text-weight-bold q-px-xl q-py-sm"
            no-caps
            :label="$t('subscription.lihatSemuaFastTrack')"
            @click="scrollToFilter"
          />
        </div>
      </div>

      <div v-if="loading" class="row q-col-gutter-xl">
        <div v-for="n in 3" :key="n" class="col-12 col-md-4">
          <q-card flat class="card-premium skeleton-card">
            <q-skeleton height="240px" square />
            <q-card-section>
              <q-skeleton type="text" width="40%" class="q-mb-sm" />
              <q-skeleton type="text" class="text-h6" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-else-if="recommendedCourses.length === 0" class="empty-box flex flex-center">
        <div class="text-grey-6">{{ $t('subscription.kosongFastTrack') }}</div>
      </div>

      <div v-else class="row q-col-gutter-xl">
        <div v-for="course in recommendedCourses" :key="course._id" class="col-12 col-md-4">
          <CourseCard :course="course" class="card-premium active-hover" />
        </div>
      </div>
    </section>

    <section ref="filterSectionRef" class="q-pt-md">
      <div class="row items-center q-mb-xl">
        <div class="separator-line q-mr-md"></div>
        <div class="text-h4 text-weight-bolder text-edulang-navy">
          {{ $t('subscription.cariKelasTitle') }}
        </div>
      </div>

      <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-3">
          <div class="filter-sidebar">
            <div class="filter-card q-pa-lg">
              <div class="row items-center q-mb-lg">
                <q-icon name="tune" color="edulang-navy" size="24px" class="q-mr-sm" />
                <span class="text-h6 text-weight-bold text-edulang-navy">Filter</span>
              </div>

              <div class="filter-group">
                <div class="filter-label">{{ $t('subscription.categoryLabel') }}</div>
                <div class="column q-gutter-y-xs">
                  <q-checkbox
                    v-model="filterCategoryAll"
                    :label="$t('subscription.categoryAll')"
                    color="edulang-blue"
                  />
                  <q-checkbox
                    v-model="filterCategoryPopuler"
                    :label="$t('subscription.categoryPopuler')"
                    color="edulang-blue"
                  />
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="filter-group">
                <div class="filter-label">{{ $t('subscription.bahasaLabel') }}</div>
                <div class="column q-gutter-y-sm">
                  <div
                    v-for="lang in languageOptions"
                    :key="lang.id"
                    class="row items-center lang-item"
                  >
                    <q-checkbox v-model="filterBahasa" :val="lang.id" color="edulang-blue" dense />
                    <img v-if="lang.iconUrl" :src="lang.iconUrl" class="lang-flag q-mx-sm" />
                    <span class="text-body2 text-grey-8">{{ lang.name }}</span>
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="filter-group">
                <div class="filter-label">{{ $t('subscription.levelLabel') }}</div>
                <div class="column q-gutter-y-xs">
                  <q-checkbox
                    v-for="lvl in levelOptions"
                    :key="lvl"
                    v-model="filterLevel"
                    :val="lvl"
                    :label="lvl"
                    color="edulang-blue"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-9">
          <div v-if="loading" class="row q-col-gutter-lg">
            <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
              <q-card flat class="card-premium skeleton-card">
                <q-skeleton height="180px" />
                <q-card-section><q-skeleton type="text" /></q-card-section>
              </q-card>
            </div>
          </div>

          <div
            v-else-if="filteredCourses.length === 0"
            class="empty-state-v2 flex flex-center column"
          >
            <q-icon name="search_off" size="120px" color="grey-4" />
            <div class="text-h6 text-grey-6 q-mt-md">
              {{ $t('subscription.courseBelumTersedia') }}
            </div>
            <div class="text-caption text-grey-5">Coba ubah filter pencarian kamu</div>
          </div>

          <div v-else class="row q-col-gutter-lg">
            <div
              v-for="course in filteredCourses"
              :key="course._id"
              class="col-12 col-sm-6 col-md-4"
            >
              <CourseCard :course="course" class="card-premium active-hover" />
            </div>
          </div>
        </div>
      </div>
    </section>
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
/* Edulang Brand Colors Implementation */
.bg-edulang-white {
  background-color: #f5f7fa;
}
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.btn-edulang-blue {
  background-color: #0089ff !important;
  color: #f5f7fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.btn-edulang-blue:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 196, 44, 0.4);
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.letter-spacing-1 {
  letter-spacing: 1.5px;
}

/* Card Premium Style */
.card-premium {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(0, 51, 135, 0.05);
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.03);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.active-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 51, 135, 0.08);
  border: 1px solid rgba(0, 137, 255, 0.2);
}

/* Sidebar & Filters */
.filter-sidebar {
  position: sticky;
  top: 100px;
}

.filter-card {
  background: white;
  border-radius: 24px;
  border: 1px solid rgba(0, 51, 135, 0.05);
  box-shadow: 0 4px 20px rgba(0, 51, 135, 0.04);
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #003387;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.lang-flag {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.separator-line {
  width: 60px;
  height: 6px;
  background: #0089ff;
  border-radius: 10px;
}

.empty-state-v2 {
  min-height: 450px;
  background: white;
  border-radius: 30px;
  border: 2px dashed #e0e0e0;
}

.empty-box {
  min-height: 200px;
  border: 2px dashed #d0d0d0;
  border-radius: 20px;
}

/* Override Quasar Checkbox for Edulang Style */
:deep(.q-checkbox__inner--active .q-checkbox__bg) {
  background: #0089ff !important;
  border-color: #0089ff !important;
}
</style>
