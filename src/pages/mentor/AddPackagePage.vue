<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <div class="row items-center q-mb-xl">
          <q-btn
            flat
            round
            icon="arrow_back"
            color="primary"
            @click="handleCancel"
            class="q-mr-md bg-white shadow-1"
          />
          <div>
            <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">Buat Program Baru</h1>
            <p class="text-subtitle1 text-grey-7 q-ma-none q-mt-xs">
              Hadirkan pengalaman belajar terbaik bersama Edulang.
            </p>
          </div>
        </div>

        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-7">
              <q-card flat class="content-card q-pa-lg">
                <div class="text-h6 text-edulang-navy text-weight-bold q-mb-lg flex items-center">
                  <q-icon name="assignment" color="primary" class="q-mr-sm" size="24px" />
                  Informasi Kursus
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <label class="label-custom">Judul Package</label>
                    <q-input
                      v-model="form.title"
                      outlined
                      dense
                      placeholder="Contoh: Mastery TOEFL iBT dalam 30 Hari"
                      class="custom-input"
                      bg-color="white"
                      :rules="[(val) => !!val || 'Judul wajib diisi']"
                    />
                  </div>

                  <div class="col-12">
                    <label class="label-custom">Deskripsi Program</label>
                    <q-input
                      v-model="form.description"
                      outlined
                      dense
                      type="textarea"
                      placeholder="Jelaskan apa yang akan didapatkan oleh siswa..."
                      class="custom-input"
                      bg-color="white"
                      autogrow
                      :rules="[(val) => !!val || 'Deskripsi wajib diisi']"
                    />
                  </div>

                  <div class="col-12 col-sm-6">
                    <label class="label-custom">Bahasa</label>
                    <q-select
                      v-model="form.languageType"
                      outlined
                      dense
                      class="custom-input"
                      placeholder="Pilih Bahasa"
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
                      placeholder="Target Level"
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
                  Pengaturan Biaya
                </div>

                <div class="q-gutter-y-md">
                  <div>
                    <label class="label-custom">Harga (IDR)</label>
                    <q-input
                      v-model.number="form.price"
                      outlined
                      dense
                      type="number"
                      prefix="Rp"
                      placeholder="0"
                      class="custom-input price-input"
                      :rules="[
                        (val) => (val !== null && val !== '') || 'Harga wajib diisi',
                        (val) => Number(val) >= 0 || 'Minimal 0',
                      ]"
                    />
                  </div>

                  <div>
                    <label class="label-custom">Video Intro (Link YouTube)</label>
                    <q-input
                      v-model="form.introVideoUrl"
                      outlined
                      dense
                      placeholder="https://youtube.com/..."
                      class="custom-input"
                      :rules="[(val) => !!val || 'Video intro wajib diisi']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="smart_display" color="primary" />
                      </template>
                    </q-input>
                    <div class="text-caption text-grey-6 q-mt-xs">
                      Video ini akan muncul sebagai preview di halaman depan.
                    </div>
                  </div>
                </div>
              </q-card>

              <div class="row q-col-gutter-sm">
                <div class="col-8">
                  <q-btn
                    unelevated
                    label="Publikasikan Program"
                    no-caps
                    class="full-width rounded-btn btn-edulang-primary shadow-2 text-weight-bold"
                    type="submit"
                    padding="12px"
                    :loading="submitting"
                  />
                </div>
                <div class="col-4">
                  <q-btn
                    outline
                    label="Batal"
                    no-caps
                    color="grey-7"
                    class="full-width rounded-btn bg-white"
                    padding="12px"
                    @click="handleCancel"
                    :disable="submitting"
                  />
                </div>
              </div>
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
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const submitting = ref(false)

// languageType di backend adalah ObjectId (ref), jadi options harus dari API
const languageTypeOptions = ref([])
const loadingLanguageTypes = ref(false)

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

onMounted(() => {
  fetchLanguageTypes()
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

    // Sesuai endpoint POST /api/packages: title, description, introVideoUrl, price, languageType, level, lessons
    const payload = {
      title: form.title,
      description: form.description,
      introVideoUrl: form.introVideoUrl,
      price: Number(form.price || 0),
      languageType: form.languageType,
      level: form.level,
      lessons: [],
    }

    await api.post('/packages', payload)

    $q.notify({ type: 'positive', message: 'Program berhasil ditambahkan.', timeout: 1800 })
    router.push('/mentor/dashboard')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal menambahkan program.',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Color Overrides based on Edulang Palette */
.text-edulang-navy {
  color: #003387;
}
.btn-edulang-primary {
  background-color: #003387;
  color: white;
  transition: 0.3s;
}
.btn-edulang-primary:hover {
  background-color: #0089ff;
}

/* UI Styling */
.content-card {
  border-radius: 20px;
  background: white;
  border: 1px solid #eef0f3;
  box-shadow: 0 4px 20px rgba(0, 51, 135, 0.04) !important;
}

.rounded-btn {
  border-radius: 14px;
}

.label-custom {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #003387;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-input :deep(.q-field--focused .q-field__control) {
  border-color: #0089ff !important;
}

.price-input :deep(input) {
  font-weight: 700;
  font-size: 1.1rem;
  color: #0089ff;
}

/* Hilangkan arrow spinner pada input number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
