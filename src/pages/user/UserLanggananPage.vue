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
        :to="{ path: '/berlangganan' }"
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
              <q-icon name="event_note" size="18px" color="primary" class="q-mr-xs" />
              <span class="text-weight-medium">{{ meetingInfo(course) }}</span>
            </div>

            <div class="column q-gutter-y-md">
              <q-btn
                unelevated
                no-caps
                color="primary"
                class="full-width rounded-12 text-weight-bolder btn-main-learn"
                label="Mulai Belajar"
                icon="play_circle_filled"
                :to="{ name: 'UserLearn', params: { packageId: course._id || course.id } }"
              />

              <div class="row q-gutter-x-sm">
                <q-btn
                  unelevated
                  no-caps
                  class="col rounded-12 text-weight-bold btn-discussion-premium"
                  label="Diskusi"
                  icon="chat_bubble"
                  :to="{ name: 'UserDiscussion', params: { packageId: course._id || course.id } }"
                />

                <q-btn
                  flat
                  no-caps
                  color="grey-7"
                  class="col btn-cancel rounded-12"
                  label="Batalkan"
                  @click="onBatalkan(course)"
                />
              </div>
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
  const total = course.totalLessonsCount ?? course.totalLessons ?? course.totalMeeting ?? 16
  const soal = course.totalSoal ?? course.total_soal ?? total
  return `${total} Pertemuan • ${soal} Latihan`
}

function onBatalkan(course) {
  $q.dialog({
    title: '<span class="text-edulang-navy text-weight-bold">Batalkan Kelas</span>',
    message: `Apakah Anda yakin ingin membatalkan kursus <b class="text-primary">"${course.title || course.name}"</b>?`,
    html: true,
    cancel: { flat: true, label: 'Kembali', color: 'grey-7' },
    ok: { unelevated: true, label: 'Ya, Batalkan', color: 'negative', class: 'rounded-12' },
    persistent: true,
  }).onOk(() => {
    $q.notify({ type: 'info', message: 'Permintaan pembatalan terkirim.', position: 'top' })
  })
}

onMounted(async () => {
  try {
    await fetchData()
  } catch (e) {
    console.error('[UserLangganan]', e)
  }
})
</script>

<style scoped>
/* --- Brand Colors --- */
.text-edulang-navy {
  color: #003387;
}
.user-langganan-page {
  background: #f8fafc;
  min-height: 100vh;
}

/* --- Accent Header --- */
.accent-bar {
  width: 6px;
  height: 45px;
  background: linear-gradient(to bottom, #0089ff, #003387);
  border-radius: 10px;
}

/* --- Card Styling --- */
.course-card-premium {
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.course-card-premium:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 51, 135, 0.08) !important;
}

/* --- Button Styles --- */
.btn-main-learn {
  height: 48px;
  background: linear-gradient(45deg, #003387, #0089ff) !important;
  box-shadow: 0 4px 15px rgba(0, 137, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-main-learn:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}

/* Tombol Diskusi Premium */
.btn-discussion-premium {
  background: #eef7ff !important;
  color: #0089ff !important;
  border: 1px solid #d0e8ff;
  transition: all 0.3s ease;
}

.btn-discussion-premium:hover {
  background: #0089ff !important;
  color: white !important;
  box-shadow: 0 6px 12px rgba(0, 137, 255, 0.2);
}

.btn-cancel {
  background: #f8fafc;
  color: #64748b !important;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #fff1f2;
  color: #e11d48 !important;
  border-color: #fecaca;
}

/* --- Utilities --- */
.rounded-20 {
  border-radius: 20px;
}
.rounded-12 {
  border-radius: 12px;
}
.transition-base {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.min-height-50 {
  min-height: 50px;
}
.shadow-soft {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.course-card-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
}
</style>
