<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div class="text-h5 text-weight-bolder text-indigo-10">Edit Lesson</div>
    <div class="text-grey-7 q-mt-xs">
      Sesuai endpoint PUT: videoUrl?, assignment?. Soal bisa manual atau generate via AI.
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else>
      <q-form class="q-mt-lg" @submit.prevent="handleSubmit">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Order (1-16)</div>
            <q-input
              v-model.number="form.order"
              dense
              outlined
              type="number"
              bg-color="white"
              placeholder="Urutan lesson (1-16)"
              readonly
              :rules="[
                (v) => (v !== null && v !== '') || 'Order wajib diisi',
                (v) => Number(v) >= 1 || 'Minimal 1',
                (v) => Number(v) <= 16 || 'Maksimal 16',
              ]"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Video URL</div>
            <q-input
              v-model="form.videoUrl"
              dense
              outlined
              bg-color="white"
              placeholder="https://youtube.com/..."
              :rules="[(v) => !!v || 'Video URL wajib diisi']"
            />
          </div>

          <!-- Manual assignment: Essay -->
          <div class="col-12">
            <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-sm">
              Assignment (Manual) - Opsional
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Essay Question</div>
            <q-input
              v-model="form.essayQuestion"
              dense
              outlined
              type="textarea"
              autogrow
              bg-color="white"
              placeholder="Pertanyaan essay untuk siswa"
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Word Limit (Essay)</div>
            <q-input
              v-model.number="form.wordLimit"
              dense
              outlined
              type="number"
              bg-color="white"
              placeholder="Contoh: 100"
            />
          </div>

          <!-- AI Generate assignment -->
          <div class="col-12">
            <q-separator class="q-my-md" />
            <div class="text-subtitle2 text-weight-bold text-grey-9 q-mb-sm">
              Atau Generate Soal dengan AI
            </div>
            <div class="text-caption text-grey-7 q-mb-sm">
              Isi prompt untuk generate soal otomatis (endpoint: POST
              .../lessons/:order/assignment)
            </div>
            <q-input
              v-model="form.promptForAI"
              dense
              outlined
              type="textarea"
              autogrow
              bg-color="white"
              placeholder="Contoh: Buat soal tentang pengenalan bahasa Mandarin untuk pemula..."
            />
          </div>
        </div>

        <div class="q-mt-xl">
          <q-btn
            unelevated
            color="primary"
            label="Simpan"
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
            :disable="submitting"
            @click="handleCancel"
          />
        </div>
      </q-form>
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
  essayQuestion: '',
  wordLimit: 100,
  promptForAI: '',
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
    form.essayQuestion = lesson.assignment?.essays?.[0]?.question || ''
    form.wordLimit = lesson.assignment?.essays?.[0]?.wordLimit ?? 100
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

    // Sesuai endpoint PUT /api/packages/:packageId/lessons/:lessonOrder: { videoUrl?, assignment? }
    const payload = {}
    if (form.videoUrl) payload.videoUrl = form.videoUrl

    const assignment = {}
    if (form.essayQuestion?.trim()) {
      assignment.essays = [
        {
          question: form.essayQuestion.trim(),
          wordLimit: Number(form.wordLimit) || 100,
        },
      ]
      assignment.multipleChoice = []
      payload.assignment = assignment
    }

    if (Object.keys(payload).length > 0) {
      await api.put(
        `/packages/${route.params.id}/lessons/${lessonOrder.value || form.order}`,
        payload
      )
    }

    // Jika ada prompt AI, panggil endpoint generate assignment
    if (form.promptForAI?.trim()) {
      try {
        await api.post(
          `/packages/${route.params.id}/lessons/${lessonOrder.value || form.order}/assignment`,
          { prompt: form.promptForAI.trim() }
        )
        $q.notify({
          type: 'positive',
          message: 'Lesson dan soal AI berhasil diperbarui.',
          timeout: 2000,
        })
      } catch (aiErr) {
        $q.notify({
          type: 'warning',
          message:
            aiErr.response?.data?.message ||
            'Lesson berhasil diperbarui, tetapi generate soal AI gagal.',
        })
      }
    } else {
      $q.notify({ type: 'positive', message: 'Materi berhasil diperbarui.', timeout: 1600 })
    }

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
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
