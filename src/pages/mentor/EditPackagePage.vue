<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <div class="row items-center justify-between q-mb-xl">
          <div class="row items-center">
            <q-btn
              flat
              round
              icon="arrow_back"
              color="primary"
              @click="handleCancel"
              class="q-mr-md bg-white shadow-1"
            />
            <div>
              <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">Edit Package</h1>
              <p class="text-subtitle1 text-grey-7 q-ma-none q-mt-xs">
                Perbarui informasi program belajar Anda di Edulang.
              </p>
            </div>
          </div>

          <q-badge
            outline
            color="primary"
            class="q-pa-sm text-weight-bold"
            style="border-radius: 8px"
          >
            DASHBOARD MENTOR
          </q-badge>
        </div>

        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-7">
              <q-card flat class="content-card q-pa-lg">
                <div class="text-h6 text-edulang-navy text-weight-bold q-mb-lg flex items-center">
                  <q-icon name="info" color="primary" class="q-mr-sm" size="24px" />
                  Detail Program
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <label class="label-custom">Judul Package</label>
                    <q-input
                      v-model="form.title"
                      outlined
                      dense
                      placeholder="Contoh: English for Academic Purpose"
                      class="custom-input"
                      bg-color="white"
                      :rules="[(val) => !!val || 'Title wajib diisi']"
                    />
                  </div>

                  <div class="col-12">
                    <label class="label-custom">Deskripsi Lengkap</label>
                    <q-input
                      v-model="form.description"
                      outlined
                      dense
                      type="textarea"
                      placeholder="Jelaskan apa yang akan dipelajari siswa..."
                      class="custom-input"
                      bg-color="white"
                      autogrow
                      :rules="[(val) => !!val || 'Description wajib diisi']"
                    />
                  </div>

                  <div class="col-12 col-sm-6">
                    <label class="label-custom">Tipe Bahasa</label>
                    <q-select
                      v-model="form.languageType"
                      outlined
                      dense
                      class="custom-input"
                      :options="languageTypeOptions"
                      emit-value
                      map-options
                      :loading="loadingLanguageTypes"
                      :rules="[(val) => !!val || 'Wajib dipilih']"
                    />
                  </div>

                  <div class="col-12 col-sm-6">
                    <label class="label-custom">Level Kemampuan</label>
                    <q-select
                      v-model="form.level"
                      outlined
                      dense
                      class="custom-input"
                      :options="levelOptions"
                      emit-value
                      map-options
                      :rules="[(val) => !!val || 'Wajib dipilih']"
                    />
                  </div>
                </div>
              </q-card>
            </div>

            <div class="col-12 col-md-5">
              <q-card flat class="content-card q-pa-lg q-mb-lg">
                <div class="text-h6 text-edulang-navy text-weight-bold q-mb-lg flex items-center">
                  <q-icon name="payments" color="primary" class="q-mr-sm" size="24px" />
                  Biaya & Video Intro
                </div>

                <div class="q-gutter-y-md">
                  <div>
                    <label class="label-custom">Harga Program (IDR)</label>
                    <q-input
                      v-model.number="form.price"
                      outlined
                      dense
                      type="number"
                      prefix="Rp"
                      placeholder="0"
                      class="custom-input"
                      :rules="[
                        (val) => (val !== null && val !== '') || 'Price wajib diisi',
                        (val) => Number(val) >= 0 || 'Minimal 0',
                      ]"
                    />
                  </div>

                  <div>
                    <label class="label-custom">Intro Video URL (YouTube)</label>
                    <q-input
                      v-model="form.introVideoUrl"
                      outlined
                      dense
                      placeholder="https://youtube.com/..."
                      class="custom-input"
                      :rules="[(val) => !!val || 'Intro Video URL wajib diisi']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="play_circle" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card>

              <q-card flat class="bg-edulang-navy text-white q-pa-md rounded-borders-16 shadow-2">
                <div class="text-subtitle2 q-mb-md opacity-70">Konfirmasi Perubahan</div>
                <div class="row q-gutter-sm">
                  <q-btn
                    unelevated
                    label="Simpan Perubahan"
                    no-caps
                    class="col rounded-btn btn-edulang-blue text-weight-bold"
                    type="submit"
                    :loading="submitting"
                  />
                  <q-btn
                    flat
                    label="Batal"
                    no-caps
                    color="white"
                    class="col rounded-btn"
                    @click="handleCancel"
                    :disable="submitting"
                  />
                </div>
              </q-card>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const loadingLanguageTypes = ref(false)

