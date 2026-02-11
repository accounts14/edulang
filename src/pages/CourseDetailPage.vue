<template>
  <q-page class="q-pa-lg q-pa-md-xl bg-edulang-white">
    <div v-if="loading" class="flex flex-center q-pa-xl" style="min-height: 400px">
      <q-spinner-cube color="primary" size="60px" />
    </div>

    <div v-else-if="!course" class="column flex-center q-pa-xl bg-white rounded-24 shadow-soft">
      <q-icon name="search_off" size="80px" color="grey-4" class="q-mb-md" />
      <div class="text-h5 text-weight-bold text-edulang-navy">Course tidak ditemukan</div>
      <p class="text-grey-6">Mungkin link sudah kedaluwarsa atau paket telah dihapus.</p>
      <q-btn
        class="q-mt-lg rounded-12 q-px-xl"
        color="primary"
        unelevated
        no-caps
        label="Kembali ke Katalog"
        icon="arrow_back"
        @click="goBack"
      />
    </div>

    <div v-else class="row q-col-gutter-xl">
      <div class="col-12 col-lg-8">
        <q-card
          flat
          class="rounded-24 bg-white q-pa-lg q-pa-md-xl shadow-premium border-light overflow-hidden"
        >
          <div class="absolute-top-right accent-decoration"></div>

          <div class="row items-center q-mb-md">
            <q-badge outline color="primary" class="q-px-md q-py-xs rounded-8 text-weight-bold">
              {{ course.languageType?.name || 'Program Edulang' }}
            </q-badge>
          </div>

          <h1 class="text-h4 text-weight-bolder text-edulang-navy q-my-none line-height-tight">
            {{ course.title || course.name }}
          </h1>

          <div class="text-h5 text-weight-bold text-edulang-blue q-mt-md">
            {{ priceDisplay }}
          </div>

          <q-separator spaced class="q-my-xl opacity-50" />

          <div class="video-wrapper shadow-navy q-mb-xl">
            <div class="video-container-small rounded-16 overflow-hidden">
              <IntroVideoThumbnail :course="course" />
            </div>
            <div class="video-caption text-center q-pa-sm text-caption text-grey-6 italic">
              <q-icon name="play_circle" color="primary" /> Tonton Video Pengenalan Kelas
            </div>
          </div>

          <div class="section-title row items-center q-mb-md">
            <div class="accent-line-blue q-mr-sm"></div>
            <div class="text-subtitle1 text-weight-bolder text-edulang-navy">Tentang Kelas Ini</div>
          </div>

          <div class="text-body1 text-grey-8 line-height-relaxed" style="white-space: pre-line">
            {{ course.description || 'Belum ada deskripsi detail untuk program ini.' }}
          </div>
        </q-card>

        <div class="q-mt-xl">
          <div class="row items-center justify-between q-mb-lg">
            <div class="column">
              <div class="text-overline text-edulang-yellow text-weight-bolder">REKOMENDASI</div>
              <div class="text-h5 text-weight-bolder text-edulang-navy">
                Program Unggulan Lainnya
              </div>
            </div>
            <q-btn flat color="primary" no-caps label="Lihat Semua" icon-right="chevron_right" />
          </div>

          <div v-if="similarCourses.length === 0" class="text-center q-pa-xl bg-grey-2 rounded-24">
            <div class="text-grey-6">Belum ada program serupa saat ini.</div>
          </div>

          <div v-else class="row q-col-gutter-lg">
            <div v-for="item in similarCourses" :key="item._id || item.id" class="col-12 col-md-4">
              <CourseCard :course="item" class="similar-card shadow-soft" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <q-card
          flat
          class="rounded-24 bg-white q-pa-xl sticky-card shadow-premium border-edulang-blue"
        >
          <div class="text-h6 text-weight-bolder text-edulang-navy q-mb-xs">Ringkasan Kelas</div>
          <p class="text-caption text-grey-6 q-mb-lg">Pastikan detail pesanan sudah sesuai.</p>

          <div class="summary-box q-pa-md rounded-16 bg-edulang-white q-mb-lg">
            <div class="row items-center justify-between q-mb-sm">
              <span class="text-body2 text-grey-7">Investasi</span>
              <span class="text-body1 text-weight-bolder text-edulang-navy">{{
                priceDisplay
              }}</span>
            </div>
            <div class="row items-center justify-between">
              <span class="text-body2 text-grey-7">Sesi Belajar</span>
              <div class="row items-center text-edulang-blue">
                <q-icon name="event_repeat" size="18px" class="q-mr-xs" />
                <span class="text-body2 text-weight-bold">{{ totalMeetingLabel }}</span>
              </div>
            </div>
          </div>

          <div class="benefit-list q-mb-xl">
            <div class="row items-center q-mb-sm text-grey-8">
              <q-icon name="check_circle" color="positive" class="q-mr-sm" />
              <span class="text-caption">Akses Selamanya</span>
            </div>
            <div class="row items-center q-mb-sm text-grey-8">
              <q-icon name="check_circle" color="positive" class="q-mr-sm" />
              <span class="text-caption">Sertifikat Resmi Edulang</span>
            </div>
          </div>

          <q-btn
            color="warning"
            text-color="edulang-navy"
            unelevated
            no-caps
            class="full-width q-py-md rounded-16 text-weight-bolder btn-buy-glow"
            label="Beli Kelas Sekarang"
            icon-right="shopping_cart_checkout"
            @click="goToBuy"
          />

          <div class="text-center q-mt-md">
            <q-icon name="security" size="xs" color="grey-5" class="q-mr-xs" />
            <span class="text-grey-5" style="font-size: 10px">Pembayaran Aman & Terverifikasi</span>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// LOGIC TETAP SAMA SEPERTI ASLINYA (Script setup dari user)
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CourseCard from 'components/Subscription/CourseCard.vue'
import IntroVideoThumbnail from 'components/Common/IntroVideoThumbnail.vue'

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
  if (!total) return 'Jadwal fleksibel'
  return `${total} Pertemuan`
})

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

    course.value = {
      ...pkg,
      thumbnail:
        pkg.image ||
        pkg.imageUrl ||
        pkg.thumbnail ||
        pkg.image_url ||
        pkg.thumbnail_url ||
        pkg.banner,
    }

    const allRes = await api.get('/packages')
    const allData = allRes.data || {}
    const allList = allData.packages || allData.data || (Array.isArray(allData) ? allData : [])
    const filtered = (allList || []).filter((p) => String(p._id || p.id) !== String(id))

    similarCourses.value = filtered.slice(0, 3).map((item) => ({
      ...item,
      thumbnail: item.image || item.imageUrl || item.thumbnail || item.image_url || item.banner,
    }))
  } catch (error) {
    console.error('[CourseDetail] error', error)
    $q.notify({ type: 'negative', message: 'Gagal memuat detail course.' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetailAndSimilar()
})
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId && newId !== oldId) fetchDetailAndSimilar()
  },
)
</script>

