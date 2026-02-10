<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="row items-center justify-between q-mb-xl">
          <div class="col-12 col-sm-auto">
            <div class="row items-center q-gutter-x-sm text-caption text-grey-6 q-mb-xs">
              <q-btn flat round dense icon="arrow_back" size="sm" @click="handleCancel" />
              <span>Admin</span>
              <q-icon name="chevron_right" />
              <span class="text-edulang-blue text-weight-bold">Edit Artikel</span>
            </div>
            <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">Perbarui Artikel</h1>
            <p class="text-subtitle1 text-grey-7 q-ma-none q-mt-xs">
              Sesuaikan informasi agar tetap relevan bagi pengguna Edulang.
            </p>
          </div>
          <div class="gt-xs">
            <q-badge
              :color="getStatusColor(form.status)"
              class="q-pa-sm rounded-borders-8 shadow-1"
            >
              <q-icon name="sync" class="q-mr-xs" v-if="submitting" />
              {{ form.status.toUpperCase() }}
            </q-badge>
          </div>
        </div>

        <div v-if="loading" class="text-center q-pa-xl bg-white rounded-borders-20 shadow-1">
          <q-spinner-ring color="primary" size="60px" thickness="4" />
          <div class="text-grey-7 q-mt-md font-weight-medium">Mengambil data artikel...</div>
        </div>

        <q-form v-else @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-8">
              <q-card flat class="content-card q-pa-lg">
                <div
                  class="text-subtitle2 text-edulang-navy text-weight-bolder q-mb-md uppercase-label"
                >
                  Editor Konten
                </div>

                <div class="q-gutter-y-md">
                  <div>
                    <label class="label-custom">Judul Artikel</label>
                    <q-input
                      v-model="form.title"
                      outlined
                      dense
                      class="custom-input title-field"
                      bg-color="white"
                      :rules="[(val) => !!val || 'Judul wajib diisi']"
                    />
                  </div>

                  <div>
                    <label class="label-custom"
                      >Slug URL
                      <q-icon name="info" size="12px" color="grey-6"
                        ><q-tooltip>Gunakan tanda hubung (-) untuk spasi</q-tooltip></q-icon
                      ></label
                    >
                    <q-input
                      v-model="form.slug"
                      outlined
                      dense
                      placeholder="judul-artikel-anda"
                      class="custom-input slug-field"
                      bg-color="grey-1"
                    />
                  </div>

                  <div>
                    <label class="label-custom">Isi Artikel</label>
                    <q-input
                      v-model="form.content"
                      outlined
                      type="textarea"
                      placeholder="Tuliskan perubahan Anda di sini..."
                      class="custom-input content-field"
                      bg-color="white"
                      rows="15"
                      :rules="[(val) => !!val || 'Konten tidak boleh kosong']"
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
                    Pengaturan
                  </div>

                  <div class="q-gutter-y-md">
                    <div>
                      <label class="label-custom">Status Publikasi</label>
                      <q-select
                        v-model="form.status"
                        outlined
                        dense
                        :options="statusOptions"
                        emit-value
                        map-options
                        class="custom-input"
                      />
                    </div>

                    <div>
                      <label class="label-custom">Image URL</label>
                      <q-input
                        v-model="form.imageUrl"
                        outlined
                        dense
                        class="custom-input"
                        bg-color="white"
                      >
                        <template v-slot:append>
                          <q-icon name="link" size="xs" />
                        </template>
                      </q-input>
                    </div>

                    <div
                      v-if="form.imageUrl"
                      class="rounded-borders-12 overflow-hidden border-light shadow-1"
                    >
                      <q-img :src="form.imageUrl" :ratio="16 / 9">
                        <div class="absolute-bottom text-caption text-center q-pa-xs">
                          Preview Gambar
                        </div>
                      </q-img>
                    </div>
                  </div>
                </q-card>

                <q-card flat class="content-card q-pa-lg border-yellow-left">
                  <div
                    class="text-subtitle2 text-edulang-navy text-weight-bolder q-mb-md uppercase-label"
                  >
                    Ringkasan Pendek
                  </div>
                  <q-input
                    v-model="form.excerpt"
                    outlined
                    type="textarea"
                    placeholder="Tulis ringkasan singkat..."
                    class="custom-input excerpt-field"
                    bg-color="white"
                    counter
                    maxlength="150"
                    rows="3"
                  />
                </q-card>

                <div class="column q-gutter-y-sm">
                  <q-btn
                    unelevated
                    label="Simpan Perubahan"
                    color="primary"
                    no-caps
                    class="full-width rounded-btn btn-edulang-primary text-weight-bold"
                    padding="12px"
                    type="submit"
                    :loading="submitting"
                  />
                  <q-btn
                    flat
                    label="Kembali ke Daftar"
                    color="grey-7"
                    no-caps
                    class="full-width rounded-btn border-light"
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
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const submitting = ref(false)
const articleId = ref(null)

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Review', value: 'review' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const form = reactive({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  imageUrl: '',
  status: 'draft',
})

function getStatusColor(status) {
  switch (status) {
    case 'published':
      return 'green-7'
    case 'review':
      return 'orange-8'
    case 'archived':
      return 'grey-8'
    default:
      return 'blue-8'
  }
}

function handleCancel() {
  router.push('/admin/artikel')
}

async function loadArticle() {
  try {
    loading.value = true
    const slugParam = route.params.slug
    if (!slugParam) {
      handleCancel()
      return
    }
    const res = await api.get(`/articles/${encodeURIComponent(slugParam)}`)
    const art = res.data?.article || res.data?.data || res.data

    if (!art) {
      $q.notify({ type: 'negative', message: 'Artikel tidak ditemukan.' })
      handleCancel()
      return
    }

    articleId.value = art._id || art.id
    form.title = art.title || ''
    form.slug = art.slug || ''
    form.content = art.content || ''
    form.excerpt = art.excerpt || ''
    form.imageUrl = art.imageUrl || ''
    form.status = art.status || 'draft'
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat detail artikel.',
    })
    handleCancel()
  } finally {
    loading.value = false
  }
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
      slug: form.slug || undefined,
    }

    if (!articleId.value) return

    await api.put(`/articles/${articleId.value}`, payload)
    $q.notify({
      type: 'positive',
      message: 'Artikel berhasil diperbarui.',
      icon: 'check',
      position: 'top-right',
    })
    router.push('/admin/artikel')
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal memperbarui artikel.',
    })
  } finally {
    submitting.value = false
  }
}

onMounted(loadArticle)
</script>

<style scoped>
/* Color Palette from Edulang Guideline */
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
.rounded-borders-20 {
  border-radius: 20px;
}
.rounded-borders-12 {
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

.slug-field :deep(input) {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
}
</style>
