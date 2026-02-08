<template>
  <q-page class="berlangganan-page q-pa-xl bg-accent">
    <!-- Section 1: Rekomendasi Kelas (Random) -->
    <section class="q-mb-xl">
      <div class="row items-center justify-between q-mb-md">
        <div>
          <div class="text-orange-9 text-weight-bold">{{ $t('subscription.recomendedTag') }}</div>
          <div class="text-h4 text-weight-bolder text-indigo-10 q-mt-xs">
            {{ $t('subscription.recomendedTitle') }}
          </div>
        </div>
        <q-btn
          v-if="recommendedCourses.length"
          unelevated
          color="warning"
          text-color="black"
          no-caps
          class="rounded-borders q-px-lg text-weight-bold"
          :label="$t('subscription.lihatSemuaFastTrack')"
          @click="scrollToFilter"
        />
      </div>

      <div v-if="loading" class="row q-col-gutter-lg">
        <div v-for="n in 3" :key="n" class="col-12 col-md-4">
          <q-card flat bordered class="rounded-borders-16">
            <q-skeleton height="200px" square />
            <q-card-section>
              <q-skeleton type="text" class="text-h6" />
              <q-skeleton type="text" width="60%" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-else-if="recommendedCourses.length === 0" class="text-grey-7 text-caption">
        {{ $t('subscription.kosongFastTrack') }}
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="course in recommendedCourses" :key="course._id" class="col-12 col-md-4">
          <CourseCard :course="course" />
        </div>
      </div>
    </section>

    <!-- Section 2: Cari Kelas Bahasa Sesuai Minatmu -->
    <section ref="filterSectionRef" class="q-mb-xl">
      <div class="text-h4 text-weight-bolder text-indigo-10 q-mb-lg">
        {{ $t('subscription.cariKelasTitle') }}
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Left: Filter Sidebar -->
        <div class="col-12 col-md-3">
          <div class="filter-sidebar bg-white rounded-borders-16 q-pa-md">
            <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-sm">
              {{ $t('subscription.categoryLabel') }}
            </div>
            <div class="filter-options-vertical q-mb-lg">
              <q-checkbox v-model="filterCategoryAll" :label="$t('subscription.categoryAll')" />
              <q-checkbox
                v-model="filterCategoryPopuler"
                :label="$t('subscription.categoryPopuler')"
              />
            </div>

            <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-sm">
              {{ $t('subscription.bahasaLabel') }}
            </div>
            <div class="filter-options-vertical q-mb-lg">
              <div
                v-for="lang in languageOptions"
                :key="lang.id"
                class="filter-bahasa-item row items-center q-mb-xs"
              >
                <q-checkbox v-model="filterBahasa" :val="lang.id" dense />
                <img
                  v-if="lang.iconUrl"
                  :src="lang.iconUrl"
                  :alt="lang.name"
                  class="filter-bahasa-icon q-mr-sm"
                />
                <span>{{ lang.name }}</span>
              </div>
            </div>

            <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-sm">
              {{ $t('subscription.levelLabel') }}
            </div>
            <div class="filter-options-vertical">
              <q-checkbox
                v-for="lvl in levelOptions"
                :key="lvl"
                v-model="filterLevel"
                :val="lvl"
                :label="lvl"
              />
            </div>
          </div>
        </div>

        <!-- Right: Course Grid -->
        <div class="col-12 col-md-9">
          <div v-if="loading" class="row q-col-gutter-lg">
            <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
              <q-card flat bordered class="rounded-borders-16">
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
            class="empty-state flex flex-center column q-pa-xl"
          >
            <q-icon name="movie_filter" size="120px" color="grey-5" class="q-mb-md" />
            <div class="text-h6 text-grey-7">{{ $t('subscription.courseBelumTersedia') }}</div>
          </div>

          <div v-else class="row q-col-gutter-lg">
            <div
              v-for="course in filteredCourses"
              :key="course._id"
              class="col-12 col-sm-6 col-md-4"
            >
              <CourseCard :course="course" />
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
.berlangganan-page {
  min-height: 100%;
}
.text-indigo-10 {
  color: #0d2a5c;
}
.rounded-borders-16 {
  border-radius: 16px;
}
.filter-sidebar {
  position: sticky;
  top: 80px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}
.filter-options-vertical {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-bahasa-item {
  min-height: 32px;
}
.filter-bahasa-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 4px;
}
.empty-state {
  min-height: 320px;
  background: #fafafa;
  border-radius: 16px;
}
</style>
