<template>
  <q-page class="q-pa-md bg-edulang-white">
    <div class="max-width-container q-mx-auto">
      <q-btn
        flat
        dense
        no-caps
        icon="arrow_back"
        color="edulang-navy"
        label="Kembali ke Progres"
        @click="$router.push({ name: 'UserProgres' })"
        class="q-mb-md text-weight-bold back-btn-custom"
      />

      <q-card v-if="!loading" class="rounded-24 shadow-brand overflow-hidden border-none">
        <div class="bg-edulang-blue" style="height: 8px"></div>

        <q-card-section class="text-center q-pa-xl">
          <div class="font-outfit text-h5 text-weight-bolder text-edulang-navy q-mb-xs">
            Hasil Belajar
          </div>
          <div class="font-poppins text-body2 text-edulang-grey q-mb-xl">
            {{ packageData.title || 'Memuat Judul...' }}
          </div>

          <div class="flex flex-center q-mb-xl">
            <div class="relative-position">
              <q-circular-progress
                show-value
                font-size="32px"
                :value="score"
                size="180px"
                :thickness="0.12"
                color="edulang-blue"
                track-color="blue-1"
                class="text-edulang-navy text-weight-bolder font-outfit"
              >
                <div class="column items-center">
                  <span class="line-height-none">{{ score }}%</span>
                  <div class="row items-center q-mt-xs">
                    <q-icon name="star" color="edulang-yellow" size="20px" />
                  </div>
                </div>
              </q-circular-progress>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-xl">
            <div class="col-6">
              <div class="score-stat-card bg-white">
                <div class="text-edulang-grey text-overline text-weight-bold">TOTAL MATERI</div>
                <div class="text-h5 text-weight-bolder text-edulang-navy font-outfit">
                  {{ totalLessons }}
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="score-stat-card bg-white border-positive-soft">
                <div class="text-edulang-grey text-overline text-weight-bold">STATUS</div>
                <div class="text-h5 text-weight-bolder text-positive font-outfit">LULUS</div>
              </div>
            </div>
          </div>

          <div v-if="hasCertificate" class="column q-gutter-y-md">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <q-btn
                  unelevated
                  no-caps
                  color="edulang-navy"
                  class="full-width rounded-12 text-weight-bold q-py-md font-outfit btn-hover-effect"
                  @click="downloadCertificate"
                >
                  <q-icon name="cloud_download" size="xs" class="q-mr-sm" /> DOWNLOAD PNG
                </q-btn>
              </div>
              <div class="col-12 col-sm-6">
                <q-btn
                  outline
                  no-caps
                  color="edulang-blue"
                  class="full-width rounded-12 text-weight-bold q-py-md font-outfit"
                  @click="showVerifyModal = true"
                >
                  <q-icon name="verified" size="xs" class="q-mr-sm" /> CEK KEASLIAN
                </q-btn>
              </div>
            </div>

            <div class="verification-footer q-pa-md rounded-12 bg-blue-1 border-blue-thin">
              <div class="row items-center justify-between q-mb-sm">
                <span class="text-caption text-edulang-navy text-weight-medium"
                  >Nomor Sertifikat:</span
                >
                <span class="text-caption text-weight-bold text-edulang-blue">{{
                  certificateData?.certificateNumber
                }}</span>
              </div>
              <q-separator color="blue-2" class="q-my-sm" />
              <q-btn
                flat
                dense
                no-caps
                color="edulang-blue"
                size="sm"
                class="full-width font-poppins text-weight-bold"
                @click="verifyByQR"
              >
                <q-icon name="qr_code_scanner" class="q-mr-xs" /> Verifikasi via QR Code Resmi
              </q-btn>
            </div>
          </div>

          <q-btn
            v-else
            unelevated
            no-caps
            color="edulang-yellow"
            text-color="edulang-navy"
            class="full-width rounded-12 text-weight-bolder q-py-lg font-outfit shadow-yellow"
            :loading="generating"
            @click="handleGenerate"
          >
            <q-icon name="workspace_premium" class="q-mr-sm" /> KLAIM SERTIFIKAT SEKARANG
          </q-btn>
        </q-card-section>
      </q-card>

      <div v-else class="flex flex-center q-pa-xl column">
        <q-spinner-dots color="edulang-blue" size="60px" />
        <div class="q-mt-md text-edulang-navy font-outfit">Menyiapkan hasil belajar...</div>
      </div>

      <q-dialog v-model="showVerifyModal" backdrop-filter="blur(8px)">
        <q-card style="width: 400px; border-radius: 24px" class="overflow-hidden">
          <q-card-section class="bg-edulang-navy text-white q-pa-lg text-center">
            <q-icon name="verified_user" size="50px" class="q-mb-sm" />
            <div class="text-h6 text-weight-bold font-outfit">Sistem Verifikasi</div>
          </q-card-section>

          <q-card-section class="q-pa-xl text-center">
            <p class="text-body2 text-edulang-grey font-poppins q-mb-lg">
              Validasi keaslian sertifikat Anda secara resmi melalui sistem pusat Edulang.
            </p>
            <q-btn
              unelevated
              no-caps
              color="edulang-blue"
              label="Verifikasi Sekarang"
              :loading="verifying"
              @click="runManualVerification"
              class="full-width rounded-12 q-py-md text-weight-bold shadow-blue"
            />

            <q-slide-transition>
              <div
                v-if="verificationResult"
                class="q-mt-xl q-pa-md bg-edulang-white rounded-16 text-left border-light"
              >
                <div class="text-overline text-weight-bold text-grey-6 line-height-none">
                  HASIL VALIDASI
                </div>
                <div
                  class="text-subtitle1 text-edulang-navy text-weight-bolder q-mt-xs font-outfit"
                >
                  {{ verificationResult.holderName }}
                </div>
                <div class="row items-center q-mt-sm">
                  <q-badge
                    :color="verificationResult.status === 'valid' ? 'positive' : 'negative'"
                    class="q-px-md q-py-xs rounded-8 text-weight-bold"
                  >
                    {{ verificationResult.status.toUpperCase() }}
                  </q-badge>
                </div>
              </div>
            </q-slide-transition>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const packageId = route.params.packageId

