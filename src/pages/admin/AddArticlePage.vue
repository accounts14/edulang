<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="row items-center justify-between q-mb-xl">
          <div>
            <div class="row items-center q-gutter-x-sm text-caption text-grey-6 q-mb-xs">
              <span>Admin</span>
              <q-icon name="chevron_right" />
              <span class="text-edulang-blue text-weight-bold">Artikel</span>
            </div>
            <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">Buat Artikel Baru</h1>
            <p class="text-subtitle1 text-grey-7 q-ma-none q-mt-xs">
              Bagikan informasi dan inspirasi untuk komunitas Edulang.
            </p>
          </div>
          <q-icon name="article" size="64px" color="blue-1" class="gt-sm" />
        </div>

        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-8">
              <q-card flat class="content-card q-pa-lg">
                <div
                  class="text-subtitle2 text-edulang-navy text-weight-bolder q-mb-md uppercase-label"
                >
                  Konten Utama
                </div>

                <div class="q-gutter-y-md">
                  <div>
                    <label class="label-custom">Judul Artikel</label>
                    <q-input
                      v-model="form.title"
                      outlined
                      dense
                      placeholder="Contoh: Tips Belajar Bahasa Mandarin untuk Pemula"
                      class="custom-input title-field"
                      bg-color="white"
                      :rules="[(val) => !!val || 'Judul wajib diisi']"
                    />
                  </div>

                  <div>
                    <label class="label-custom">Isi Artikel Lengkap</label>
                    <q-input
                      v-model="form.content"
                      outlined
                      type="textarea"
                      placeholder="Mulai menulis cerita Anda di sini..."
                      class="custom-input content-field"
                      bg-color="white"
                      rows="12"
                      :rules="[(val) => !!val || 'Isi artikel tidak boleh kosong']"
                    />
                  </div>
                </div>
              </q-card>
            </div>

            <div class="col-12 col-md-4">
              <div class="q-gutter-y-lg">
                <q-card flat class="content-card q-pa-lg">
                  <div
                    class="text-subtitle2 text-edulang-navy text-weight-bolder q-mb-md uppercase-label"
                  >
                    Publikasi
                  </div>

                  <div class="q-gutter-y-md">
                    <div>
                      <label class="label-custom">Status</label>
                      <q-select
                        v-model="form.status"
                        outlined
                        dense
                        :options="statusOptions"
                        emit-value
                        map-options
                        class="custom-input"
                      >
                        <template v-slot:prepend>
                          <q-badge rounded :color="getStatusColor(form.status)" />
                        </template>
                      </q-select>
                    </div>

                    <div>
                      <label class="label-custom">Image URL</label>
                      <q-input
                        v-model="form.imageUrl"
                        outlined
                        dense
                        placeholder="https://..."
                        class="custom-input"
                        bg-color="white"
                      >
                        <template v-slot:append>
                          <q-icon name="image" size="xs" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </q-card>

                <q-card flat class="content-card q-pa-lg border-yellow-left">
                  <div class="row items-center q-mb-sm">
                    <q-icon name="short_text" color="amber-9" class="q-mr-xs" />
                    <div
                      class="text-subtitle2 text-edulang-navy text-weight-bolder uppercase-label"
                    >
                      Ringkasan
                    </div>
                  </div>
                  <q-input
                    v-model="form.excerpt"
                    outlined
                    type="textarea"
                    placeholder="Ringkasan singkat (max 150 karakter)"
                    class="custom-input excerpt-field"
                    bg-color="white"
                    counter
                    maxlength="150"
                  />
                </q-card>

                <div class="column q-gutter-y-sm">
                  <q-btn
                    unelevated
                    label="Terbitkan Artikel"
                    color="primary"
                    no-caps
                    class="full-width rounded-btn btn-edulang-primary text-weight-bold"
                    padding="12px"
                    type="submit"
                    :loading="submitting"
                  />
                  <q-btn
                    flat
                    label="Simpan Draft"
                    color="grey-7"
                    no-caps
                    class="full-width rounded-btn border-light"
                    padding="12px"
                    @click="handleSaveDraft"
                    :disable="submitting"
                  />
                  <q-btn
                    flat
                    label="Batal"
                    color="negative"
                    no-caps
                    class="full-width rounded-btn"
                    @click="handleCancel"
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

function getStatusColor(status) {
  switch (status) {
    case 'published':
      return 'green'
    case 'review':
      return 'orange'
    case 'archived':
      return 'grey'
    default:
      return 'blue'
  }
}

function handleCancel() {
  router.push('/admin/artikel')
}

function handleSaveDraft() {
  form.status = 'draft'
  handleSubmit()
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
    $q.notify({
      type: 'positive',
      message: 'Artikel berhasil diperbarui.',
      icon: 'check_circle',
      position: 'top-right',
    })
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
/* Identitas Warna Edulang */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.btn-edulang-primary {
  background-color: #003387;
  color: white;
  transition: 0.3s ease;
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

.border-yellow-left {
  border-left: 4px solid #ffc42c;
}

.rounded-btn {
  border-radius: 12px;
}

.border-light {
  border: 1px solid #e0e6ed;
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

.uppercase-label {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  transition: all 0.3s;
}

.title-field :deep(input) {
  font-size: 1.1rem;
  font-weight: 600;
}

.content-field :deep(textarea) {
  line-height: 1.6;
}
</style>
