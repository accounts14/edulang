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

          <div v-if="hasCertificate" class="column">
            <q-btn
              unelevated
              no-caps
              color="edulang-navy"
              class="full-width rounded-12 text-weight-bold q-py-md font-outfit btn-hover-effect"
              :loading="downloading"
              @click="downloadCertificate"
            >
              <q-icon name="cloud_download" size="xs" class="q-mr-sm" /> DOWNLOAD PNG
            </q-btn>

            <div class="q-mt-md q-pa-md rounded-12 bg-blue-1 border-blue-thin">
              <div class="row items-center justify-between">
                <span class="text-caption text-edulang-navy text-weight-medium"
                  >Nomor Sertifikat:</span
                >
                <span class="text-caption text-weight-bold text-edulang-blue">
                  {{ certificateData?.certificateNumber }}
                </span>
              </div>
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
const downloading = ref(false)
const hasCertificate = ref(false)
const certificateData = ref(null)
const score = ref(0)
const totalLessons = ref(0)
const packageData = ref({})

// Fetch Data Awal
const fetchData = async () => {
  loading.value = true
  try {
    // 1. Ambil Info Paket
    const resPkg = await api.get(`/packages/${packageId}`)
    packageData.value = resPkg.data.package || {}

    // 2. Ambil Progres User
    const resProg = await api.get(`/userprogress/my-progress/${packageId}`)
    score.value = parseInt((resProg.data.data.percentage || '0%').replace('%', ''))
    totalLessons.value = resProg.data.data.totalLessons || 0

    // 3. Cek Kepemilikan Sertifikat
    const resCert = await api.get(`/certificates/my/${packageId}`)
    if (resCert.data.hasCertificate) {
      hasCertificate.value = true
      certificateData.value = resCert.data.certificate
    }
  } catch (e) {
    console.error('Error fetching data:', e)
  } finally {
    loading.value = false
  }
}

// Action: Generate Sertifikat
const handleGenerate = async () => {
  generating.value = true
  try {
    const res = await api.post(`/certificates/generate/${packageId}`)
    if (res.data.success) {
      $q.notify({ type: 'positive', message: 'Sertifikat Berhasil Dibuat!' })
      fetchData()
    }
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e.response?.data?.message || 'Gagal Generate Sertifikat',
    })
  } finally {
    generating.value = false
  }
}

// Action: Download Sertifikat via Blob (Bearer Token tetap aman)
const downloadCertificate = async () => {
  downloading.value = true
  try {
    const response = await api.get(`/certificates/download/${packageId}`, {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Sertifikat_${packageData.value.title || 'Edulang'}.png`)
    document.body.appendChild(link)
    link.click()

    link.remove()
    window.URL.revokeObjectURL(url)
    $q.notify({ type: 'positive', message: 'Download dimulai...' })
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal mengunduh sertifikat' })
  } finally {
    downloading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
/* Colors & Fonts */
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
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* Layout */
.max-width-container {
  max-width: 550px;
}
.rounded-24 {
  border-radius: 24px;
}
.rounded-12 {
  border-radius: 12px;
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

.border-positive-soft {
  border: 2px solid rgba(76, 175, 80, 0.2);
}
.border-blue-thin {
  border: 1px solid rgba(0, 137, 255, 0.15);
}

.back-btn-custom:hover {
  transform: translateX(-4px);
  transition: transform 0.3s;
}
.btn-hover-effect:hover {
  opacity: 0.9;
}
</style>
