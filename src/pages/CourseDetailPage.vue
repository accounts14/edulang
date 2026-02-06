<template>
  <q-page class="q-pa-xl bg-blue-1">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="!course" class="text-center q-pa-xl">
      <q-icon name="error_outline" size="64px" color="negative" class="q-mb-md" />
      <div class="text-h6 text-grey-9">Course tidak ditemukan</div>
      <q-btn class="q-mt-md" color="primary" unelevated no-caps label="Kembali" @click="goBack" />
    </div>

    <div v-else class="row q-col-gutter-xl">
      <!-- Left: detail course -->
      <div class="col-12 col-lg-8">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg">
          <div class="text-caption text-grey-6 q-mb-xs">
            {{ course.languageType?.name || 'Course' }}
          </div>
          <div class="text-h5 text-weight-bolder text-indigo-10">
            {{ course.title || course.name }}
          </div>
          <div class="text-subtitle1 text-weight-bolder text-primary q-mt-sm">
            {{ priceDisplay }}
          </div>

          <q-separator spaced />

          <q-img
            :src="heroImage"
            :ratio="16 / 9"
            class="rounded-borders-16 q-mb-lg"
            v-if="heroImage"
          />

          <div class="text-subtitle2 text-weight-bold text-indigo-10 q-mb-sm">Detail</div>
          <div class="text-body2 text-grey-8" style="white-space: pre-line">
            {{ course.description || '-' }}
          </div>
        </q-card>

        <!-- Similar courses -->
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg q-mt-lg">
          <div class="text-caption text-orange-9 text-weight-bold">
            Similar Program
          </div>
          <div class="text-h6 text-weight-bolder text-indigo-10 q-mb-md">
            Program Unggulan Lainnya
          </div>

          <div v-if="similarCourses.length === 0" class="text-grey-7">
            Belum ada program serupa.
          </div>

          <div v-else class="row q-col-gutter-md">
            <div
              v-for="item in similarCourses"
              :key="item._id || item.id"
              class="col-12 col-md-4"
            >
              <CourseCard :course="item" />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Right: ringkasan & CTA -->
      <div class="col-12 col-lg-4">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg sticky-card">
          <div class="text-subtitle1 text-weight-bolder text-indigo-10 q-mb-xs">
            Ringkasan Kelas
          </div>
          <div class="text-caption text-grey-7 q-mb-md">
            Pastikan jadwal dan investasimu sebelum checkout.
          </div>

          <q-separator spaced />

          <div class="q-mb-sm">
            <div class="row items-center justify-between">
              <span class="text-body2 text-grey-7">Harga Kelas</span>
              <span class="text-body2 text-weight-bold">{{ priceDisplay }}</span>
            </div>
          </div>

          <div class="q-mb-sm">
            <div class="row items-center justify-between">
              <span class="text-body2 text-grey-7">Total Pertemuan</span>
              <span class="text-body2 text-weight-bold">
                {{ totalMeetingLabel }}
              </span>
            </div>
          </div>

          <q-separator spaced />

          <q-btn
            color="warning"
            text-color="black"
            unelevated
            no-caps
            class="full-width q-py-sm text-weight-bold q-mt-sm"
            label="Beli Kelas Sekarang"
            @click="goToBuy"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CourseCard from 'components/Subscription/CourseCard.vue'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const course = ref(null)
const similarCourses = ref([])

const priceDisplay = computed(() => {
  const price = course.value?.price || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)
})

const totalMeetingLabel = computed(() => {
  const total =
    course.value?.totalMeeting || course.value?.total_meeting || course.value?.meetingCount
  if (!total) return 'Jadwal menyesuaikan'
  return `${total} Pertemuan`
})

const heroImage = computed(
  () => course.value?.imageUrl || course.value?.thumbnail || 'https://cdn.quasar.dev/img/parallax2.jpg',
)

const goBack = () => {
  router.back()
}

const goToBuy = () => {
  const id = route.params.id
  if (!id) return
  router.push(`/courses/${id}/buy`)
}

async function fetchDetailAndSimilar() {
  loading.value = true
  try {
    const id = route.params.id
    const res = await api.get(`/packages/${id}`)
    const data = res.data || {}
    const pkg = data.package || data.data || data
    course.value = pkg

    // ambil beberapa course lain dengan bahasa yang sama
    const allRes = await api.get('/packages')
    const allData = allRes.data || {}
    const allList = allData.packages || allData.data || (Array.isArray(allData) ? allData : [])
    const langId =
      typeof pkg.languageType === 'object'
        ? pkg.languageType?._id || pkg.languageType?.id
        : pkg.languageType
    similarCourses.value = (allList || [])
      .filter((p) => {
        const pLang =
          typeof p.languageType === 'object'
            ? p.languageType?._id || p.languageType?.id
            : p.languageType
        return String(pLang) === String(langId) && String(p._id || p.id) !== String(id)
      })
      .slice(0, 3)
  } catch (error) {
    console.error('[CourseDetail] error', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat detail course.',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetailAndSimilar()
})
</script>

<style scoped>
.rounded-borders-16 {
  border-radius: 16px;
}

.sticky-card {
  position: sticky;
  top: 96px;
}
</style>