// languageType di backend adalah ObjectId (ref), jadi options harus dari API
const languageTypeOptions = ref([])

// Sesuai endpoint: level = limited | moderated | good | fluent
const levelOptions = [
  { label: 'Pemula', value: 'Pemula' },
  { label: 'Menengah', value: 'Menengah' },
  { label: 'Lanjutan', value: 'Lanjutan' },
]

const form = reactive({
  introVideoUrl: '',
  title: '',
  price: null,
  description: '',
  languageType: null,
  level: null,
})

function handleCancel() {
  router.push('/mentor/dashboard')
}

async function fetchLanguageTypes() {
  try {
    loadingLanguageTypes.value = true
    const res = await api.get('/language-types')
    const list = res.data?.languagetypes || res.data?.data || []
    languageTypeOptions.value = (Array.isArray(list) ? list : []).map((it) => ({
      label: it.name,
      value: it._id,
    }))
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat data language type.',
    })
  } finally {
    loadingLanguageTypes.value = false
  }
}

async function fetchPackageDetail() {
  try {
    const res = await api.get(`/packages/${route.params.id}`)
    const p = res.data?.package || res.data?.data || res.data

    form.introVideoUrl = p?.introVideoUrl || ''
    form.title = p?.title || ''
    form.price = p?.price || 0
    form.description = p?.description || ''
    form.languageType = p?.languageType?._id || p?.languageType || null
    form.level = p?.level || null
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat detail package.',
    })
    handleCancel()
  }
}

onMounted(async () => {
  await Promise.all([fetchLanguageTypes(), fetchPackageDetail()])
})

async function handleSubmit() {
  const token = localStorage.getItem('token')
  if (!token) {
    $q.notify({
      type: 'negative',
      message: 'Sesi tidak valid. Silakan login ulang.',
      timeout: 2500,
    })
    router.push('/login')
    return
  }

  try {
    submitting.value = true

    // Sesuai endpoint PUT /api/packages/:id: title, description, introVideoUrl, price, languageType, level
    const payload = {
      title: form.title,
      description: form.description,
      introVideoUrl: form.introVideoUrl,
      price: Number(form.price || 0),
      languageType: form.languageType,
      level: form.level,
    }

    await api.put(`/packages/${route.params.id}`, payload)

    $q.notify({ type: 'positive', message: 'Program berhasil diperbarui.', timeout: 1800 })
    router.push('/mentor/dashboard')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memperbarui program.',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Identitas Warna Edulang */
.text-edulang-navy {
  color: #003387;
}
.bg-edulang-navy {
  background-color: #003387;
}
.btn-edulang-blue {
  background-color: #0089ff;
  color: white;
}

/* UI Styling */
.content-card {
  border-radius: 20px;
  border: 1px solid #eef0f3;
  box-shadow: 0 4px 15px rgba(0, 51, 135, 0.05) !important;
}

.rounded-borders-16 {
  border-radius: 16px;
}

.rounded-btn {
  border-radius: 10px;
  padding: 10px 20px;
}

.label-custom {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #003387;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  transition: all 0.3s;
}

.custom-input :deep(.q-field--focused .q-field__control) {
  border-color: #0089ff !important;
}

.opacity-70 {
  opacity: 0.7;
}

/* Menghilangkan panah input number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