<style scoped>
/* Edulang Brand Colors - Page 14 */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.text-edulang-yellow {
  color: #ffc42c;
}
.bg-edulang-white {
  background-color: #f5f7fa;
}

/* Layout & Geometry */
.rounded-24 {
  border-radius: 24px;
}
.rounded-16 {
  border-radius: 16px;
}
.rounded-12 {
  border-radius: 12px;
}
.rounded-8 {
  border-radius: 8px;
}

/* Shadow Premium */
.shadow-premium {
  box-shadow: 0 20px 50px rgba(0, 51, 135, 0.08);
}
.shadow-soft {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}
.shadow-navy {
  box-shadow: 0 15px 35px rgba(0, 51, 135, 0.15);
}

.border-light {
  border: 1px solid rgba(0, 51, 135, 0.05);
}

.border-edulang-blue {
  border: 2px solid rgba(0, 137, 255, 0.1);
}

/* Decorations */
.accent-decoration {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(0, 137, 255, 0.05) 0%, transparent 70%);
  margin-top: -50px;
  margin-right: -50px;
  border-radius: 50%;
}

.accent-line-blue {
  width: 5px;
  height: 24px;
  background: #0089ff;
  border-radius: 10px;
}

/* Video & Content */
.video-wrapper {
  background: white;
  padding: 12px;
  border-radius: 20px;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.video-container-small {
  background: #000;
  aspect-ratio: 16 / 9;
}

.line-height-tight {
  line-height: 1.2;
}
.line-height-relaxed {
  line-height: 1.8;
}

/* Sticky Card */
.sticky-card {
  position: sticky;
  top: 40px;
  z-index: 10;
  transition: transform 0.3s ease;
}

.summary-box {
  border: 1px dashed rgba(0, 51, 135, 0.2);
}

/* Buttons */
.btn-buy-glow {
  box-shadow: 0 10px 25px rgba(255, 196, 44, 0.4);
  transition: all 0.3s ease;
}

.btn-buy-glow:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(255, 196, 44, 0.6);
}

.similar-card {
  transition: transform 0.3s ease;
}
.similar-card:hover {
  transform: translateY(-8px);
}

@media (max-width: 1024px) {
  .sticky-card {
    position: relative;
    top: 0;
    margin-top: 40px;
  }
}
</style>
