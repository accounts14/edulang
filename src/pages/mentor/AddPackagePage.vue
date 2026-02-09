<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div class="row items-start q-col-gutter-xl">
      <div class="col-12 col-md-10 col-lg-9">
        <div class="text-h5 text-weight-bolder text-indigo-10">Tambah Package Bahasamu</div>
        <div class="text-grey-7 q-mt-xs">Atur Kelasmu dengan mudah Bersama Edulang</div>

        <q-form class="q-mt-lg" @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="text-grey-8 text-caption q-mb-xs">Intro Video Url</div>
              <q-input
                v-model="form.introVideoUrl"
                dense
                outlined
                placeholder="https://youtube.com/..."
                bg-color="white"
                :rules="[(val) => !!val || 'Intro Video Url wajib diisi']"
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-grey-8 text-caption q-mb-xs">Title</div>
              <q-input
                v-model="form.title"
                dense
                outlined
                placeholder="Title"
                bg-color="white"
                :rules="[(val) => !!val || 'Title wajib diisi']"
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-grey-8 text-caption q-mb-xs">Price</div>
              <q-input
                v-model.number="form.price"
                dense
                outlined
                type="number"
                placeholder="Harga mulai dari 0 - 300k"
                bg-color="white"
                :rules="[
                  (val) => (val !== null && val !== '') || 'Price wajib diisi',
                  (val) => Number(val) >= 0 || 'Price minimal 0',
                ]"
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-grey-8 text-caption q-mb-xs">Description</div>
              <q-input
                v-model="form.description"
                dense
                outlined
                type="textarea"
                placeholder="Description"
                bg-color="white"
                autogrow
                :rules="[(val) => !!val || 'Description wajib diisi']"
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-grey-8 text-caption q-mb-xs">Type Language</div>
              <q-select
                v-model="form.languageType"
                dense
                outlined
                bg-color="white"
                placeholder="Pilih Type Language"
                :options="languageTypeOptions"
                emit-value
                map-options
                :loading="loadingLanguageTypes"
                :rules="[(val) => !!val || 'Type Language wajib dipilih']"
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-grey-8 text-caption q-mb-xs">Level</div>
              <q-select
                v-model="form.level"
                dense
                outlined
                bg-color="white"
                placeholder="Pilih Level"
                :options="levelOptions"
                emit-value
                map-options
                :rules="[(val) => !!val || 'Level wajib dipilih']"
              />
            </div>
          </div>

          <div class="q-mt-xl">
            <q-btn
              unelevated
              color="primary"
              label="Tambah"
              no-caps
              class="q-px-lg q-mr-sm rounded-borders"
              type="submit"
              :loading="submitting"
              :disable="submitting"
            />
            <q-btn
              unelevated
              color="negative"
              label="Cancel"
              no-caps
              class="q-px-lg rounded-borders"
              @click="handleCancel"
              :disable="submitting"
            />
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
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
