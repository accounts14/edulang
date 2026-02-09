<template>
  <q-page class="user-langganan-page q-pa-xl">
    <h1 class="text-h5 text-weight-bold text-grey-9 q-mb-xl">Course Saya</h1>

    <div v-if="loading" class="row q-col-gutter-lg">
      <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="rounded-borders-16">
          <q-skeleton height="180px" square />
          <q-card-section>
            <q-skeleton type="text" class="text-h6" />
            <q-skeleton type="text" width="60%" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else-if="!myCourses.length" class="text-grey-7 text-body1">
      Belum ada course terdaftar. Daftar dari halaman Berlangganan.
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="course in myCourses"
        :key="course._id || course.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card flat bordered class="course-card rounded-borders-16 bg-white">
          <!-- Thumbnail / Intro video (playable embed) -->
          <div class="course-card-media">
            <UserCourseThumbnail :course="course" />
          </div>

          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-xs">
              {{ course.title || course.name || 'Course' }}
            </div>
            <div class="text-caption text-grey-7 q-mb-md">
              {{ meetingInfo(course) }}
            </div>

            <div class="row q-gutter-sm">
              <q-btn
                unelevated
                no-caps
                color="primary"
                class="col text-weight-bold"
                label="Mulai Belajar"
                :to="{ name: 'UserLearn', params: { packageId: course._id || course.id } }"
              />
              <q-btn
                unelevated
                no-caps
                color="negative"
                class="col text-weight-bold"
                label="Batalkan Kelas"
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
  return `${total} Pertemuan - ${soal} Soal`
}

function onBatalkan(course) {
  $q.dialog({
    title: 'Batalkan Kelas',
    message: `Yakin ingin membatalkan "${course.title || course.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // TODO: panggil API cancel enrollment
    $q.notify({ type: 'info', message: 'Fitur batalkan akan dihubungkan ke API.' })
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
.user-langganan-page {
  background: var(--edulang-white, #f5f7fa);
  min-height: 100%;
}
.rounded-borders-16 {
  border-radius: 16px;
}
.course-card-media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}
</style>
