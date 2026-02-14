<template>
  <q-page class="user-progres-page q-pa-lg q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <div class="accent-bar q-mr-md shadow-brand"></div>
      <div>
        <h1
          class="text-h4 text-weight-bolder text-edulang-navy q-my-none font-outfit gradient-text"
        >
          Progres & Sertifikat
        </h1>
        <p class="text-body2 text-grey-7 q-mt-xs font-poppins">
          Pantau langkah masa depanmu dan klaim sertifikat keberhasilanmu.
        </p>
      </div>
    </div>

    <div v-if="loading" class="row q-col-gutter-lg">
      <div v-for="n in 3" :key="n" class="col-12 col-sm-6 col-md-4">
        <q-card flat class="rounded-20 border-light shadow-soft">
          <q-skeleton height="180px" square class="rounded-20-top" />
          <q-card-section>
            <q-skeleton type="text" width="80%" class="q-mb-md" />
            <q-skeleton type="QBtn" height="36px" class="q-mb-sm rounded-12" />
            <q-skeleton type="QBtn" height="36px" class="rounded-12" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else-if="!myCourses.length" class="empty-state-container column flex-center q-pa-xl">
      <q-icon name="explore" size="100px" color="grey-3" />
      <div class="text-h6 text-grey-5 q-mt-md font-outfit">
        Belum ada petualangan belajar dimulai
      </div>
      <q-btn
        unelevated
        color="edulang-blue"
        label="Cari Kelas"
        no-caps
        class="q-mt-md rounded-12"
      />
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div v-for="course in courseWithProgress" :key="course.id" class="col-12 col-sm-6 col-md-4">
        <q-card
          flat
          class="course-card-premium rounded-20 bg-white shadow-brand transition-base border-light"
        >
          <div class="course-card-media relative-position">
            <UserCourseThumbnail :course="course" />
            <div
              class="progress-badge-container"
              :class="course.isComplete ? 'complete' : 'in-progress'"
            >
              <q-icon :name="course.isComplete ? 'stars' : 'bolt'" size="14px" class="q-mr-xs" />
              {{ course.progressPercent }}%
            </div>
          </div>

          <q-card-section class="q-pa-lg">
            <div
              class="text-subtitle1 text-weight-bolder text-edulang-navy q-mb-md ellipsis-2-lines min-height-50 font-outfit line-height-tight"
            >
              {{ course.title }}
            </div>

            <q-linear-progress
              :value="course.progressPercent / 100"
              :color="course.isComplete ? 'positive' : 'edulang-blue'"
              class="q-mb-lg rounded-12"
              size="6px"
            />

            <div class="column q-gutter-y-sm">
              <q-btn
                unelevated
                no-caps
                outline
                color="edulang-blue"
                class="full-width rounded-12 text-weight-bold btn-review"
                label="Beri Ulasan"
                icon="rate_review"
                :to="{ name: 'UserReview', params: { packageId: course.id } }"
              />

              <q-btn
                unelevated
                no-caps
                :color="course.isComplete ? 'edulang-navy' : 'grey-3'"
                :text-color="course.isComplete ? 'white' : 'grey-6'"
                class="full-width rounded-12 text-weight-bolder btn-action shadow-sm"
                :label="course.isComplete ? 'Unduh Sertifikat' : 'Masih Berproses'"
                :icon="course.isComplete ? 'workspace_premium' : 'schedule'"
                :disable="!course.isComplete"
                @click="onGenerateCertificate(course)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useMyCourses } from 'src/composables/useMyCourses'
import UserCourseThumbnail from '../../components/user/UserCourseThumbnail.vue'

const $q = useQuasar()
const router = useRouter() // Pastikan sudah import { useRouter } from 'vue-router'

// --- PERBAIKAN DI SINI ---
// Kita ambil myCourses dan fetchData secara benar.
// Kita tidak butuh variabel loading dari composable karena kita sudah punya 'loading' lokal di bawah.
const { myCourses, fetchData } = useMyCourses()

const loading = ref(true)
const courseWithProgress = ref([])

const fetchAllProgress = async () => {
  loading.value = true
  try {
    // 1. Jalankan fetchData untuk mengisi ref 'myCourses'
    await fetchData()

    // 2. Cek apakah data tersedia di myCourses.value
    if (!myCourses.value || myCourses.value.length === 0) {
      courseWithProgress.value = []
      return
    }

    // 3. Ambil progres untuk setiap course (Sesuai endpoint di Gambar 2)
    const progressPromises = myCourses.value.map(async (course) => {
      // Pastikan ID diambil dengan benar (id atau _id)
      const courseId = course.id || course._id

      try {
        const res = await api.get(`/userprogress/my-progress/${courseId}`)

        // Ambil string percentage (contoh: "35%") dari response data
        const percentStr = res.data?.data?.percentage || '0%'
        const percentValue = parseInt(percentStr.replace('%', ''))

        return {
          ...course,
          id: courseId, // Pastikan id konsisten untuk keperluan :to route
          progressPercent: percentValue,
          isComplete: percentValue >= 100,
        }
      } catch (err) {
        console.error(`Gagal ambil progres ID: ${courseId}`, err)
        return {
          ...course,
          id: courseId,
          progressPercent: 0,
          isComplete: false,
        }
      }
    })

    courseWithProgress.value = await Promise.all(progressPromises)
  } catch (error) {
    console.error('Error fetchAllProgress:', error)
    $q.notify({ type: 'negative', message: 'Gagal memuat data progres' })
  } finally {
    loading.value = false
  }
}

function onGenerateCertificate(course) {
  router.push({
    name: 'UserPackageScore',
    params: { packageId: course.id },
  })
}

onMounted(() => {
  fetchAllProgress()
})
</script>

<style scoped>
/* Color Identity */
.text-edulang-navy {
  color: #003387 !important;
}
.bg-edulang-navy {
  background-color: #003387 !important;
}
.bg-edulang-blue {
  background-color: #0089ff !important;
}
.text-edulang-blue {
  color: #0089ff !important;
}

/* Font Stubs */
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.user-progres-page {
  background: #f5f7fa; /* Edulang White dari Guideline */
  min-height: 100vh;
}

.gradient-text {
  background: linear-gradient(45deg, #003387, #0089ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.accent-bar {
  width: 6px;
  height: 50px;
  background: linear-gradient(to bottom, #ffc42c, #0089ff); /* Kuning ke Biru */
  border-radius: 10px;
}

.course-card-premium {
  overflow: hidden;
  border: 1px solid rgba(0, 51, 135, 0.05);
}

.course-card-premium:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 51, 135, 0.12) !important;
}

.course-card-media {
  aspect-ratio: 16 / 9;
  border-bottom: 4px solid #0089ff;
}

.progress-badge-container {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 30px;
  color: white;
  font-weight: 800;
  font-size: 13px;
  z-index: 2;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.progress-badge-container.complete {
  background: rgba(76, 175, 80, 0.9); /* Success Green */
}

.progress-badge-container.in-progress {
  background: rgba(0, 137, 255, 0.9); /* Edulang Blue */
}

.shadow-brand {
  box-shadow: 0 10px 25px -5px rgba(0, 51, 135, 0.08) !important;
}

.rounded-20 {
  border-radius: 20px;
}
.rounded-12 {
  border-radius: 12px;
}
.min-height-50 {
  min-height: 50px;
}
.line-height-tight {
  line-height: 1.3;
}

.btn-review:hover {
  background: rgba(0, 137, 255, 0.05);
}

.btn-action {
  transition: all 0.3s;
}

.border-light {
  border: 1px solid #edf2f7;
}

.transition-base {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
