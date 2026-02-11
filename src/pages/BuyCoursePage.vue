<template>
  <q-page class="q-pa-xl bg-accent">
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
            {{
              priceDisplay === 'Rp 0'
                ? 'Kelas gratis! Langsung akses materi.'
                : 'Periksa kembali detail pembayaranmu sebelum melanjutkan ke Midtrans.'
            }}
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
            :label="priceDisplay === 'Rp 0' ? 'Akses Gratis' : 'Buy Now'"
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
  () =>
    course.value?.imageUrl || course.value?.thumbnail || 'https://cdn.quasar.dev/img/parallax2.jpg',
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
    const packageId = route.params.id
    if (!packageId) {
      $q.notify({ type: 'negative', message: 'ID package tidak ditemukan.' })
      return
    }

    // POST ke endpoint - backend handle semua logic
    const payload = {
      package: packageId,
      buyer_name: buyer.value.name,
      buyer_email: buyer.value.email,
    }

    const res = await api.post('/transactions', payload)
    const data = res.data || {}

    console.log('[BuyCourse] Response:', data) // Debug log

    // ✅ SUCCESS CHECK - Handle semua kemungkinan response
    if (data.success || data.message) {
      // Free package success atau generic success
      if (
        course.value?.price === 0 ||
        data.message?.toLowerCase().includes('gratis') ||
        data.message?.toLowerCase().includes('berhasil')
      ) {
        $q.notify({
          type: 'positive',
          message: data.message || 'Package berhasil diakses!',
        })
        router.push(`/dashboard/learn/${packageId}`)
        return
      }

      // Midtrans redirect URL
      const redirectUrl = data.redirectUrl || data.redirect_url
      if (redirectUrl) {
        if (data.message) {
          $q.notify({ type: 'positive', message: data.message })
        }
        window.location.href = redirectUrl
        return
      }

      // Midtrans Snap Token
      const snapToken = data.snapToken || data.snap_token
      if (
        snapToken &&
        typeof window.snap !== 'undefined' &&
        typeof window.snap.pay === 'function'
      ) {
        if (data.message) {
          $q.notify({ type: 'positive', message: data.message })
        }
        window.snap.pay(snapToken)
        return
      }

      // Generic success - redirect ke dashboard
      $q.notify({
        type: 'positive',
        message: data.message || 'Transaksi berhasil diproses!',
      })
      router.push('/dashboard')
      return
    }

    // Error dari backend
    throw new Error(data.message || data.error || 'Transaksi gagal.')
  } catch (error) {
    console.error('[BuyCourse] transaksi gagal', error)
    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Gagal memproses transaksi. Silakan coba lagi.',
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
