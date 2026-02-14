<template>
  <q-page class="user-dashboard-page q-pa-md">
    <div class="q-mb-lg q-ml-xs">
      <div class="text-h5 text-weight-bold text-edulang-navy">
        Selamat Datang di, <span class="text-edulang-blue">Edulang</span>
      </div>
      <p class="text-body2 text-grey-7 q-mb-none">
        Platform literasi bahasa dengan kurikulum berstandar internasional.
      </p>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="(stat, index) in summaryData" :key="index" class="col-12 col-sm-4">
        <q-card
          flat
          class="stat-card-custom rounded-12 shadow-subtle"
          :style="{ borderLeft: `6px solid ${stat.borderColor}` }"
        >
          <q-card-section class="row items-center no-wrap q-pa-md">
            <div :class="`icon-box-md ${stat.bgClass} q-mr-md`">
              <q-icon :name="stat.icon" size="24px" :style="{ color: stat.borderColor }" />
            </div>
            <div>
              <div
                class="text-grey-7 text-weight-bold text-uppercase letter-spacing-1"
                style="font-size: 11px"
              >
                {{ stat.label }}
              </div>
              <div class="text-h6 text-weight-bolder text-edulang-navy line-height-tight">
                {{ stat.value }}
                <span class="text-subtitle2 text-weight-medium text-grey-6">Course</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card flat class="rounded-16 bg-white shadow-subtle q-pa-md full-height">
          <div class="row items-center justify-between q-mb-md q-px-xs">
            <div class="row items-center">
              <div class="accent-bar q-mr-md"></div>
              <div>
                <div class="text-subtitle1 text-weight-bolder text-edulang-navy">Course Saya</div>
                <div class="text-caption text-grey-6">Lanjutkan pembelajaran Anda</div>
              </div>
            </div>
            <q-btn
              flat
              dense
              no-caps
              color="primary"
              label="Lihat Semua"
              icon-right="arrow_forward"
              to="/dashboard/langganan"
            />
          </div>

          <div v-if="loading" class="q-pa-lg text-center">
            <q-spinner-dots color="primary" size="30px" />
          </div>

          <div v-else class="q-px-xs">
            <div
              v-for="(item, idx) in myCoursesWithProgress.slice(0, 3)"
              :key="item._id || idx"
              class="row items-center q-mb-md no-wrap"
            >
              <q-img
                :src="getThumbnail(item)"
                class="rounded-12 shadow-sm"
                style="width: 56px; height: 56px; flex-shrink: 0"
                fit="cover"
              />
              <div class="col q-ml-md">
                <div class="text-subtitle2 text-weight-bold text-edulang-navy ellipsis">
                  {{ item.title || item.name }}
                </div>
                <div class="row items-center no-wrap q-mt-xs">
                  <q-linear-progress
                    :value="Math.min(item.progress / 100, 1)"
                    size="8px"
                    rounded
                    color="primary"
                    track-color="blue-1"
                    class="col"
                  />
                  <div class="text-weight-bold text-primary q-ml-md">
                    {{ Math.round(Math.min(item.progress, 100)) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card
          flat
          class="stats-card-dark rounded-16 text-white overflow-hidden full-height relative-position shadow-subtle"
        >
          <div class="circle-decor-1"></div>
          <q-card-section class="q-pa-lg column flex-center full-height">
            <div class="row items-center self-start q-mb-md full-width">
              <q-icon name="insights" size="20px" class="q-mr-sm text-yellow-8" />
              <div class="text-subtitle1 text-weight-bold">Statistik Progres</div>
            </div>

            <q-circular-progress
              show-value
              :value="progressPercent"
              size="130px"
              :thickness="0.18"
              color="orange-5"
              track-color="white-opacity"
              class="text-white text-weight-bolder"
            >
              <div class="column items-center">
                <div class="text-h4 q-mb-none">{{ Math.round(progressPercent) }}%</div>
                <div class="text-caption text-blue-2">Rata-rata</div>
              </div>
            </q-circular-progress>

            <div class="text-center q-mt-lg text-blue-1 text-caption" style="line-height: 1.4">
              Terus tingkatkan untuk meraih sertifikat internasional!
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMyCourses } from 'src/composables/useMyCourses'

const { loading, myCourses, fetchData } = useMyCourses()

const stats = computed(() => {
  const total = myCourses.value.length
  const aktif = myCourses.value.filter((c) => (c.progress || 0) < 100).length
  const selesai = myCourses.value.filter((c) => (c.progress || 0) >= 100).length
  return { aktif, total, selesai }
})

const summaryData = computed(() => [
  {
    label: 'Aktif',
    value: stats.value.aktif,
    icon: 'play_circle_filled',
    borderColor: '#0089ff',
    bgClass: 'bg-blue-1',
  },
  {
    label: 'Terdaftar',
    value: stats.value.total,
    icon: 'collections_bookmark',
    borderColor: '#ffb300',
    bgClass: 'bg-orange-1',
  },
  {
    label: 'Selesai',
    value: stats.value.selesai,
    icon: 'stars',
    borderColor: '#00c853',
    bgClass: 'bg-green-1',
  },
])

const myCoursesWithProgress = computed(() =>
  myCourses.value.map((p) => {
    let rawProgress = p.progress ?? 0
    // Jika API mengirimkan string "35%", kita bersihkan menjadi angka
    if (typeof rawProgress === 'string') {
      rawProgress = parseInt(rawProgress.replace('%', '')) || 0
    }
    return {
      ...p,
      progress: Math.min(rawProgress, 100), // Memastikan tidak lebih dari 100
    }
  }),
)

const progressPercent = computed(() => {
  if (!myCoursesWithProgress.value.length) return 0
  const totalCourses = myCoursesWithProgress.value.length
  const sum = myCoursesWithProgress.value.reduce((acc, c) => acc + c.progress, 0)

  // Rata-rata progres keseluruhan
  const average = sum / totalCourses
  return Math.min(average, 100) // Double check agar tampilan maksimal 100%
})

function getThumbnail(pkg) {
  if (pkg?.introVideoUrl) return pkg.introVideoUrl
  if (pkg?.thumbnail || pkg?.imageUrl) return pkg.thumbnail || pkg.imageUrl
  return 'https://placehold.co/100x100?text=ED'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.user-dashboard-page {
  background: #f8fafc;
  min-height: 100vh;
}

.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.white-opacity {
  color: rgba(255, 255, 255, 0.15);
}

/* Card Styling */
.stat-card-custom {
  background: white;
  transition: transform 0.2s;
  border: 1px solid #edf2f7;
}

.icon-box-md {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shadow-subtle {
  box-shadow: 0 4px 15px rgba(0, 51, 135, 0.06);
}

.accent-bar {
  width: 4px;
  height: 28px;
  background: #0089ff;
  border-radius: 4px;
}

/* Progress Chart Card */
.stats-card-dark {
  background: linear-gradient(135deg, #003387 0%, #00235a 100%);
}

.circle-decor-1 {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 50%;
}

.line-height-tight {
  line-height: 1.1;
}
.letter-spacing-1 {
  letter-spacing: 0.8px;
}
.rounded-16 {
  border-radius: 16px;
}
.rounded-12 {
  border-radius: 12px;
}
</style>