// States
const loading = ref(true)
const generating = ref(false)
const verifying = ref(false)
const showVerifyModal = ref(false)
const hasCertificate = ref(false)
const certificateData = ref(null)
const verificationResult = ref(null)
const score = ref(0)
const totalLessons = ref(0)
const packageData = ref({})

const fetchData = async () => {
  loading.value = true
  try {
    // 1. Package Info
    const resPkg = await api.get(`/packages/${packageId}`)
    packageData.value = resPkg.data.package || {}

    // 2. User Progress
    const resProg = await api.get(`/userprogress/my-progress/${packageId}`)
    score.value = parseInt((resProg.data.data.percentage || '0%').replace('%', ''))
    totalLessons.value = resProg.data.data.totalLessons || 0

    // 3. Check Certificate
    const resCert = await api.get(`/certificates/my/${packageId}`)
    if (resCert.data.hasCertificate) {
      hasCertificate.value = true
      certificateData.value = resCert.data.certificate
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// ACTION 1: GENERATE (POST)
const handleGenerate = async () => {
  generating.value = true
  try {
    const res = await api.post(`/certificates/generate/${packageId}`)
    if (res.data.success) {
      $q.notify({ type: 'positive', message: 'Sertifikat Berhasil Dibuat!' })
      fetchData()
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Gagal Generate' })
  } finally {
    generating.value = false
  }
}

// ACTION 2: DOWNLOAD (GET)
const downloadCertificate = () => {
  const downloadUrl = `${api.defaults.baseURL}/certificates/download/${packageId}`
  window.open(downloadUrl, '_blank')
}

// ACTION 3: MANUAL VERIFY (POST)
const runManualVerification = async () => {
  verifying.value = true
  try {
    const res = await api.post('/certificates/verify', {
      certNumber: certificateData.value.certificateNumber,
    })
    verificationResult.value = res.data.verified_data
    $q.notify({ type: 'positive', message: 'Sertifikat Terverifikasi!' })
  } catch {
    $q.notify({ type: 'negative', message: 'Sertifikat Tidak Valid' })
  } finally {
    verifying.value = false
  }
}

// ACTION 4: QR VERIFY (GET)
const verifyByQR = () => {
  // Menggunakan endpoint QR dengan data dari certificateData
  const qrUrl = `${api.defaults.baseURL}/certificates/verify/qr?qrData=${certificateData.value.certificateNumber}`
  window.open(qrUrl, '_blank')
}

onMounted(fetchData)
</script>

<style scoped>
/* Brands Colors */
.bg-edulang-white {
  background-color: #f5f7fa !important;
}
.text-edulang-navy {
  color: #003387 !important;
}
.text-edulang-blue {
  color: #0089ff !important;
}
.text-edulang-grey {
  color: #64748b !important;
}
.bg-edulang-navy {
  background-color: #003387 !important;
}
.bg-edulang-blue {
  background-color: #0089ff !important;
}

/* Fonts */
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* Layout & Cards */
.max-width-container {
  max-width: 550px;
}
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

.score-stat-card {
  border: 1px solid #e2e8f0;
  padding: 20px 10px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
}

.shadow-brand {
  box-shadow: 0 20px 40px -10px rgba(0, 51, 135, 0.12) !important;
}

.shadow-yellow {
  box-shadow: 0 8px 20px rgba(255, 196, 44, 0.35);
}
.shadow-blue {
  box-shadow: 0 8px 20px rgba(0, 137, 255, 0.25);
}

.border-positive-soft {
  border: 2px solid rgba(76, 175, 80, 0.2);
}
.border-blue-thin {
  border: 1px solid rgba(0, 137, 255, 0.15);
}
.border-light {
  border: 1px solid #e2e8f0;
}

.line-height-none {
  line-height: 1;
}
.back-btn-custom:hover {
  transform: translateX(-4px);
  transition: transform 0.3s;
}
.btn-hover-effect:hover {
  opacity: 0.9;
}
</style>
