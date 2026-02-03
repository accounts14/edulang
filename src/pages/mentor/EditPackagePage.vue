<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div class="row items-start q-col-gutter-xl">
      <div class="col-12 col-md-10 col-lg-9">
        <div class="text-h5 text-weight-bolder text-indigo-10">
          Edit Package Bahasamu
        </div>
        <div class="text-grey-7 q-mt-xs">
          Perbarui detail program belajar Bahasamu.
        </div>

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
                :rules="[val => !!val || 'Intro Video Url wajib diisi']"
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
                :rules="[val => !!val || 'Title wajib diisi']"
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
                  val => val !== null && val !== '' || 'Price wajib diisi',
                  val => Number(val) >= 0 || 'Price minimal 0'
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
                :rules="[val => !!val || 'Description wajib diisi']"
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
                :rules="[val => !!val || 'Type Language wajib dipilih']"
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
                :rules="[val => !!val || 'Level wajib dipilih']"
              />
            </div>
          </div>

          <div class="q-mt-xl">
            <q-btn
              unelevated
              color="primary"
              label="Simpan Perubahan"
              no-caps
              class="q-px-lg q-mr-sm rounded-borders"
              type="submit"
              :loading="submitting"
              :disable="submitting"
            />
            <q-btn
              unelevated
              color="negative"
              label="Batal"
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
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const loadingLanguageTypes = ref(false)

// languageType di backend adalah ObjectId (ref), jadi options harus dari API
const languageTypeOptions = ref([])

const levelOptions = [
  // Sesuai ERD: enum('fluent','good','moderated','limited')
  { label: 'Limited', value: 'limited' },
  { label: 'Moderated', value: 'moderated' },
  { label: 'Good', value: 'good' },
  { label: 'Fluent', value: 'fluent' }
]

const form = reactive({
  introVideoUrl: '',
  title: '',
  price: null,
  description: '',
  languageType: null,
  level: null
})

function handleCancel () {
  router.push('/mentor/dashboard')
}

async function fetchLanguageTypes () {
  try {
    loadingLanguageTypes.value = true
    const res = await api.get('/language-types')
    const list = res.data?.languagetypes || res.data?.data || []
    languageTypeOptions.value = (Array.isArray(list) ? list : []).map((it) => ({
      label: it.name,
      value: it._id
    }))
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat data language type.'
    })
  } finally {
    loadingLanguageTypes.value = false
  }
}

async function fetchPackageDetail () {
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
      message: error.response?.data?.message || 'Gagal memuat detail package.'
    })
    handleCancel()
  }
}

onMounted(async () => {
  await Promise.all([fetchLanguageTypes(), fetchPackageDetail()])
})

async function handleSubmit () {
  const token = localStorage.getItem('token')
  if (!token) {
    $q.notify({ type: 'negative', message: 'Sesi tidak valid. Silakan login ulang.', timeout: 2500 })
    router.push('/login')
    return
  }

  try {
    submitting.value = true

    const payload = {
      title: form.title,
      introVideoUrl: form.introVideoUrl,
      price: Number(form.price || 0),
      description: form.description,
      languageType: form.languageType,
      level: form.level
    }

    await api.put(`/packages/${route.params.id}`, payload)

    $q.notify({ type: 'positive', message: 'Program berhasil diperbarui.', timeout: 1800 })
    router.push('/mentor/dashboard')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memperbarui program.'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.text-indigo-10 { color: #0d2a5c; }
</style>

