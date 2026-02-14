<template>
  <q-page class="user-progres-page q-pa-lg q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <div class="accent-bar q-mr-md"></div>
      <div>
        <h1 class="text-h4 text-weight-bolder text-edulang-navy q-my-none">Progres & Sertifikat</h1>
        <p class="text-body2 text-grey-6 q-mt-xs">
          Pantau progresmu dan klaim sertifikat setelah menyelesaikan kelas.
        </p>
      </div>
    </div>

    <div v-if="loading" class="row q-col-gutter-xl">
      <div v-for="n in 3" :key="n" class="col-12 col-sm-6 col-md-4">
        <q-card flat class="rounded-20">
          <q-skeleton height="200px" square class="rounded-20-top" />
          <q-card-section>
            <q-skeleton type="text" class="q-mb-sm" />
            <q-skeleton type="QBtn" height="40px" class="q-mb-sm" />
            <q-skeleton type="QBtn" height="40px" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else-if="!myCourses.length" class="empty-state-container column flex-center q-pa-xl">
      <q-icon name="auto_awesome" size="80px" color="grey-3" />
      <div class="text-h6 text-grey-6 q-mt-md">Belum ada progres belajar</div>
    </div>

    <div v-else class="row q-col-gutter-xl">
      <div v-for="course in courseWithProgress" :key="course.id" class="col-12 col-sm-6 col-md-4">
        <q-card flat class="course-card-premium rounded-20 bg-white shadow-soft transition-base">
          <div class="course-card-media relative-position">
            <UserCourseThumbnail :course="course" />
            <div class="progress-badge" :class="course.isComplete ? 'bg-positive' : 'bg-orange'">
              {{ course.progressPercent }}%
            </div>
          </div>

          <q-card-section class="q-pa-lg">
            <div
              class="text-subtitle1 text-weight-bolder text-edulang-navy q-mb-md ellipsis-2-lines min-height-50"
            >
              {{ course.title }}
            </div>

            <div class="column q-gutter-y-sm">
              <q-btn
                unelevated
                no-caps
                color="primary"
                outline
                class="full-width rounded-12 text-weight-bold"
                label="Rating & Review"
                icon="star_outline"
                :to="{ name: 'UserReview', params: { packageId: course.id } }"
              />

              <q-btn
                unelevated
                no-caps
                :color="course.isComplete ? 'positive' : 'grey-4'"
                :text-color="course.isComplete ? 'white' : 'grey-7'"
                class="full-width rounded-12 text-weight-bolder"
                :label="course.isComplete ? 'Generate Sertifikat' : 'Belum Selesai'"
                :icon="course.isComplete ? 'card_membership' : 'lock'"
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
import { useMyCourses } from 'src/composables/useMyCourses'
import UserCourseThumbnail from '../../components/user/UserCourseThumbnail.vue'

const $q = useQuasar()

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
  $q.notify({
    type: 'positive',
    message: `Menyiapkan sertifikat untuk ${course.title}...`,
    icon: 'card_membership',
  })
}

onMounted(() => {
  fetchAllProgress()
})
</script>

<style scoped>
.text-edulang-navy {
  color: #003387;
}
.user-progres-page {
  background: #f8fafc;
  min-height: 100vh;
}

.accent-bar {
  width: 6px;
  height: 45px;
  background: linear-gradient(to bottom, #0089ff, #003387);
  border-radius: 10px;
}

.course-card-premium {
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.course-card-premium:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 51, 135, 0.1) !important;
}

.course-card-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.progress-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 12px;
  z-index: 2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
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
.transition-base {
  transition: all 0.3s ease;
}
</style>
