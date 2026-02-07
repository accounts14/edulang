<template>
  <q-page class="user-dashboard-page q-pa-xl">
    <!-- Welcome -->
    <div class="q-mb-xl">
      <h1 class="text-h4 text-weight-bold text-grey-9 q-mb-xs">Selamat Datang di, Edulang</h1>
      <p class="text-body1 text-grey-7">
        Platform literasi bahasa dengan kurikulum berstandar internasional dan dukungan sertifikasi
        resmi
      </p>
    </div>

    <!-- Summary cards -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="summary-card summary-card-primary rounded-borders-16">
          <q-card-section class="row items-center">
            <q-icon name="business" size="40px" color="primary" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-7">Course Bahasa Aktif</div>
              <div class="text-h6 text-weight-bold">{{ stats.courseAktif }} Course</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="summary-card summary-card-warning rounded-borders-16">
          <q-card-section class="row items-center">
            <q-icon name="folder" size="40px" color="warning" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-7">Course Bahasa Yang Terdaftar</div>
              <div class="text-h6 text-weight-bold">{{ stats.courseTerdaftar }} Course</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="summary-card summary-card-primary rounded-borders-16">
          <q-card-section class="row items-center">
            <q-icon name="check_circle" size="40px" color="primary" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-7">Course Bahasa Telah Selesai</div>
              <div class="text-h6 text-weight-bold">{{ stats.courseSelesai }} Course</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Course Saya + Course Progres row -->
    <div class="row q-col-gutter-xl">
      <!-- Course Saya -->
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="rounded-borders-16 bg-white">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="crop_square" size="24px" class="q-mr-sm text-grey-8" />
              <div>
                <div class="text-h6 text-weight-bold text-grey-9">Course Saya</div>
                <div class="text-caption text-grey-6">Course Bahasa yang terdaftar</div>
              </div>
            </div>

            <div v-if="loading" class="q-pa-lg text-center">
              <q-spinner-dots color="primary" size="32px" />
            </div>

            <div v-else-if="myCourses.length === 0" class="text-grey-7 text-body2 q-pa-md">
              Belum ada course terdaftar. Daftar dari halaman Langganan.
            </div>

            <div v-else>
              <div
                v-for="(item, idx) in myCoursesWithProgress.slice(0, 3)"
                :key="item._id || idx"
                class="row items-center q-mb-lg course-saya-item"
              >
                <q-img
                  :src="getThumbnail(item)"
                  ratio="1"
                  class="course-thumb rounded-borders"
                  style="width: 80px; min-width: 80px"
                />
                <div class="col q-ml-md">
                  <div class="text-weight-bold text-body1">{{ item.title || item.name }}</div>
                  <q-linear-progress
                    :value="item.progress !== undefined ? item.progress / 100 : 1"
                    size="8px"
                    color="teal"
                    class="q-mt-sm rounded-borders"
                  />
                  <div class="text-caption text-grey-7 q-mt-xs">
                    {{ Math.round(item.progress ?? 0) }}%
                  </div>
                </div>
              </div>
            </div>

            <q-btn
              flat
              no-caps
              color="primary"
              class="q-mt-md"
              label="Lihat Semua Kelas"
              :to="{ path: '/dashboard/langganan' }"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Course Progres (pie) -->
      <div class="col-12 col-lg-5">
        <q-card flat bordered class="rounded-borders-16 bg-white">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <q-icon name="crop_square" size="24px" class="q-mr-sm text-grey-8" />
              <div>
                <div class="text-h6 text-weight-bold text-grey-9">Course Progres</div>
                <div class="text-caption text-grey-6">Progres Course Bahasa yang terdaftar</div>
              </div>
            </div>

            <div class="flex flex-center q-pa-lg">
              <q-circular-progress
                :value="progressPercent"
                size="180px"
                :thickness="0.2"
                color="teal"
                track-color="primary"
                class="q-ma-md"
              >
                <div class="text-h5 text-weight-bold">{{ Math.round(progressPercent) }}%</div>
              </q-circular-progress>
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
  return {
    courseAktif: aktif || 0,
    courseTerdaftar: total || 0,
    courseSelesai: selesai || 0,
  }
})

const myCoursesWithProgress = computed(() =>
  myCourses.value.map((p, i) => ({ ...p, progress: p.progress ?? (i === 0 ? 100 : 60) })),
)

const progressPercent = computed(() => {
  if (!myCoursesWithProgress.value.length) return 0
  const sum = myCoursesWithProgress.value.reduce((acc, c) => acc + (c.progress || 0), 0)
  return sum / myCoursesWithProgress.value.length
})

function getThumbnail(pkg) {
  if (pkg?.introVideoUrl) return pkg.introVideoUrl
  if (pkg?.thumbnail || pkg?.imageUrl) return pkg.thumbnail || pkg.imageUrl
  return 'https://placehold.co/120x120?text=Course'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.user-dashboard-page {
  background: var(--edulang-white, #f5f7fa);
  min-height: 100%;
}
.summary-card {
  background: #fff;
}
.summary-card-primary .q-icon {
  color: var(--edulang-blue, #0089ff) !important;
}
.summary-card-warning .q-icon {
  color: var(--edulang-yellow, #ffc42c) !important;
}
.rounded-borders-16 {
  border-radius: 16px;
}
.rounded-borders {
  border-radius: 8px;
}
.course-thumb {
  border-radius: 8px;
  overflow: hidden;
}
</style>
