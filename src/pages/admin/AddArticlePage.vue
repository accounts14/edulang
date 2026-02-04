<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div class="row items-start q-col-gutter-xl">
      <div class="col-12 col-md-10 col-lg-9">
        <div class="text-h5 text-weight-bolder text-indigo-10">Tambah Artikel</div>
        <div class="text-grey-7 q-mt-xs">Buat artikel baru untuk ruang informasi Edulang.</div>

        <q-form class="q-mt-lg" @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-lg">
            <div class="col-12">
              <div class="text-grey-8 text-caption q-mb-xs">Title</div>
              <q-input
                v-model="form.title"
                dense
                outlined
                placeholder="Judul artikel"
                bg-color="white"
                :rules="[(val) => !!val || 'Title wajib diisi']"
              />
            </div>

            <div class="col-12">
              <div class="text-grey-8 text-caption q-mb-xs">Image Url</div>
              <q-input
                v-model="form.imageUrl"
                dense
                outlined
                placeholder="https://..."
                bg-color="white"
              />
            </div>

            <div class="col-12">
              <div class="text-grey-8 text-caption q-mb-xs">Excerpt (max 150 karakter)</div>
              <q-input
                v-model="form.excerpt"
                dense
                outlined
                type="textarea"
                placeholder="Ringkasan singkat artikel"
                bg-color="white"
                autogrow
                maxlength="150"
                :rules="[(val) => !val || val.length <= 150 || 'Maksimal 150 karakter']"
              />
            </div>

            <div class="col-12">
              <div class="text-grey-8 text-caption q-mb-xs">Content</div>
              <q-input
                v-model="form.content"
                dense
                outlined
                type="textarea"
                placeholder="Isi artikel"
                bg-color="white"
                autogrow
                :rules="[(val) => !!val || 'Content wajib diisi']"
              />
            </div>

            <div class="col-12 col-md-6">
              <div class="text-grey-8 text-caption q-mb-xs">Status</div>
              <q-select
                v-model="form.status"
                dense
                outlined
                bg-color="white"
                placeholder="Pilih status"
                :options="statusOptions"
                emit-value
                map-options
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
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const submitting = ref(false)

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Review', value: 'review' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const form = reactive({
  title: '',
  content: '',
  excerpt: '',
  imageUrl: '',
  status: 'draft',
})

function handleCancel() {
  router.push('/admin/artikel')
}

async function handleSubmit() {
  try {
    submitting.value = true
    const payload = {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt || undefined,
      imageUrl: form.imageUrl || undefined,
      status: form.status,
    }
    await api.post('/articles', payload)
    $q.notify({ type: 'positive', message: 'Artikel berhasil ditambahkan.', timeout: 1800 })
    router.push('/admin/artikel')
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal menambahkan artikel.',
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
