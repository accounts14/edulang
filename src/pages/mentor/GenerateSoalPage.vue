<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-7">
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
            <div class="row items-center q-gutter-x-sm">
              <q-badge
                color="orange-2"
                text-color="orange-10"
                label="AI Feature"
                class="text-weight-bold q-pa-xs px-sm"
              />
              <div class="text-edulang-navy text-weight-bolder">PERTEMUAN {{ lessonOrder }}</div>
            </div>
            <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">
              Generate Soal Otomatis
            </h1>
          </div>
        </div>

        <q-card flat class="content-card q-pa-lg overflow-hidden relative-position">
          <div class="absolute-top-right q-pa-md opacity-10">
            <q-icon name="auto_awesome" size="120px" color="primary" />
          </div>

          <div class="row items-start q-col-gutter-md">
            <div class="col-auto">
              <q-avatar color="blue-1" text-color="primary" icon="psychology" size="56px" />
            </div>
            <div class="col">
              <div class="text-h6 text-edulang-navy text-weight-bold">Halo Mentor!</div>
              <p class="text-grey-7">
                Jelaskan topik materi Anda di bawah ini, dan biarkan AI kami merancang soal latihan
                yang relevan secara instan.
              </p>
            </div>
          </div>

          <q-form class="q-mt-lg" @submit.prevent="handleSubmit">
            <div class="row q-col-gutter-lg">
              <div class="col-12">
                <label class="label-custom">Instruksi AI (Prompt)</label>
                <q-input
                  v-model="form.prompt"
                  outlined
                  type="textarea"
                  bg-color="white"
                  placeholder="Contoh: Buat soal pilihan ganda tentang tata bahasa Mandarin (HSK 1) fokus pada kata ganti orang sebanyak 5 soal beserta kunci jawabannya."
                  class="custom-input ai-textarea"
                  rows="6"
                  :rules="[(v) => !!v?.trim() || 'Berikan instruksi agar AI dapat bekerja']"
                />
              </div>
            </div>

            <div class="bg-blue-0 q-pa-md rounded-borders-12 q-mt-sm border-blue-light">
              <div class="row no-wrap items-center">
                <q-icon name="lightbulb" color="primary" class="q-mr-sm" size="xs" />
                <div class="text-caption text-grey-8">
                  <strong>Tips:</strong> Sebutkan jumlah soal, tipe soal (PG/Essay), dan tingkat
                  kesulitan untuk hasil terbaik.
                </div>
              </div>
            </div>

            <div class="row items-center justify-between q-mt-xl">
              <q-btn
                flat
                label="Batal"
                no-caps
                color="grey-7"
                class="rounded-btn q-px-xl"
                @click="handleCancel"
                :disable="submitting"
              />

              <q-btn
                unelevated
                label="Generate Sekarang"
                icon-right="auto_awesome"
                no-caps
                class="rounded-btn q-px-xl btn-edulang-primary shadow-3"
                type="submit"
                :loading="submitting"
              >
                <template v-slot:loading>
                  <q-spinner-stars class="on-left" />
                  Sedang Merancang...
                </template>
              </q-btn>
            </div>
          </q-form>
        </q-card>

        <div class="text-center q-mt-lg text-grey-5 text-caption">
          Powered by Edulang AI Engine. Hasil mungkin memerlukan peninjauan kembali.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { lessonEndpoints } from 'src/api/endpoints'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const submitting = ref(false)

const packageId = computed(() => route.params.id)
const lessonOrder = computed(() => route.params.order)

const form = reactive({
  prompt: '',
})

// Validasi parameter saat component mounted
onMounted(() => {
  if (!packageId.value || !lessonOrder.value) {
    $q.notify({
      type: 'negative',
      message: 'Parameter tidak valid. Package ID atau Lesson Order tidak ditemukan.',
    })
    router.push({ name: 'MentorKelasku' })
  }
})

function handleCancel() {
  router.push({ name: 'MentorPackageDetail', params: { id: packageId.value } })
}

async function handleSubmit() {
  // Validasi ulang sebelum submit
  if (!packageId.value || !lessonOrder.value) {
    $q.notify({
      type: 'negative',
      message: 'Parameter tidak lengkap.',
    })
    return
  }

  if (!form.prompt.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Prompt tidak boleh kosong.',
    })
    return
  }

  try {
    submitting.value = true

    const url = lessonEndpoints.generateAi(packageId.value, lessonOrder.value)
    await api.post(url, {
      prompt: form.prompt.trim(),
    })

    $q.notify({
      type: 'positive',
      message: 'Soal berhasil digenerate dengan AI.',
      timeout: 2000,
    })

    router.push({ name: 'MentorPackageDetail', params: { id: packageId.value } })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal generate soal.',
      caption: error.response?.status === 404 ? 'Endpoint tidak ditemukan' : undefined,
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Identitas Warna Berdasarkan Guideline */
.text-edulang-navy {
  color: #003387;
}
.btn-edulang-primary {
  background-color: #003387;
  color: white;
  transition: all 0.3s ease;
}
.btn-edulang-primary:hover {
  background-color: #0089ff;
  transform: scale(1.02);
}

/* UI Styling */
.content-card {
  border-radius: 24px;
  background: white;
  border: 1px solid #eef0f3;
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.05) !important;
}

.rounded-borders-12 {
  border-radius: 12px;
}
.rounded-btn {
  border-radius: 12px;
  font-weight: 700;
  padding-top: 12px;
  padding-bottom: 12px;
}

.label-custom {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #003387;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.custom-input :deep(.q-field__control) {
  border-radius: 16px;
  transition: all 0.3s;
}

.ai-textarea :deep(textarea) {
  line-height: 1.6;
  font-size: 1rem;
}

.bg-blue-0 {
  background-color: #f0f7ff;
}
.border-blue-light {
  border: 1px solid #d0e6ff;
}
.opacity-10 {
  opacity: 0.05;
}

/* Shadow untuk tombol back */
.shadow-1 {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
}
</style>
