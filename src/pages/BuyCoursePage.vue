<template>
  <q-page class="q-pa-lg q-pa-md-xl bg-edulang-white">
    <div v-if="loading" class="flex flex-center q-pa-xl" style="min-height: 400px">
      <q-spinner-cube color="primary" size="60px" />
    </div>

    <div v-else-if="!course" class="column flex-center q-pa-xl bg-white rounded-24 shadow-soft">
      <q-icon name="error_outline" size="80px" color="grey-4" class="q-mb-md" />
      <div class="text-h5 text-weight-bold text-edulang-navy">Course tidak ditemukan</div>
      <q-btn
        class="q-mt-lg rounded-12 q-px-xl"
        color="primary"
        unelevated
        no-caps
        label="Kembali"
        @click="goBack"
      />
    </div>

    <div v-else class="row q-col-gutter-xl">
      <div class="col-12 col-lg-7">
        <q-card flat class="rounded-24 bg-white q-pa-lg q-pa-md-xl shadow-premium border-light">
          <div class="row q-col-gutter-lg items-center q-mb-xl">
            <div class="col-12 col-sm-5">
              <q-img :src="heroImage" :ratio="16 / 9" class="rounded-16 shadow-navy">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">No Image</div>
                </template>
              </q-img>
            </div>
            <div class="col-12 col-sm-7">
              <q-badge outline color="primary" class="q-mb-sm rounded-8">
                {{ course.languageType?.name || 'Program Edulang' }}
              </q-badge>
              <div class="text-h6 text-weight-bolder text-edulang-navy line-height-tight">
                {{ course.title || course.name }}
              </div>
              <div class="text-body2 text-grey-6 q-mt-xs">
                <q-icon name="event_repeat" color="primary" class="q-mr-xs" />
                {{ totalMeetingLabel }}
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg opacity-50" />

          <div class="text-subtitle1 text-weight-bolder text-edulang-navy q-mb-md">
            Informasi Peserta
          </div>

          <q-form @submit.prevent="handleBuy" class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="buyer.name"
                  outlined
                  rounded
                  label="Nama Lengkap"
                  bg-color="grey-1"
                  :rules="[(v) => !!v || 'Nama wajib diisi']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="buyer.email"
                  outlined
                  rounded
                  label="Email"
                  type="email"
                  bg-color="grey-1"
                  :rules="[(v) => !!v || 'Email wajib diisi']"
                />
              </div>
            </div>
          </q-form>
        </q-card>
      </div>

      <div class="col-12 col-lg-5">
        <q-card
          flat
          class="rounded-24 bg-white q-pa-xl sticky-card shadow-premium border-edulang-blue"
        >
          <div class="text-h6 text-weight-bolder text-edulang-navy q-mb-xs">Rincian Investasi</div>
          <p class="text-caption text-grey-6 q-mb-lg">
            {{
              priceRaw === 0
                ? 'Kelas ini dapat diakses secara gratis.'
                : 'Selesaikan pembayaran untuk mendapatkan akses belajar.'
            }}
          </p>

          <div class="summary-box q-pa-md rounded-16 bg-edulang-white q-mb-lg">
            <div class="row justify-between q-mb-sm">
              <span class="text-body2 text-grey-7">Harga Dasar</span>
              <span class="text-body2 text-weight-bold text-edulang-navy">
                {{ formatCurrency(priceRaw) }}
              </span>
            </div>

            <div v-if="priceInfo.ppn > 0" class="row justify-between q-mb-sm">
              <span class="text-body2 text-grey-7">Pajak Standar (PPN)</span>
              <span class="text-body2 text-weight-bold text-edulang-navy">
                {{ formatCurrency(priceInfo.ppn) }}
              </span>
            </div>

            <div v-if="priceInfo.operational > 0" class="row justify-between q-mb-sm">
              <span class="text-body2 text-grey-7">Dukungan Sistem</span>
              <span class="text-body2 text-weight-bold text-edulang-navy">
                {{ formatCurrency(priceInfo.operational) }}
              </span>
            </div>

            <q-separator class="q-my-md" />

            <div class="row justify-between items-center">
              <span class="text-subtitle1 text-weight-bold">Total Investasi</span>
              <span class="text-h5 text-weight-bolder text-edulang-blue">
                {{ formatCurrency(totalPayment) }}
              </span>
            </div>
          </div>

          <q-btn
            color="warning"
            text-color="edulang-navy"
            unelevated
            no-caps
            class="full-width q-py-md rounded-16 text-weight-bolder btn-buy-glow"
            :label="priceRaw === 0 ? 'Daftar Sekarang (Gratis)' : 'Selesaikan Pembayaran'"
            icon-right="bolt"
            :loading="processing"
            @click="handleBuy"
          />

          <div class="text-center q-mt-md text-caption text-grey-5">
            <q-icon name="lock" class="q-mr-xs" /> Transaksi Aman & Terenkripsi
          </div>
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

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const processing = ref(false)
const course = ref(null)

