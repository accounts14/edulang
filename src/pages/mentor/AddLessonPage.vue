<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
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
        <div class="text-h4 text-weight-bold text-edulang-navy">Tambah Lesson</div>
        <div class="text-subtitle1 text-grey-7">
          Lengkapi urutan materi dan tautan video pembelajaran.
        </div>
      </div>
    </div>

    <q-card flat class="content-card q-pa-lg">
      <q-card-section>
        <q-form @submit.prevent="handleSubmit">
          <div class="row q-col-gutter-x-xl q-col-gutter-y-lg">
            <div class="col-12 col-md-4">
              <label class="text-weight-bold text-edulang-navy block q-mb-sm"
                >Urutan Lesson (1-16)</label
              >
              <q-input
                v-model.number="form.order"
                outlined
                type="number"
                placeholder="Misal: 1"
                bg-color="white"
                color="edulang-blue"
                class="custom-input"
                :rules="[
                  (v) => (v !== null && v !== '') || 'Order wajib diisi',
                  (v) => Number(v) >= 1 || 'Minimal 1',
                  (v) => Number(v) <= 16 || 'Maksimal 16',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="reorder" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-8">
              <label class="text-weight-bold text-edulang-navy block q-mb-sm"
                >URL Video (YouTube/Vimeo)</label
              >
              <q-input
                v-model="form.videoUrl"
                outlined
                placeholder="https://www.youtube.com/watch?v=..."
                bg-color="white"
                color="edulang-blue"
                class="custom-input"
                :rules="[(v) => !!v || 'Video URL wajib diisi']"
              >
                <template v-slot:prepend>
                  <q-icon name="play_circle" color="primary" />
                </template>
              </q-input>
            </div>
          </div>

          <q-separator class="q-my-xl" color="grey-3" />

          <div class="row justify-between items-center">
            <div class="text-caption text-grey-6 italic">
              *Pastikan data sudah benar sebelum menekan tombol simpan.
            </div>
            <div class="row q-gutter-md">
              <q-btn
                flat
                label="Batal"
                no-caps
                color="grey-7"
                class="q-px-xl rounded-btn"
                :disable="submitting"
                @click="handleCancel"
              />
              <q-btn
                unelevated
                label="Simpan Materi"
                no-caps
                class="q-px-xl rounded-btn btn-edulang-primary"
                type="submit"
                icon="save"
                :loading="submitting"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const submitting = ref(false)

const form = reactive({
  order: null,
  videoUrl: '',
})

function handleCancel() {
  router.push(`/mentor/packages/${route.params.id}`)
}

async function handleSubmit() {
  try {
    submitting.value = true
    const payload = {
      order: Number(form.order),
      videoUrl: form.videoUrl,
    }

    await api.post(`/packages/${route.params.id}/lessons`, payload)

    $q.notify({
      type: 'positive',
      message: 'Materi berhasil ditambahkan.',
      color: 'edulang-blue', // Menggunakan warna brand
      position: 'top-right',
    })

    router.push(`/mentor/packages/${route.params.id}`)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal menambahkan materi.',
      position: 'top-right',
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

.btn-edulang-primary {
  background-color: #003387;
  color: white;
  transition: filter 0.3s;
}

.btn-edulang-primary:hover {
  filter: brightness(1.2);
}

/* UI Styling */
.content-card {
  border-radius: 20px;
  border: 1px solid #e0e4e9;
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.05) !important;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
}

.rounded-btn {
  border-radius: 12px;
  font-weight: 600;
}

/* Menghilangkan panah pada input number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
