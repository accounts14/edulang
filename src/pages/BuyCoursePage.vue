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
      <!-- Left: detail singkat -->
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-5">
              <q-img :src="heroImage" :ratio="4 / 3" class="rounded-borders-16" />
            </div>
            <div class="col-12 col-md-7">
              <div class="text-caption text-grey-6 q-mb-xs">
                {{ course.languageType?.name || 'Course' }}
              </div>
              <div class="text-subtitle1 text-weight-bolder text-indigo-10">
                {{ course.title || course.name }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                {{ totalMeetingLabel }}
              </div>
              <div class="text-h6 text-weight-bolder text-primary q-mt-md">
                {{ priceDisplay }}
              </div>
            </div>
          </div>

          <q-separator spaced />

          <div class="text-subtitle2 text-weight-bold text-indigo-10 q-mb-sm">
            Informasi Pembeli
          </div>

          <q-form @submit.prevent="handleBuy">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="buyer.name"
                  outlined
                  dense
                  label="Nama Lengkap"
                  :rules="[(v) => !!v || 'Nama wajib diisi']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="buyer.email"
                  outlined
                  dense
                  label="Email"
                  type="email"
                  :rules="[(v) => !!v || 'Email wajib diisi']"
                />
              </div>
            </div>
          </q-form>
        </q-card>
      </div>

      <!-- Right: ringkasan pembayaran -->
      <div class="col-12 col-lg-5">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg">
          <div class="text-subtitle1 text-weight-bolder text-indigo-10 q-mb-sm">
            Ringkasan Pembayaran
          </div>
          <div class="text-caption text-grey-7 q-mb-md">
            Periksa kembali detail pembayaranmu sebelum melanjutkan ke Midtrans.
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
              <span class="text-body2 text-grey-7">Biaya Layanan</span>
              <span class="text-body2 text-weight-bold">Rp 0</span>
            </div>
          </div>

          <q-separator spaced />

          <div class="row items-center justify-between q-mb-md">
            <span class="text-body1 text-weight-bold">Total Tagihan</span>
            <span class="text-h6 text-weight-bolder text-primary">{{ priceDisplay }}</span>
          </div>

          <q-btn
            color="warning"
            text-color="black"
            unelevated
            no-caps
            class="full-width q-py-sm text-weight-bold q-mt-sm"
            label="Buy Now"
            :loading="processing"
            @click="handleBuy"
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
    const data = res.data || {}
    const pkg = data.package || data.data || data
    course.value = pkg
  } catch (error) {
    console.error('[BuyCourse] error', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat data course.',
    })
  } finally {
    loading.value = false
  }
}

async function handleBuy() {
  if (!ensureLoggedIn()) return

  if (!buyer.value.name || !buyer.value.email) {
    $q.notify({
      type: 'warning',
      message: 'Nama dan email wajib diisi.',
    })
    return
  }

  processing.value = true
  try {
    const id = route.params.id

    // Sesuai pola ERD/endpoint: buat transaksi untuk paket tertentu.
    const payload = {
      packageId: id,
      name: buyer.value.name,
      email: buyer.value.email,
    }

    const res = await api.post('/transactions', payload)
    const data = res.data || {}

    const redirectUrl =
      data.redirectUrl ||
      data.redirect_url ||
      data.paymentUrl ||
      data.transaction?.redirect_url ||
      data.transaction?.paymentUrl

    const snapToken = data.snapToken || data.token || data.snap_token

    if (redirectUrl) {
      window.location.href = redirectUrl
      return
    }

    if (snapToken && window.snap && typeof window.snap.pay === 'function') {
      window.snap.pay(snapToken)
      return
    }

    throw new Error('Respons transaksi tidak berisi URL pembayaran atau snap token.')
  } catch (error) {
    console.error('[BuyCourse] transaksi gagal', error)
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Gagal memulai pembayaran. Silakan coba lagi atau hubungi admin.',
    })
  } finally {
    processing.value = false
  }
}

onMounted(async () => {
  if (!ensureLoggedIn()) return
  await fetchCourse()
})
</script>

<style scoped>
.rounded-borders-16 {
  border-radius: 16px;
}
</style>

