<template>
  <q-page class="bg-edulang-background q-pa-md flex flex-center">
    <div class="result-container full-width">
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-tail color="edulang-blue" size="60px" />
        <p class="q-mt-md text-edulang-navy font-outfit">Memverifikasi Database...</p>
      </div>

      <transition v-else name="fade-up" appear>
        <q-card
          v-if="result"
          flat
          class="rounded-24 shadow-brand bg-white overflow-hidden border-subtle"
        >
          <div
            :class="result.status === 'VALID' ? 'bg-green-6' : 'bg-red-6'"
            class="q-pa-md text-center text-white"
          >
            <q-icon :name="result.status === 'VALID' ? 'check_circle' : 'cancel'" size="48px" />
            <div class="text-h5 text-weight-bolder q-mt-xs">SERTIFIKAT {{ result.status }}</div>
          </div>

          <q-card-section class="q-pa-xl">
            <div class="row q-col-gutter-lg">
              <div class="col-12">
                <div class="text-caption text-grey-6 text-uppercase letter-spacing-1">
                  Nama Pemilik
                </div>
                <div class="text-h5 text-weight-bolder text-edulang-navy font-outfit">
                  {{ result.holderName }}
                </div>
              </div>

              <q-separator class="col-12 opacity-50" />

              <div class="col-12">
                <div class="text-caption text-grey-6 text-uppercase">Judul Kursus</div>
                <div class="text-subtitle1 text-weight-bold text-edulang-blue">
                  {{ result.courseTitle }}
                </div>
              </div>

              <div class="col-6">
                <div class="text-caption text-grey-6 text-uppercase">Tanggal Terbit</div>
                <div class="text-body2 text-weight-medium">{{ formatDate(result.issuedAt) }}</div>
              </div>

              <div class="col-6">
                <div class="text-caption text-grey-6 text-uppercase">Platform</div>
                <div class="text-body2 text-weight-medium">Edulang</div>
              </div>

              <div class="col-12 q-mt-lg">
                <div class="bg-grey-1 q-pa-md rounded-12 border-subtle text-center">
                  <div class="text-caption text-grey-6">Nomor Sertifikat:</div>
                  <div class="text-weight-bold text-edulang-navy">
                    {{ result.certificateNumber }}
                  </div>
                </div>
              </div>
            </div>

            <q-btn
              flat
              rounded
              color="edulang-navy"
              class="full-width q-mt-xl text-weight-bold"
              label="Verifikasi Sertifikat Lain"
              icon="arrow_back"
              to="/certificate/verify"
            />
          </q-card-section>
        </q-card>

        <q-card v-else flat class="rounded-24 shadow-brand bg-white q-pa-xl text-center">
          <q-icon name="error_outline" color="red-5" size="80px" />
          <h2 class="text-h5 text-weight-bolder text-edulang-navy q-mt-md">Data Tidak Ditemukan</h2>
          <p class="text-grey-7">Maaf, nomor sertifikat tidak terdaftar dalam sistem kami.</p>
          <q-btn
            unelevated
            rounded
            color="edulang-navy"
            label="Kembali"
            to="/certificate/verify"
            class="q-mt-md px-xl"
          />
        </q-card>
      </transition>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { date } from 'quasar'

const route = useRoute()
const loading = ref(true)
const result = ref(null)

const fetchData = async () => {
  const certId = route.query.id
  if (!certId) {
    loading.value = false
    return
  }

  try {
    // Sesuaikan endpoint Anda
    const res = await api.get(`/certificates/verify/${certId}`)
    if (res.data.success) {
      result.value = res.data.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (val) => date.formatDate(val, 'DD MMMM YYYY')

onMounted(fetchData)
</script>

<style scoped>
.result-container {
  max-width: 500px;
}
.bg-edulang-background {
  background-color: #f5f7fa;
}
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.rounded-24 {
  border-radius: 24px;
}
.rounded-12 {
  border-radius: 12px;
}
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.letter-spacing-1 {
  letter-spacing: 1px;
}
.border-subtle {
  border: 1px solid #e2e8f0;
}

.fade-up-enter-active {
  transition: all 0.5s ease-out;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
