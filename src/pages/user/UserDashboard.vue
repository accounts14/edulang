<template>
  <q-page class="user-dashboard-page q-pa-lg q-pa-md-xl">
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bolder text-edulang-navy q-mb-xs">
        Selamat Datang di, <span class="text-edulang-blue">Edulang</span>
      </h1>
      <p class="text-body1 text-grey-7 max-width-600">
        Platform literasi bahasa dengan kurikulum berstandar internasional dan dukungan sertifikasi
        resmi.
      </p>
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div v-for="(stat, index) in summaryData" :key="index" class="col-12 col-sm-4">
        <q-card flat class="summary-card rounded-20 shadow-soft" :class="stat.borderClass">
          <q-card-section class="row items-center no-wrap">
            <div :class="`icon-box ${stat.bgClass} q-mr-md`">
              <q-icon :name="stat.icon" size="32px" :color="stat.color" />
            </div>
            <div>
              <div
                class="text-caption text-grey-7 text-uppercase text-weight-bold letter-spacing-1"
              >
                {{ stat.label }}
              </div>
              <div class="text-h5 text-weight-bolder text-edulang-navy">
                {{ stat.value }} Course
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-7">
        <q-card flat class="rounded-20 bg-white shadow-soft full-height">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-xl">
              <div class="row items-center">
                <div class="accent-bar q-mr-md"></div>
                <div>
                  <div class="text-h6 text-weight-bolder text-edulang-navy">Course Saya</div>
                  <div class="text-caption text-grey-6">Lanjutkan pembelajaran Anda</div>
                </div>
              </div>
              <q-btn
                flat
                no-caps
                color="primary"
                label="Lihat Semua"
                :to="{ path: '/dashboard/langganan' }"
                icon-right="arrow_forward"
                class="rounded-12"
              />
            </div>

            <div v-if="loading" class="q-pa-xl text-center">
              <q-spinner-ring color="primary" size="40px" />
            </div>

            <div
              v-else-if="myCourses.length === 0"
              class="text-grey-7 text-body2 q-pa-xl text-center border-dashed rounded-16"
            >
              <q-icon name="history_edu" size="48px" color="grey-4" class="q-mb-sm" />
              <div>Belum ada course terdaftar. Yuk, cari kelas baru!</div>
            </div>

            <div v-else>
              <div
                v-for="(item, idx) in myCoursesWithProgress.slice(0, 3)"
                :key="item._id || idx"
                class="row items-center q-mb-lg course-row transition-base"
              >
                <q-img
                  :src="getThumbnail(item)"
                  ratio="1"
                  class="course-thumb rounded-16 shadow-subtle"
                  style="width: 85px; min-width: 85px"
                />
                <div class="col q-ml-lg">
                  <div class="text-weight-bolder text-subtitle1 text-edulang-navy q-mb-xs">
                    {{ item.title || item.name }}
                  </div>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <q-linear-progress
                        :value="item.progress !== undefined ? item.progress / 100 : 1"
                        size="10px"
                        color="primary"
                        track-color="blue-1"
                        class="rounded-borders"
                      />
                    </div>
                    <div class="text-caption text-weight-bold text-primary q-ml-md">
                      {{ Math.round(item.progress ?? 0) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-5">
        <q-card
          flat
          class="rounded-20 bg-edulang-navy text-white shadow-navy overflow-hidden relative-position full-height"
        >
          <div class="abs-decor"></div>

          <q-card-section class="q-pa-lg relative-position">
            <div class="row items-center q-mb-xl">
              <q-icon name="insights" size="24px" class="q-mr-sm text-edulang-yellow" />
              <div class="text-h6 text-weight-bolder">Statistik Progres</div>
            </div>

            <div class="flex flex-center q-pa-md">
              <q-circular-progress
                show-value
                :value="progressPercent"
                size="200px"
                :thickness="0.15"
                color="edulang-yellow"
                track-color="blue-9"
                class="text-white text-weight-bolder"
              >
                <div class="column items-center">
                  <div class="text-h4">{{ Math.round(progressPercent) }}%</div>
                  <div class="text-caption text-blue-2">Rata-rata</div>
                </div>
              </q-circular-progress>
            </div>

            <div class="text-center q-mt-lg text-blue-2 text-body2">
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

// Gabungkan semua logic stats dan summaryData di sini agar tidak konflik
const stats = computed(() => {
  const total = myCourses.value.length
  const aktif = myCourses.value.filter((c) => (c.progress || 0) < 100).length
  const selesai = myCourses.value.filter((c) => (c.progress || 0) >= 100).length
  return {
    courseAktif: aktif || 0,
    courseTerdaftar: total || 0,
    courseSelesai: selesai || 0,
  }
})

const summaryData = computed(() => [
  {
    label: 'Course Aktif',
    value: stats.value.courseAktif,
    icon: 'business',
    color: 'primary',
    bgClass: 'bg-blue-1',
    borderClass: 'border-blue',
  },
  {
    label: 'Terdaftar',
    value: stats.value.courseTerdaftar,
    icon: 'folder',
    color: 'warning',
    bgClass: 'bg-orange-1',
    borderClass: 'border-yellow',
  },
  {
    label: 'Telah Selesai',
    value: stats.value.courseSelesai,
    icon: 'check_circle',
    color: 'primary',
    bgClass: 'bg-blue-1',
    borderClass: 'border-blue',
  },
])

const myCoursesWithProgress = computed(() =>
  myCourses.value.map((p, i) => ({
    ...p,
    progress: p.progress ?? (i === 0 ? 100 : 60),
  })),
)

const progressPercent = computed(() => {
  if (!myCoursesWithProgress.value.length) return 0
  const sum = myCoursesWithProgress.value.reduce((acc, c) => acc + (c.progress || 0), 0)
  return sum / myCoursesWithProgress.value.length
})

function getThumbnail(pkg) {
  if (pkg?.introVideoUrl) return pkg.introVideoUrl
  if (pkg?.thumbnail || pkg?.imageUrl) return pkg.thumbnail || pkg.imageUrl
  return 'https://placehold.co/120x120?text=Edulang'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Edulang Brand Colors */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-navy {
  background-color: #003387;
}
.bg-edulang-yellow {
  background-color: #ffc42c;
}

.user-dashboard-page {
  background: #f8fafc; /* White-Grey background */
  min-height: 100vh;
}

/* Card Improvements */
.summary-card {
  background: #ffffff;
  border: 1px solid #edf2f7;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 51, 135, 0.08);
}

.border-blue {
  border-left: 6px solid #0089ff;
}
.border-yellow {
  border-left: 6px solid #ffc42c;
}

.icon-box {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

/* Utilities */
.rounded-20 {
  border-radius: 20px;
}
.rounded-16 {
  border-radius: 16px;
}
.rounded-12 {
  border-radius: 12px;
}

.accent-bar {
  width: 6px;
  height: 38px;
  background: #0089ff;
  border-radius: 10px;
}

.shadow-soft {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}
.shadow-subtle {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.shadow-navy {
  box-shadow: 0 15px 35px rgba(0, 51, 135, 0.25);
}

.letter-spacing-1 {
  letter-spacing: 1px;
}
.max-width-600 {
  max-width: 600px;
}

.course-row:hover .course-thumb {
  transform: scale(1.05);
}
.transition-base {
  transition: all 0.3s ease;
}

/* Dashboard Accent Shape */
.abs-decor {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  z-index: 0;
}

.border-dashed {
  border: 2px dashed #e2e8f0;
}
</style>
