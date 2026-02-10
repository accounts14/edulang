<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
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
            <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">Edit Materi</h1>
            <p class="text-subtitle1 text-grey-7 q-ma-none q-mt-xs">
              Perbarui konten video untuk lesson ini.
            </p>
          </div>
        </div>

        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner-ios color="primary" size="60px" />
          <div class="text-grey-6 q-mt-md">Memuat data materi...</div>
        </div>

        <q-card v-else flat class="content-card q-pa-lg">
          <q-form @submit.prevent="handleSubmit">
            <div class="row q-col-gutter-y-lg">
              <div class="col-12">
                <div class="row items-center bg-grey-1 q-pa-md rounded-borders-12 border-light">
                  <div
                    class="bg-edulang-navy text-white flex flex-center q-mr-md"
                    style="width: 40px; height: 40px; border-radius: 10px"
                  >
                    <span class="text-weight-bold text-h6">{{ form.order }}</span>
                  </div>
                  <div>
                    <div class="text-weight-bold text-edulang-navy">Urutan Materi</div>
                    <div class="text-caption text-grey-7">
                      Urutan lesson dalam paket program ini tidak dapat diubah di sini.
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <label class="label-custom">Video URL (YouTube/Vimeo)</label>
                <q-input
                  v-model="form.videoUrl"
                  outlined
                  dense
                  class="custom-input"
                  bg-color="white"
                  placeholder="https://youtube.com/watch?v=..."
                  :rules="[(v) => !!v || 'Video URL wajib diisi']"
                >
                  <template v-slot:prepend>
                    <q-icon name="play_circle" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 q-mt-sm">
                <div
                  class="video-preview-box flex flex-center text-grey-5 border-dashed rounded-borders-12"
                >
                  <div v-if="form.videoUrl" class="text-center q-pa-md">
                    <q-icon name="visibility" size="32px" color="edulang-blue" class="q-mb-sm" />
                    <div class="text-caption text-edulang-blue text-weight-medium">
                      Video URL telah terinput
                    </div>
                  </div>
                  <div v-else class="text-center">
                    <q-icon name="movie" size="32px" class="q-mb-sm" />
                    <div class="text-caption">Pratinjau video tidak tersedia</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-x-md q-mt-xl">
              <div class="col-12 col-sm-6">
                <q-btn
                  unelevated
                  color="primary"
                  label="Simpan Perubahan"
                  no-caps
                  class="full-width rounded-btn text-weight-bold"
                  padding="12px"
                  type="submit"
                  :loading="submitting"
                  :disable="submitting"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-btn
                  flat
                  color="grey-7"
                  label="Batal"
                  no-caps
                  class="full-width rounded-btn"
                  padding="12px"
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
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const submitting = ref(false)
const lessonOrder = ref(0)

const form = reactive({
  order: null,
  videoUrl: '',
})

function handleCancel() {
  router.push(`/mentor/packages/${route.params.id}`)
}

async function loadLesson() {
  try {
    loading.value = true
    const res = await api.get(`/packages/${route.params.id}`)
    const p = res.data?.package || res.data?.data || res.data
    const lessons = Array.isArray(p?.lessons) ? p.lessons : []
    const order = Number(route.params.order)
    lessonOrder.value = order
    const lesson = lessons.find((l) => Number(l.order ?? l.lessonOrder ?? 0) === order)

    if (!lesson) {
      $q.notify({ type: 'negative', message: 'Lesson tidak ditemukan.' })
      handleCancel()
      return
    }

    form.order = lesson.order || order
    form.videoUrl = lesson.videoUrl || ''
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat data lesson.',
    })
    handleCancel()
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    submitting.value = true

    const payload = { videoUrl: form.videoUrl }
    await api.put(
      `/packages/${route.params.id}/lessons/${lessonOrder.value || form.order}`,
      payload,
    )

    $q.notify({ type: 'positive', message: 'Materi berhasil diperbarui.', timeout: 1600 })
    router.push(`/mentor/packages/${route.params.id}`)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memperbarui materi.',
    })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadLesson()
})
</script>

<style scoped>
/* Identitas Warna Edulang */
.text-edulang-navy {
  color: #003387;
}
.bg-edulang-navy {
  background-color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}

/* UI Styling */
.content-card {
  border-radius: 24px;
  border: 1px solid #eef0f3;
  box-shadow: 0 4px 20px rgba(0, 51, 135, 0.05) !important;
}

.rounded-borders-12 {
  border-radius: 12px;
}

.rounded-btn {
  border-radius: 12px;
}

.border-light {
  border: 1px solid #edf2f7;
}

.border-dashed {
  border: 2px dashed #d1d9e2;
}

.label-custom {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #003387;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  transition: all 0.3s;
}

.video-preview-box {
  background-color: #f8fafc;
  min-height: 120px;
}

/* Shadow untuk tombol back */
.shadow-1 {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}
</style>
