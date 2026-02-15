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

    <div v-else>
      <div class="row q-col-gutter-xl">
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

            <div class="price-breakdown q-mt-md q-mb-lg">
              <div class="text-h5 text-weight-bold text-edulang-blue mb-price-final">
                {{ priceDisplay }}
              </div>
              <div v-if="showPriceBreakdown" class="price-details row q-gutter-xs q-mt-xs">
                <div class="col-6">
                  <div class="text-caption text-grey-6">Pajak Standar (PPN)</div>
                  <div class="text-body2 text-weight-bold text-edulang-navy">
                    {{ formatCurrency(priceInfo.ppn) }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-6">Biaya Dukungan Sistem</div>
                  <div class="text-body2 text-weight-bold text-edulang-navy">
                    {{ formatCurrency(priceInfo.operational) }}
                  </div>
                </div>
              </div>
              <div class="text-caption text-grey-5 q-mt-xs total-price-label">
                Investasi Total: {{ formatCurrency(totalPayment) }}
              </div>
            </div>

            <q-separator spaced class="q-my-xl opacity-50" />

            <div class="row q-col-gutter-md items-center q-mb-xl">
              <div class="col-11">
                <div class="video-wrapper shadow-navy no-margin">
                  <div class="video-container-small rounded-16 overflow-hidden bg-black">
                    <q-video
                      v-if="activePreviewUrl"
                      :src="getEmbedUrl(activePreviewUrl)"
                      class="full-height full-width"
                    />
                    <div v-else class="flex flex-center full-height text-white bg-grey-9">
                      <p>Video preview tidak tersedia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-1">
                <div class="column q-gutter-y-lg items-center">
                  <div
                    @click="selectedPreview = 'intro'"
                    class="preview-line bg-primary"
                    :class="{ active: selectedPreview === 'intro' }"
                  >
                    <q-tooltip anchor="center right" self="center left">Video Intro</q-tooltip>
                  </div>
                  <div
                    v-for="n in 3"
                    :key="n"
                    @click="selectedPreview = n"
                    class="preview-line"
                    :class="[getLineColor(n), { active: selectedPreview === n }]"
                  >
                    <q-tooltip anchor="center right" self="center left"
                      >Pertemuan {{ n }}</q-tooltip
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center q-mb-xl text-caption text-grey-6 italic">
              <q-icon name="ads_click" color="primary" /> Klik garis warna untuk ganti video
            </div>

            <div class="section-title row items-center q-mb-md">
              <div class="accent-line-blue q-mr-sm"></div>
              <div class="text-subtitle1 text-weight-bolder text-edulang-navy">
                Tentang Kelas Ini
              </div>
            </div>

            <div class="text-body1 text-grey-8 line-height-relaxed" style="white-space: pre-line">
              {{ course.description || 'Belum ada deskripsi detail untuk program ini.' }}
            </div>
          </q-card>
        </div>

        <div class="col-12 col-lg-4">
          <q-card
            flat
            class="rounded-24 bg-white q-pa-xl sticky-card shadow-premium border-edulang-blue"
          >
            <div class="text-h6 text-weight-bolder text-edulang-navy q-mb-xs">Ringkasan Kelas</div>
            <p class="text-caption text-grey-6 q-mb-lg">Lengkapi investasi belajar Anda.</p>

            <div class="summary-box q-pa-md rounded-16 bg-edulang-white q-mb-lg">
              <div class="price-breakdown-detail">
                <div class="row items-center justify-between q-mb-sm">
                  <span class="text-body2 text-grey-7">Harga Dasar</span>
                  <span class="text-body1 text-weight-bolder text-edulang-navy">
                    {{ priceDisplay }}
                  </span>
                </div>
                <div class="row items-center justify-between q-mb-sm">
                  <span class="text-body2 text-grey-7">Pajak & Layanan</span>
                  <span class="text-body1 text-weight-bolder text-edulang-blue">
                    {{ formatCurrency(priceInfo.ppn + priceInfo.operational) }}
                  </span>
                </div>
                <q-separator class="q-my-sm" />
                <div class="row items-center justify-between">
                  <span class="text-h6 text-weight-bolder text-grey-8">Total Investasi</span>
                  <span class="text-h5 text-weight-bolder text-edulang-navy">
                    {{ formatCurrency(totalPayment) }}
                  </span>
                </div>
              </div>

              <div class="row items-center justify-between q-mt-md">
                <span class="text-body2 text-grey-7">Durasi</span>
                <div class="row items-center text-edulang-blue">
                  <q-icon name="event_repeat" size="18px" class="q-mr-xs" />
                  <span class="text-body2 text-weight-bold">{{ totalMeetingLabel }}</span>
                </div>
              </div>
            </div>

            <q-btn
              color="warning"
              text-color="edulang-navy"
              unelevated
              no-caps
              class="full-width q-py-md rounded-16 text-weight-bolder btn-buy-glow"
              label="Ambil Kelas Sekarang"
              icon-right="bolt"
              @click="goToBuy"
            />
          </q-card>
        </div>
      </div>

      <div class="q-mt-xl">
        <div class="section-title row items-center justify-start q-mb-lg">
          <div class="row items-center">
            <div class="accent-line-blue q-mr-sm"></div>
            <div class="text-subtitle1 text-weight-bolder text-edulang-navy">Ulasan Siswa</div>
          </div>

          <div v-if="ratings.length > 0" class="row items-center text-amber-9 q-ml-md">
            <q-icon name="star" size="20px" class="q-mr-xs" />
            <span class="text-weight-bold">{{ averageRating }} / 5.0</span>
            <span class="text-grey-6 text-caption q-ml-xs">({{ ratings.length }} ulasan)</span>
          </div>
        </div>

        <div v-if="ratings.length > 0" class="row q-col-gutter-md">
          <div v-for="(review, index) in ratings" :key="index" class="col-12 col-md-4">
            <q-card flat class="review-item q-pa-md rounded-16 bg-white shadow-soft full-height">
              <div class="row items-center q-mb-md">
                <q-avatar size="40px" color="primary" text-color="white" class="q-mr-sm shadow-sm">
                  {{ review.user?.name?.charAt(0) || 'S' }}
                </q-avatar>
                <div class="column">
                  <div class="text-weight-bold text-edulang-navy line-limit-1">
                    {{ review.user?.name || 'Siswa Edulang' }}
                  </div>
                  <div class="text-caption text-grey-6">{{ formatDate(review.createdAt) }}</div>
                </div>
              </div>

              <q-rating
                v-model="review.rating"
                size="16px"
                color="amber-9"
                readonly
                class="q-mb-sm"
              />

              <p class="text-body2 text-grey-8 q-mb-none italic line-height-relaxed">
                "{{ review.comment || 'Tidak ada komentar.' }}"
              </p>
            </q-card>
          </div>
        </div>

        <div v-else class="text-center q-pa-xl border-dashed rounded-24 bg-grey-1 text-grey-6">
          <q-icon name="rate_review" size="48px" class="q-mb-sm opacity-40" />
          <div>Belum ada ulasan untuk kelas ini.</div>
        </div>
      </div>

      <div class="q-mt-xl q-pt-xl">
        <div class="row items-center justify-between q-mb-lg">
          <div class="column">
            <h2 class="text-h5 text-weight-bolder text-edulang-navy q-my-none">
              Program Unggulan Lainnya
            </h2>
            <p class="text-grey-6 q-mt-xs">Terus tingkatkan skill dengan program pilihan kami.</p>
          </div>
          <q-btn
            flat
            color="primary"
            label="Lihat Semua"
            icon-right="chevron_right"
            no-caps
            to="/Berlangganan"
          />
        </div>

        <div class="row q-col-gutter-lg">
          <div v-for="item in similarCourses" :key="item.id" class="col-12 col-sm-6 col-md-3">
            <CourseCard :course="item" class="similar-card shadow-soft" />
          </div>

          <div v-if="similarCourses.length === 0" class="col-12 text-center q-pa-lg text-grey-5">
            Tidak ada program serupa lainnya.
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import CourseCard from 'src/components/Subscription/CourseCard.vue' // Pastikan path benar

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const course = ref(null)
const similarCourses = ref([]) // Tambahkan ini
const selectedPreview = ref('intro')
const ratings = ref([])

// Logic Video Preview
const activePreviewUrl = computed(() => {
  if (selectedPreview.value === 'intro') {
    return course.value?.introVideoUrl || ''
  }
  const lesson = course.value?.lessons?.find((l) => l.order === selectedPreview.value)
  return lesson?.videoUrl || ''
})

const getLineColor = (n) => {
  if (n === 1) return 'bg-info'
  if (n === 2) return 'bg-positive'
  return 'bg-secondary'
}

const getEmbedUrl = (url) => {
  if (!url) return ''
  if (url.includes('youtube.com/embed/')) return url
  let videoId = ''
  if (url.includes('youtu.be/')) videoId = url.split('/').pop()
  else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

// Logic Pricing
const originalPrice = computed(() => {
  return course.value?.price || course.value?.priceInfo?.finalPrice || 0
})

const priceInfo = computed(() => {
  return course.value?.priceInfo || { ppn: 0, operational: 0 }
})

const priceDisplay = computed(() => formatCurrency(originalPrice.value))

const totalPayment = computed(() => {
  return originalPrice.value + (priceInfo.value.ppn || 0) + (priceInfo.value.operational || 0)
})

const showPriceBreakdown = computed(() => {
  return priceInfo.value.ppn > 0 || priceInfo.value.operational > 0
})

const totalMeetingLabel = computed(() => {
  const total = course.value?.lessons?.length || 0
  return total > 0 ? `${total} Sesi` : 'Jadwal Fleksibel'
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

const goBack = () => router.back()
const goToBuy = () => router.push(`/courses/${route.params.id}/buy`)

// Computed untuk rata-rata (opsional)
const averageRating = computed(() => {
  if (ratings.value.length === 0) return 0
  const total = ratings.value.reduce((acc, curr) => acc + curr.rating, 0)
  return (total / ratings.value.length).toFixed(1)
})

// Helper format tanggal
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ✅ Fungsi Fetch Ratings yang disesuaikan dengan JSON Anda
async function fetchRatings(packageId) {
  try {
    const res = await api.get(`/ratings/packages/${packageId}`)

    // Berdasarkan JSON anda, data array ada di res.data.ratings
    const allRatings = res.data.ratings || []

    if (Array.isArray(allRatings) && allRatings.length > 0) {
      // 1. Acak urutan (Randomize)
      // 2. Ambil maksimal 3 (Limit 3)
      ratings.value = allRatings.sort(() => 0.5 - Math.random()).slice(0, 3)
    } else {
      ratings.value = []
    }
  } catch (err) {
    console.error('Error fetching ratings:', err)
    ratings.value = []
  }
}

// ✅ FETCH DATA DETAIL & SIMILAR (DIPERBARUI)
async function fetchDetailAndSimilar() {
  loading.value = true
  try {
    const id = route.params.id

    // 1. Fetch Detail Course
    const res = await api.get(`/packages/${id}`)
    const data = res.data || {}
    course.value = data.package || data.data || data

    await fetchRatings(id)

    // 2. Fetch All Packages untuk Program Lainnya
    const allRes = await api.get('/packages')
    const allData =
      allRes.data.data || allRes.data.packages || (Array.isArray(allRes.data) ? allRes.data : [])

    // Filter agar course yang sedang dibuka tidak muncul di daftar "Lainnya"
    similarCourses.value = allData.filter((p) => String(p.id || p._id) !== String(id)).slice(0, 4) // Ambil 4 saja
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Gagal memuat data.' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetailAndSimilar)

// Pantau perubahan ID (jika user klik course dari daftar similar)
watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchDetailAndSimilar()
  },
)
</script>

<style scoped>
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-white {
  background-color: #f5f7fa;
}
.rounded-24 {
  border-radius: 24px;
}
.rounded-16 {
  border-radius: 16px;
}

/* NAVIGASI GARIS PREVIEW */
.preview-line {
  width: 6px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  opacity: 0.3;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.preview-line:hover {
  opacity: 0.8;
  transform: scaleX(1.5);
}
.preview-line.active {
  opacity: 1;
  width: 12px;
  transform: scaleX(1.8);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.price-breakdown {
  background: linear-gradient(135deg, rgba(0, 137, 255, 0.05) 0%, rgba(255, 196, 44, 0.05) 100%);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(0, 137, 255, 0.1);
}

.video-wrapper {
  background: white;
  padding: 8px;
  border-radius: 20px;
}
.video-container-small {
  aspect-ratio: 16 / 9;
}
.sticky-card {
  position: sticky;
  top: 40px;
  z-index: 10;
}
.btn-buy-glow {
  box-shadow: 0 10px 25px rgba(255, 196, 44, 0.4);
}

/* rating */
.review-item {
  border: 1px solid #f0f4f8;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.review-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
  border-color: #0089ff44;
}

.line-limit-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.border-dashed {
  border: 2px dashed #cbd5e0;
}

/* Style tambahan untuk card similar */
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
  }
}
</style>
