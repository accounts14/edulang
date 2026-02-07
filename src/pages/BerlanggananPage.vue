<template>
  <q-page class="q-pa-xl bg-accent">
    <!-- Header Fast Track -->
    <section class="q-mb-xl">
      <div class="row items-center justify-between q-mb-md">
        <div class="col-12 col-md-8">
          <div class="text-orange-9 text-weight-bold">{{ $t('subscription.fastTrackTag') }}</div>
          <div class="text-h4 text-weight-bolder text-indigo-10 q-mt-xs">
            {{ $t('subscription.fastTrackTitle') }}
          </div>
          <div class="text-grey-8 q-mt-xs">
            {{ $t('subscription.fastTrackDesc') }}
          </div>
        </div>
        <div class="col-12 col-md-auto q-mt-md">
          <q-btn
            v-if="fastTrackCourses.length"
            unelevated
            color="warning"
            text-color="black"
            no-caps
            class="rounded-borders q-px-lg text-weight-bold"
            :label="$t('subscription.lihatSemuaFastTrack')"
            @click="scrollToFastTrack"
          />
        </div>
      </div>

      <div ref="fastTrackSection">
        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="40px" />
        </div>

        <div v-else-if="!fastTrackCourses.length" class="text-grey-7 text-caption q-mt-md">
          {{ $t('subscription.kosongFastTrack') }}
        </div>

        <div v-else class="row q-col-gutter-lg">
          <div v-for="course in fastTrackCourses" :key="course._id" class="col-12 col-md-4">
            <CourseCard :course="course" />
          </div>
        </div>
      </div>
    </section>

    <!-- Section per Bahasa -->
    <section
      v-for="group in languageGroups"
      :key="group.languageId"
      :ref="setLanguageSectionRef(group.languageId)"
      class="q-mb-xl"
    >
      <div class="row items-center justify-between q-mb-md">
        <div>
          <div class="text-orange-9 text-weight-bold">
            {{ $t('subscription.courseBahasaTag', { language: group.languageName }) }}
          </div>
          <div class="text-h4 text-weight-bolder text-indigo-10 q-mt-xs">
            {{ $t('subscription.courseBahasaTitle', { language: group.languageName }) }}
          </div>
        </div>
        <div v-if="group.courses.length" class="q-mt-sm">
          <q-btn
            unelevated
            color="primary"
            text-color="white"
            no-caps
            class="rounded-borders q-px-lg text-weight-bold"
            :label="$t('subscription.lihatSemuaKelas')"
          />
        </div>
      </div>

      <div v-if="group.courses.length === 0" class="text-grey-7 text-caption">
        {{ $t('subscription.kosongBahasa') }}
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div v-for="course in group.courses" :key="course._id" class="col-12 col-md-4">
          <CourseCard :course="course" />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CourseCard from 'components/Subscription/CourseCard.vue'

const $q = useQuasar()
const route = useRoute()

const loading = ref(true)
const languages = ref([])
const courses = ref([])

const fastTrackSection = ref(null)
const languageSectionRefs = ref({})

const setLanguageSectionRef = (id) => (el) => {
  if (el) {
    languageSectionRefs.value[id] = el
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    // Bahasa
    const langRes = await api.get('/language-types')
    const langData = langRes.data || {}
    const langs = Array.isArray(langData.languagetypes)
      ? langData.languagetypes
      : langData.data || []
    languages.value = langs

    // Packages / Course - GET /packages sudah return introVideoUrl, title, dll
    const pkgRes = await api.get('/packages')
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
      if (r.status === 'fulfilled' && r.value?.data?.package) {
        const pkg = r.value.data.package
        return { ...list[i], ...pkg, _id: pkg._id ?? list[i]._id }
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

const fastTrackCourses = computed(() => {
  // Mengikuti konsep FastTrackSection: ambil beberapa paket unggulan secara acak
  if (!Array.isArray(courses.value) || courses.value.length === 0) return []
  // Salin dan acak, lalu ambil maksimal 3
  const shuffled = [...courses.value].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
})

const languageGroups = computed(() => {
  const groups = []
  languages.value.forEach((lang) => {
    const langId = String(lang._id || lang.id)
    const groupCourses = courses.value.filter((c) => {
      const cLang = c.languageType
      const cLangId =
        typeof cLang === 'object' && cLang ? String(cLang._id || cLang.id) : String(cLang)
      return cLangId === langId
    })

    groups.push({
      languageId: langId,
      languageName: lang.name || lang.label || 'Bahasa',
      courses: groupCourses,
    })
  })
  return groups
})

const scrollToFastTrack = async () => {
  await nextTick()
  const el = fastTrackSection.value
  if (el && el.$el) {
    el.$el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else if (el?.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const scrollToLanguageFromQuery = async () => {
  const languageId = route.query.languageId
  const languageName = route.query.languageName
  if (!languageId && !languageName) return

  await nextTick()

  let targetId = languageId
  if (!targetId && languageName) {
    const found = languages.value.find(
      (l) => (l.name || '').toLowerCase() === String(languageName).toLowerCase(),
    )
    if (found) {
      targetId = String(found._id || found.id)
    }
  }

  if (!targetId) return
  const el = languageSectionRefs.value[targetId]
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  await fetchData()
  await scrollToLanguageFromQuery()
})

watch(
  () => route.query,
  async () => {
    await scrollToLanguageFromQuery()
  },
)
</script>

<style scoped>
.text-indigo-10 {
  color: #0d2a5c;
}

.rounded-borders-16 {
  border-radius: 16px;
}

.rounded-borders-16-top {
  border-radius: 16px 16px 0 0;
}

.course-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}
</style>
