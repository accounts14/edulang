<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="q-mb-lg">
      <h1 class="text-h5 text-weight-bolder text-edulang-navy q-mb-none">
        Selamat Datang di, <span class="text-edulang-blue">Edulang</span>
      </h1>
      <p class="text-caption text-grey-7">Tempat Course Bahasa Terbaik</p>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3" v-for="(stat, index) in summaryStats" :key="index">
        <q-card
          flat
          class="stat-card-modern shadow-sm overflow-hidden"
          :style="{ background: stat.gradient }"
        >
          <q-card-section class="q-pa-md">
            <div class="row items-center no-wrap q-mb-sm">
              <div class="icon-container-blur q-mr-sm flex-shrink-0">
                <q-icon :name="stat.icon" size="20px" color="white" />
              </div>
              <div class="text-caption text-white text-weight-medium opacity-80 ellipsis">
                {{ stat.label }}
              </div>
            </div>
            <div class="row items-end justify-between no-wrap">
              <div class="text-h5 text-weight-bolder text-white">{{ stat.value }}</div>
              <div
                class="text-caption text-white text-weight-bold opacity-70 flex-shrink-0"
                style="font-size: 10px"
              >
                {{ stat.subLabel }}
              </div>
            </div>
          </q-card-section>
          <div class="decor-circle"></div>
        </q-card>
      </div>
    </div>

    <q-card flat class="rounded-16 shadow-sm bg-white overflow-hidden">
      <q-card-section class="q-pa-lg">
        <div class="row items-center q-mb-lg">
          <div class="section-indicator q-mr-sm"></div>
          <div class="text-subtitle1 text-weight-bolder text-edulang-navy">
            Course Language Overview
          </div>
        </div>

        <div class="flex no-wrap items-start justify-between full-width overflow-hidden">
          <div class="flex-grow-1 q-pr-lg">
            <div class="row q-col-gutter-sm">
              <div class="col-6" v-for="lang in languageDetails" :key="lang._id">
                <q-card flat class="lang-item-card border-light q-pa-sm">
                  <div class="row items-center justify-between no-wrap q-mb-xs">
                    <div class="row items-center no-wrap overflow-hidden">
                      <q-img
                        :src="lang.iconUrl || getFlag(lang.name)"
                        style="width: 22px; height: 14px; border-radius: 2px"
                        class="shadow-xs q-mr-sm flex-shrink-0"
                      />
                      <div class="text-caption text-weight-bold text-edulang-navy ellipsis">
                        {{ lang.name }}
                      </div>
                    </div>
                    <q-badge
                      rounded
                      color="blue-6"
                      label="PRO"
                      class="text-weight-bolder"
                      style="font-size: 8px; padding: 2px 4px"
                    />
                  </div>
                  <div class="row items-baseline">
                    <div class="text-h6 text-weight-bolder text-indigo-10">{{ lang.count }}</div>
                    <div class="text-caption text-grey-6 q-ml-xs" style="font-size: 10px">
                      Course Tersedia
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>

          <div
            class="flex flex-center column flex-shrink-0"
            style="width: 300px; border-left: 1px solid #f0f0f0"
          >
            <div class="chart-wrapper relative-position">
              <q-circular-progress
                show-value
                size="160px"
                :thickness="0.2"
                :value="totalCoursePercent"
                color="blue-6"
                track-color="grey-2"
                class="text-edulang-navy text-weight-bolder"
              >
                <div class="column items-center">
                  <div class="text-h5 text-weight-bolder">{{ totalCourse }}</div>
                  <div
                    class="text-caption text-grey-6 text-weight-bold text-uppercase"
                    style="font-size: 9px"
                  >
                    Total Course
                  </div>
                </div>
              </q-circular-progress>
            </div>

            <div class="text-subtitle2 text-weight-bolder text-edulang-navy q-mt-md">
              Chart Course Tersedia
            </div>

            <div class="row q-gutter-xs justify-center q-mt-sm q-px-md">
              <div
                v-for="(lang, i) in languageDetails.slice(0, 6)"
                :key="i"
                class="row items-center no-wrap q-px-xs"
              >
                <div class="legend-dot" :style="{ backgroundColor: getChartColor(i) }"></div>
                <div class="text-caption text-grey-7" style="font-size: 9px">{{ lang.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'

// State Stats
const summaryStats = ref([
  {
    label: 'Pengguna',
    value: 0,
    subLabel: 'Pengguna',
    icon: 'person',
    gradient: 'linear-gradient(135deg, #0089ff 0%, #6ec1ff 100%)',
  },
  {
    label: 'Language',
    value: 0,
    subLabel: 'Bahasa',
    icon: 'translate',
    gradient: 'linear-gradient(135deg, #003387 0%, #0056e0 100%)',
  },
  {
    label: 'Total Course',
    value: 0,
    subLabel: 'Course',
    icon: 'menu_book',
    gradient: 'linear-gradient(135deg, #3079ed 0%, #82b1ff 100%)',
  },
  {
    label: 'Total Mentor',
    value: 0,
    subLabel: 'Mentor',
    icon: 'groups',
    gradient: 'linear-gradient(135deg, #001e54 0%, #003387 100%)',
  },
])

const languageDetails = ref([])
const totalCourse = ref(0)

const fetchData = async () => {
  try {
    let totalUsers = 0
    try {
      const usersRes = await api.get('/users')
      const usersData = usersRes.data
      totalUsers = usersData.count ?? (Array.isArray(usersData.data) ? usersData.data.length : 0)
    } catch {
      console.warn('Users endpoint skip')
    }

    const langRes = await api.get('/language-types')
    const languages = langRes.data.languagetypes || langRes.data.data || []

    const pkgRes = await api.get('/packages')
    const packages = pkgRes.data.packages || pkgRes.data.data || []
    totalCourse.value = packages.length

    const mentorRes = await api.get('/mentors')
    const mentors = mentorRes.data.mentors || mentorRes.data.data || []

    summaryStats.value[0].value = totalUsers
    summaryStats.value[1].value = languages.length
    summaryStats.value[2].value = packages.length
    summaryStats.value[3].value = mentors.length

    languageDetails.value = languages.map((lang) => ({
      _id: lang._id,
      name: lang.name,
      iconUrl: lang.iconUrl || lang.icon_url || '',
      count: packages.filter(
        (p) => String(p.languageType?._id || p.languageType) === String(lang._id),
      ).length,
    }))
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  }
}

const getFlag = (name) => {
  const flags = {
    English: 'https://flagcdn.com/us.svg',
    Chinese: 'https://flagcdn.com/cn.svg',
    Japan: 'https://flagcdn.com/jp.svg',
    Germany: 'https://flagcdn.com/de.svg',
    Arab: 'https://flagcdn.com/sa.svg',
    Indonesian: 'https://flagcdn.com/id.svg',
    Korean: 'https://flagcdn.com/kr.svg',
    British: 'https://flagcdn.com/gb.svg',
  }
  // Cek apakah ada kata kunci di dalam nama bahasa (misal: "Mandarin (Taiwan)")
  for (const key in flags) {
    if (name.toLowerCase().includes(key.toLowerCase())) return flags[key]
  }
  return 'https://flagcdn.com/un.svg'
}

const getChartColor = (index) => {
  const colors = ['#0089ff', '#4caf50', '#ffb300', '#f44336', '#9c27b0', '#00bcd4']
  return colors[index % colors.length]
}

const totalCoursePercent = computed(() => (totalCourse.value > 0 ? 100 : 0))

onMounted(fetchData)
</script>

<style scoped>
/* Colors */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}

/* Dashboard Cards */
.stat-card-modern {
  border-radius: 12px; /* Lebih kecil */
  position: relative;
  transition: transform 0.3s ease;
}

.icon-container-blur {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 6px; /* Lebih kecil */
  border-radius: 8px;
}

.decor-circle {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 70px; /* Lebih kecil */
  height: 70px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

/* Sections */
.rounded-16 {
  border-radius: 16px;
}
.section-indicator {
  width: 4px;
  height: 20px;
  background: #0089ff;
  border-radius: 4px;
}

.lang-item-card {
  border-radius: 10px;
  background: #fcfdfe;
  border: 1px solid #edf2f7;
  min-height: 70px; /* Lebih pendek */
}

/* Utils */
.opacity-80 {
  opacity: 0.8;
}
.opacity-70 {
  opacity: 0.7;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
