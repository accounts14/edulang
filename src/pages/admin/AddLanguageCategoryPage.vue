<template>
  <q-page class="q-pa-xl bg-accent">
    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <q-card flat class="q-pa-xl bg-white rounded-borders-lg shadow-2">
          <div class="text-h6 text-weight-bolder q-mb-md">Add Kategori Bahasa</div>
          <q-form @submit.prevent="handleSubmit">
            <div class="q-mb-md">
              <div class="text-caption text-grey-7 q-mb-xs">Nama Bahasa</div>
              <q-input
                v-model="form.name"
                dense
                outlined
                placeholder="Tambahkan Bahasa"
                :rules="[v => !!v || 'Nama bahasa wajib diisi']"
              />
            </div>
            <div class="q-mb-md">
              <div class="text-caption text-grey-7 q-mb-xs">URL Icon Bahasa (Bendera)</div>
              <q-input
                v-model="form.iconUrl"
                dense
                outlined
                placeholder="https://..."
                type="url"
              />
              <div class="text-caption text-grey-6 q-mt-xs">Contoh: https://flagcdn.com/id.svg</div>
            </div>
            <div class="q-mb-lg">
              <div class="text-caption text-grey-7 q-mb-xs">Deskripsi</div>
              <q-input
                v-model="form.description"
                dense
                outlined
                type="textarea"
                placeholder="Deskripsi Bahasa"
                autogrow
              />
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-btn
                  type="submit"
                  color="primary"
                  unelevated
                  no-caps
                  class="full-width"
                  label="Tambahkan kategori"
                  :loading="submitting"
                  :disable="submitting"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-btn
                  color="negative"
                  unelevated
                  no-caps
                  class="full-width"
                  label="Batal"
                  :disable="submitting"
                  @click="handleCancel"
                />
              </div>
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const submitting = ref(false)

const form = reactive({
  name: '',
  iconUrl: '',
  description: ''
})

const handleCancel = () => {
  router.push('/admin/kategori')
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    const payload = {
      name: form.name,
      description: form.description
    }
    if (form.iconUrl?.trim()) payload.iconUrl = form.iconUrl.trim()

    await api.post('/language-types', payload)

    $q.notify({ type: 'positive', message: 'Kategori bahasa berhasil ditambahkan.', timeout: 1800 })
    router.push('/admin/kategori')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal menambahkan kategori bahasa.'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.rounded-borders-lg { border-radius: 24px; }
</style>

