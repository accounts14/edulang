<template>
  <q-page class="user-langganan-page q-pa-lg q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <div class="accent-bar q-mr-md"></div>
      <div>
        <h1 class="text-h4 text-weight-bolder text-edulang-navy q-my-none">Course Saya</h1>
        <p class="text-body2 text-grey-6 q-mt-xs">
          Kelola dan lanjutkan perjalanan belajarmu di sini.
        </p>
      </div>
    </div>

    <div v-if="loading" class="row q-col-gutter-xl">
      <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
        <q-card flat class="rounded-20 bg-white border-light">
          <q-skeleton height="200px" square class="rounded-20-top" />
          <q-card-section class="q-pa-md">
            <q-skeleton type="text" class="text-h6 q-mb-sm" />
            <q-skeleton type="text" width="40%" class="q-mb-md" />
            <div class="row q-gutter-sm">
              <q-skeleton type="QBtn" class="col" />
              <q-skeleton type="QBtn" class="col" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else-if="!myCourses.length" class="empty-state-container column flex-center q-pa-xl">
      <q-icon name="menu_book" size="80px" color="grey-3" />
      <div class="text-h6 text-grey-6 q-mt-md">Belum ada course terdaftar</div>
      <q-btn
        outline
        no-caps
        color="primary"
        label="Eksplor Halaman Berlangganan"
        class="q-mt-lg rounded-12"
        :to="{ path: '/dashboard/langganan' }"
      />
    </div>

    <div v-else class="row q-col-gutter-xl">
      <div
        v-for="course in myCourses"
        :key="course._id || course.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat class="course-card-premium rounded-20 bg-white shadow-soft transition-base">
          <div class="course-card-media relative-position">
            <UserCourseThumbnail :course="course" />
            <div class="media-overlay"></div>
          </div>

          <q-card-section class="q-pa-lg">
            <div
              class="text-subtitle1 text-weight-bolder text-edulang-navy q-mb-xs ellipsis-2-lines min-height-50"
            >
              {{ course.title || course.name || 'Course' }}
            </div>

            <div class="row items-center text-caption text-grey-7 q-mb-lg">
              <q-icon name="event_note" size="16px" class="q-mr-xs" />
              <span>{{ meetingInfo(course) }}</span>
            </div>

            <div class="row q-gutter-md">
              <q-btn
                unelevated
                no-caps
                color="primary"
                class="col rounded-12 text-weight-bold"
                label="Mulai Belajar"
                icon="play_circle_outline"
                :to="{ name: 'UserLearn', params: { packageId: course._id || course.id } }"
              />
              <q-btn
                flat
                no-caps
                color="grey-7"
                class="btn-cancel rounded-12"
                label="Batalkan"
                @click="onBatalkan(course)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useMyCourses } from 'src/composables/useMyCourses'
import UserCourseThumbnail from '../../components/user/UserCourseThumbnail.vue'

const $q = useQuasar()
const { loading, myCourses, fetchData } = useMyCourses()

function meetingInfo(course) {
  const total =
    course.totalLessonsCount ??
    course.totalLessons ??
    course.totalMeeting ??
    course.total_meeting ??
    course.meetingCount ??
    (Array.isArray(course.lessons) ? course.lessons.length : 16)
  const soal = course.totalSoal ?? course.total_soal ?? total ?? 16
  return `${total} Pertemuan • ${soal} Soal`
}

function onBatalkan(course) {
  $q.dialog({
    title: '<span class="text-edulang-navy text-weight-bold">Batalkan Kelas</span>',
    message: `Apakah Anda yakin ingin membatalkan kursus <b class="text-primary">"${course.title || course.name}"</b>? Tindakan ini tidak dapat dibatalkan.`,
    html: true,
    cancel: {
      flat: true,
      label: 'Kembali',
      color: 'grey-7',
    },
    ok: {
      unelevated: true,
      label: 'Ya, Batalkan',
      color: 'negative',
      class: 'rounded-12',
    },
    persistent: true,
  }).onOk(() => {
    $q.notify({
      type: 'info',
      message: 'Permintaan pembatalan telah dikirim.',
      position: 'top',
      classes: 'rounded-12',
    })
  })
}

onMounted(async () => {
  try {
    await fetchData()
  } catch (e) {
    console.error('[UserLangganan]', e)
    $q.notify({
      type: 'negative',
      message: e.response?.data?.message || 'Gagal memuat course kamu.',
    })
  }
})
</script>

<style scoped>
/* Brand Colors */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}

.user-langganan-page {
  background: #f8fafc;
  min-height: 100vh;
}

/* Accent Header */
.accent-bar {
  width: 6px;
  height: 45px;
  background: #0089ff;
  border-radius: 10px;
}

/* Card Styling */
.course-card-premium {
  border: 1px solid rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.course-card-premium:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 51, 135, 0.1) !important;
}

.course-card-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}

.media-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.05) 100%);
  pointer-events: none;
}

/* Utility */
.rounded-20 {
  border-radius: 20px;
}
.rounded-20-top {
  border-radius: 20px 20px 0 0;
}
.rounded-16 {
  border-radius: 16px;
}
.rounded-12 {
  border-radius: 12px;
}

.shadow-soft {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.border-light {
  border: 1px solid #edf2f7;
}

.min-height-50 {
  min-height: 50px;
}

.btn-cancel {
  background: #f1f5f9;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #fee2e2;
  color: #ef4444 !important;
}

.transition-base {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.empty-state-container {
  min-height: 400px;
  border: 2px dashed #e2e8f0;
  border-radius: 24px;
  background: white;
}
</style>
