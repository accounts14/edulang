<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div class="text-h5 text-weight-bolder text-indigo-10">Edit Course Bahasamu</div>
    <div class="text-grey-7 q-mt-xs">Atur Kelasmu dengan mudah Bersama Edulang</div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else>
      <q-form class="q-mt-lg" @submit.prevent="handleSubmit">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Url Video</div>
            <q-input
              v-model="form.videoUrl"
              dense
              outlined
              bg-color="white"
              placeholder="Url video : https://youtube"
              :rules="[(v) => !!v || 'Url video wajib diisi']"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Lessons</div>
            <q-input
              v-model.number="form.order"
              dense
              outlined
              type="number"
              bg-color="white"
              placeholder="lessons"
              :rules="[
                (v) => (v !== null && v !== '') || 'Order wajib diisi',
                (v) => Number(v) >= 1 || 'Minimal 1',
              ]"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Description</div>
            <q-input
              v-model="form.essayQuestion"
              dense
              outlined
              type="textarea"
              autogrow
              bg-color="white"
              placeholder="Pertanyaan essay untuk siswa"
              :rules="[(v) => !!v || 'Pertanyaan wajib diisi']"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Title</div>
            <q-input
              v-model="form.title"
              dense
              outlined
              bg-color="white"
              placeholder="Title"
              :rules="[(v) => !!v || 'Title wajib diisi']"
            />
          </div>
        </div>

        <div class="q-mt-xl">
          <q-btn
            unelevated
            color="primary"
            label="Edit"
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

const form = reactive({
  videoUrl: '',
  order: null,
  title: '',
  essayQuestion: '',
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
    const lesson = lessons.find((l) => Number(l.order ?? l.lessonOrder ?? 0) === order)

    if (!lesson) {
      $q.notify({ type: 'negative', message: 'Lesson tidak ditemukan.' })
      handleCancel()
      return
    }

    form.videoUrl = lesson.videoUrl || ''
    form.order = lesson.order || order
    form.title = lesson.title || ''
    form.essayQuestion = lesson.assignment?.essays?.[0]?.question || ''
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
    const payload = {
      order: Number(form.order),
      videoUrl: form.videoUrl,
      title: form.title,
      assignment: {
        essays: [
          {
            question: form.essayQuestion,
            wordLimit: 100,
          },
        ],
        multipleChoice: [],
      },
    }

    // Sesuai endpoint: PUT /api/packages/:packageId/lessons/:lessonOrder
    await api.put(`/packages/${route.params.id}/lessons/${route.params.order}`, payload)

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
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