const buyer = ref({
  name: localStorage.getItem('userName') || '',
  email: localStorage.getItem('userEmail') || '',
})

// Logic Harga: Mengambil data dari response package
const priceRaw = computed(() => course.value?.price || 0)
const priceInfo = computed(() => course.value?.priceInfo || { ppn: 0, operational: 0 })
const totalPayment = computed(
  () => priceRaw.value + (priceInfo.value.ppn || 0) + (priceInfo.value.operational || 0),
)

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

const totalMeetingLabel = computed(() => {
  const total = course.value?.lessons?.length || 0
  return total > 0 ? `${total} Sesi Pertemuan` : 'Jadwal Fleksibel'
})

// ✅ LOGIC GAMBAR: Prioritaskan Thumbnail dari Intro Video YouTube
const heroImage = computed(() => {
  const videoUrl = course.value?.introVideoUrl || ''

  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    let videoId = ''
    if (videoUrl.includes('v=')) {
      videoId = videoUrl.split('v=')[1].split('&')[0]
    } else if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('/').pop().split('?')[0]
    } else if (videoUrl.includes('embed/')) {
      videoId = videoUrl.split('embed/')[1].split('?')[0]
    }

    if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  // Fallback ke image_url jika bukan youtube atau ID tidak ketemu
  return (
    course.value?.imageUrl || course.value?.thumbnail || 'https://cdn.quasar.dev/img/parallax2.jpg'
  )
})

const goBack = () => router.back()

function ensureLoggedIn() {
  const token = localStorage.getItem('token')
  if (!token) {
    const redirect = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push(`/login?redirect=${redirect}`)
    return false
  }
  return true
}

async function fetchCourse() {
  loading.value = true
  try {
    const id = route.params.id
    const res = await api.get(`/packages/${id}`)
    // Mengambil objek nested 'package' dari response API
    const data = res.data || {}
    course.value = data.package || data.data || data
  } catch (err) {
    console.error('Fetch Error:', err)
    $q.notify({ type: 'negative', message: 'Gagal memuat data paket.' })
  } finally {
    loading.value = false
  }
}

async function handleBuy() {
  if (!ensureLoggedIn()) return
  if (!buyer.value.name || !buyer.value.email) {
    $q.notify({ type: 'warning', message: 'Lengkapi data nama dan email Anda.' })
    return
  }

  processing.value = true
  try {
    const payload = {
      package: route.params.id,
      buyer_name: buyer.value.name,
      buyer_email: buyer.value.email,
    }

    const res = await api.post('/transactions', payload)
    const data = res.data || {}

    if (data.success || data.message) {
      // Jika harga 0, langsung ke halaman belajar
      if (totalPayment.value === 0) {
        $q.notify({ type: 'positive', message: 'Berhasil mendaftar kelas!' })
        router.push(`/dashboard/learn/${route.params.id}`)
        return
      }

      // Jika berbayar, arahkan ke Midtrans
      const redirectUrl = data.redirectUrl || data.redirect_url
      if (redirectUrl) {
        window.location.href = redirectUrl
        return
      }
    }
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal memproses transaksi.',
    })
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  if (ensureLoggedIn()) fetchCourse()
})
</script>

<style scoped>
/* Theme Colors */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-white {
  background-color: #f5f7fa;
}

/* Border Radius */
.rounded-24 {
  border-radius: 24px;
}
.rounded-16 {
  border-radius: 16px;
}

/* Shadow & Effects */
.shadow-premium {
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.05);
}
.shadow-navy {
  box-shadow: 0 8px 20px rgba(0, 51, 135, 0.15);
}
.btn-buy-glow {
  box-shadow: 0 10px 25px rgba(255, 196, 44, 0.4);
  transition: all 0.3s ease;
}
.btn-buy-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(255, 196, 44, 0.5);
}

.sticky-card {
  position: sticky;
  top: 40px;
}

@media (max-width: 1024px) {
  .sticky-card {
    position: relative;
    top: 0;
  }
}
</style>
