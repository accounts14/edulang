<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="!pkg" class="text-center q-pa-xl">
      <q-icon name="error_outline" size="64px" color="negative" class="q-mb-md" />
      <div class="text-h6 text-grey-9">Package tidak ditemukan</div>
      <q-btn class="q-mt-md" color="primary" unelevated no-caps label="Kembali" @click="goBack" />
    </div>

    <div v-else class="row q-col-gutter-xl items-start">
      <!-- Left: package info -->
      <div class="col-12 col-md-5 col-lg-4">
        <q-card class="no-shadow rounded-borders-16">
          <q-img :src="heroImage" :ratio="16 / 9" class="rounded-borders-16" />

          <q-card-section>
            <div class="text-caption text-grey-7 q-mb-xs">Title</div>
            <q-input v-model="pkgForm.title" dense outlined bg-color="white" />

            <div class="text-caption text-grey-7 q-mt-md q-mb-xs">Price</div>
            <q-input v-model.number="pkgForm.price" dense outlined type="number" bg-color="white" />

            <div class="text-caption text-grey-7 q-mt-md q-mb-xs">Description</div>
            <q-input
              v-model="pkgForm.description"
              dense
              outlined
              type="textarea"
              autogrow
              bg-color="white"
            />

            <div class="text-caption text-grey-7 q-mt-md q-mb-xs">Level</div>
            <q-input :model-value="pkg.level" dense outlined readonly bg-color="white" />

            <div class="text-caption text-grey-7 q-mt-md q-mb-xs">Type Language</div>
            <q-input
              :model-value="pkg.languageType?.name"
              dense
              outlined
              readonly
              bg-color="white"
            />

            <q-btn
              class="q-mt-lg"
              color="primary"
              unelevated
              no-caps
              label="Kembali"
              @click="goBack"
            />
          </q-card-section>
        </q-card>
      </div>

      <!-- Right: lessons list -->
      <div class="col-12 col-md-7 col-lg-8">
        <q-card class="no-shadow rounded-borders-16 q-pa-md">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold text-indigo-10">Lessons</div>
            <q-btn
              color="positive"
              unelevated
              no-caps
              label="Tambah Materi"
              class="rounded-borders"
              @click="goAddLesson"
            />
          </div>

          <div v-if="lessons.length === 0" class="text-center q-pa-xl text-grey-7">
            Belum ada materi. Klik <b>Tambah Materi</b> untuk menambahkan.
          </div>

          <q-list v-else bordered class="rounded-borders-16">
            <q-item
              v-for="lesson in lessons"
              :key="lesson.order"
              class="bg-primary text-white q-mb-sm rounded-borders"
            >
              <q-item-section avatar>
                <q-icon name="play_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  Pertemuan {{ lesson.order }} - ({{ lesson.title || 'Introduce' }})
                </q-item-label>
              </q-item-section>
              <q-item-section side class="text-white">
                <q-btn
                  flat
                  dense
                  round
                  icon="auto_awesome"
                  color="lime-3"
                  @click.stop="goGenerateSoal(lesson)"
                >
                  <q-tooltip>Generate Soal</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  color="yellow-4"
                  @click.stop="goEditLesson(lesson)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  color="red-4"
                  @click.stop="confirmDeleteLesson(lesson)"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <q-btn
            v-if="lessons.length > 0"
            class="q-mt-md full-width"
            color="positive"
            unelevated
            no-caps
            label="Tambah Video"
            @click="goAddLesson"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const pkg = ref(null)
const lessons = ref([])

const pkgForm = reactive({
  title: '',
  price: 0,
  description: '',
})

const heroImage = computed(() => {
  // placeholder image (bisa diganti kalau backend punya imageUrl)
  return 'https://cdn.quasar.dev/img/parallax2.jpg'
})

function goBack() {
  router.push('/mentor/dashboard')
}

function goAddLesson() {
  router.push(`/mentor/packages/${route.params.id}/lessons/add`)
}

function goEditLesson(lesson) {
  router.push(`/mentor/packages/${route.params.id}/lessons/${lesson.order}/edit`)
}

function goGenerateSoal(lesson) {
  router.push(`/mentor/packages/${route.params.id}/lessons/${lesson.order}/generate-soal`)
}

async function confirmDeleteLesson(lesson) {
  const id = route.params.id
  const order = lesson.order
  $q.dialog({
    title: 'Hapus Materi',
    message: `Yakin ingin menghapus pertemuan ${order}?`,
    ok: { label: 'Hapus', color: 'negative', flat: false },
    cancel: { label: 'Batal', flat: true },
  }).onOk(async () => {
    try {
      await api.delete(`/packages/${id}/lessons/${order}`)
      $q.notify({ type: 'positive', message: 'Materi berhasil dihapus.' })
      await fetchDetail()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Gagal menghapus materi.',
      })
    }
  })
}

function normalizeLessons(arr) {
  if (!Array.isArray(arr)) return []
  return [...arr]
    .map((l) => ({
      order: Number(l.order ?? l.lessonOrder ?? 0),
      videoUrl: l.videoUrl || l.urlVideo || '',
      // beberapa backend menyimpan judul dalam assignment / title
      title: l.title || l.judulMateri || l.assignment?.title || '',
    }))
    .filter((l) => l.order > 0)
    .sort((a, b) => a.order - b.order)
}

async function fetchDetail() {
  try {
    loading.value = true
    const res = await api.get(`/packages/${route.params.id}`)
    const p = res.data?.package || res.data?.data || res.data
    pkg.value = p
    lessons.value = normalizeLessons(p?.lessons)

    pkgForm.title = p?.title || ''
    pkgForm.price = p?.price || 0
    pkgForm.description = p?.description || ''
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat detail package.',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.rounded-borders-16 {
  border-radius: 16px;
  overflow: hidden;
}
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
