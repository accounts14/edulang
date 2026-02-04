<template>
  <q-page class="q-pa-xl bg-blue-1">
    <div class="q-mb-xl">
      <div class="text-h4 text-weight-bolder text-indigo-10">Selamat Datang di, Edulang</div>
      <div class="text-subtitle1 text-grey-7">Tempat Course Bahasa Terbaik</div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-3" v-for="(stat, index) in summaryStats" :key="index">
        <q-card flat class="stat-card q-pa-md text-white shadow-3" :style="{ background: stat.gradient }">
          <q-item>
            <q-item-section avatar>
              <q-avatar color="white-fade" text-color="white" :icon="stat.icon" />
            </q-item-section>
            <q-item-section>
              <div class="text-caption text-weight-bold">{{ stat.label }}</div>
              <div class="row items-end justify-between">
                <div class="text-h4 text-weight-bolder">{{ stat.value }}</div>
                <div class="text-caption text-weight-medium q-mb-xs">{{ stat.subLabel }}</div>
              </div>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>

    <!-- Course Language Overview -->
    <q-card flat class="rounded-borders-lg shadow-1 q-pa-xl bg-white">
      <div class="row items-center q-mb-xl">
        <q-avatar color="grey-3" icon="translate" size="md" class="q-mr-sm" />
        <div class="text-h6 text-weight-bolder">Course Language Overview</div>
      </div>

      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-md-6">
          <div class="row q-col-gutter-md">
            <div class="col-6" v-for="lang in languageDetails" :key="lang._id">
              <q-card flat class="bg-grey-2 q-pa-md rounded-borders relative-position">
                <div class="row items-center no-wrap q-mb-sm">
                  <q-img :src="lang.iconUrl || getFlag(lang.name)" style="width: 28px; border-radius: 4px" class="q-mr-sm" />
                  <div class="text-caption text-weight-bold">{{ lang.name }}</div>
                  <q-badge floating color="blue" size="xs">PRO</q-badge>
                </div>
                <div class="text-h4 text-weight-bolder q-mt-sm">{{ lang.count }}</div>
                <div class="text-caption text-grey-7">Course Tersedia</div>
              </q-card>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 text-center">
          <div class="flex flex-center relative-position">
            <svg width="300" height="300" viewBox="0 0 42 42" class="donut">
              <circle
                v-for="(segment, i) in chartSegments"
                :key="i"
                cx="21" cy="21" r="15.915"
                fill="transparent"
                :stroke="segment.color"
                stroke-width="6"
                :stroke-dasharray="`${segment.percent} ${100 - segment.percent}`"
                :stroke-dashoffset="segment.offset"
              ></circle>
            </svg>
            <div class="absolute-center">
              <div class="text-h4 text-weight-bolder">{{ totalCoursePercent }}%</div>
              <div class="text-caption text-grey-7 text-weight-bold">Total</div>
            </div>
          </div>
          <div class="text-h6 text-weight-bolder q-mt-lg">Chart Course Tersedia</div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'

// State
const summaryStats = ref([
  { label: 'Pengguna', value: 0, subLabel: 'Pengguna', icon: 'person', gradient: 'linear-gradient(to right, #2196F3, #64B5F6)' },
  { label: 'Language', value: 0, subLabel: 'Bahasa', icon: 'translate', gradient: 'linear-gradient(to right, #1A237E, #3F51B5)' },
  { label: 'Total Course', value: 0, subLabel: 'Course', icon: 'book', gradient: 'linear-gradient(to right, #42A5F5, #90CAF9)' },
  { label: 'Total Mentor', value: 0, subLabel: 'Mentor', icon: 'groups', gradient: 'linear-gradient(to right, #0D47A1, #1976D2)' }
])

const languageDetails = ref([])
const totalCourse = ref(0)

// Ambil data dashboard admin dari endpoint sesuai dokumentasi
const fetchData = async () => {
  try {
    // 1. Total user (optional, tidak ada di dokumen → coba /users kalau tersedia)
    let totalUsers = 0
    try {
      const usersRes = await api.get('/users')
      const usersData = usersRes.data
      const usersArray = usersData.users || usersData.data || []
      totalUsers = usersData.count ?? (Array.isArray(usersArray) ? usersArray.length : 0)
    } catch (userErr) {
      console.warn('[ADMIN DASHBOARD] Endpoint /users tidak tersedia, total pengguna diset 0', userErr?.response?.status)
    }

    // 2. Get language types → GET /api/language-types
    const langRes = await api.get('/language-types')
    const langData = langRes.data || {}
    const languages = Array.isArray(langData.languagetypes) ? langData.languagetypes : (langData.data || [])

    // 3. Get all packages → GET /api/packages
    const pkgRes = await api.get('/packages')
    const pkgData = pkgRes.data || {}
    const packages = Array.isArray(pkgData.packages) ? pkgData.packages : (pkgData.data || [])
    totalCourse.value = packages.length

    // 4. Get mentors → GET /api/mentors (admin only)
    const mentorRes = await api.get('/mentors')
    const mentorData = mentorRes.data || {}
    const mentors = Array.isArray(mentorData.mentors) ? mentorData.mentors : (mentorData.data || [])

    // Update stats cards
    summaryStats.value[0].value = totalUsers
    summaryStats.value[1].value = languages.length
    summaryStats.value[2].value = packages.length
    summaryStats.value[3].value = mentors.length

    // Hitung course per bahasa (LanguageTypes ↔ Packages.languageType)
    languageDetails.value = languages.map((lang) => {
      const langId = lang._id
      const count = packages.filter((p) => {
        const pLang = p.languageType
        const pLangId = typeof pLang === 'object' && pLang !== null ? (pLang._id || pLang.id) : pLang
        return String(pLangId) === String(langId)
      }).length

      return {
        _id: langId,
        name: lang.name,
        iconUrl: lang.iconUrl || lang.icon_url || '',
        count
      }
    })
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  }
}

const getFlag = (name) => {
  const flags = {
    'English': 'https://flagcdn.com/us.svg',
    'Chinese': 'https://flagcdn.com/cn.svg',
    'Japan': 'https://flagcdn.com/jp.svg',
    'Germany': 'https://flagcdn.com/de.svg',
    'Arab': 'https://flagcdn.com/sa.svg',
    'Indonesian': 'https://flagcdn.com/id.svg'
  }
  return flags[name] || 'https://flagcdn.com/un.svg'
}

const chartSegments = computed(() => {
  const totalLangs = languageDetails.value.length
  if (totalLangs === 0) return [{ percent: 100, offset: 25, color: '#e0e0e0' }]

  const colors = ['#2196F3', '#81C784', '#FFB74D', '#F48FB1', '#FFCC80']
  let currentOffset = 25
  const segments = []

  languageDetails.value.forEach((lang, i) => {
    const percent = totalCourse.value > 0 ? (lang.count / totalCourse.value) * 100 : 0
    segments.push({
      percent: parseFloat(percent.toFixed(1)),
      offset: currentOffset,
      color: colors[i % colors.length]
    })
    currentOffset -= percent
  })

  return segments
})

const totalCoursePercent = computed(() => {
  return totalCourse.value > 0 ? 100 : 0
})

onMounted(fetchData)
</script>

<style scoped>
.stat-card { border-radius: 16px; overflow: hidden; }
.rounded-borders-lg { border-radius: 24px; }
.white-fade { background: rgba(255, 255, 255, 0.25); }
.donut { transform: rotate(-90deg); }
</style>