<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-ring color="primary" size="80px" />
    </div>

    <div v-else-if="!pkg" class="text-center q-pa-xl">
      <q-card flat class="rounded-borders-16 q-pa-xl shadow-1">
        <q-icon name="search_off" size="100px" color="grey-4" />
        <div class="text-h5 text-grey-8 q-mt-md">Package tidak ditemukan</div>
        <q-btn
          class="q-mt-lg rounded-btn"
          color="edulang-navy"
          unelevated
          no-caps
          label="Kembali ke Dashboard"
          icon="arrow_back"
          @click="goBack"
        />
      </q-card>
    </div>

    <div v-else class="row q-col-gutter-xl items-start">
      <div class="col-12 col-md-4">
        <div class="text-h5 text-weight-bold text-edulang-navy q-mb-lg">Detail Package</div>
        <q-card flat class="content-card shadow-1 overflow-hidden">
          <q-img :src="heroImage" :ratio="16 / 9">
            <div class="absolute-bottom bg-transparent flex justify-end q-pa-sm">
              <q-badge color="edulang-blue" class="q-pa-sm rounded-btn shadow-2">
                {{ pkg.languageType?.name || 'Language' }}
              </q-badge>
            </div>
          </q-img>

          <q-card-section class="q-pa-lg q-gutter-y-md">
            <div>
              <label class="label-custom">Judul Package</label>
              <q-input
                v-model="pkgForm.title"
                dense
                outlined
                bg-color="white"
                color="edulang-blue"
                readonly
              />
            </div>

            <div>
              <label class="label-custom">Harga (IDR)</label>
              <q-input
                v-model.number="pkgForm.price"
                dense
                outlined
                type="number"
                bg-color="white"
                readonly
              >
                <template v-slot:prepend><span class="text-caption">Rp</span></template>
              </q-input>
            </div>

            <div>
              <label class="label-custom">Deskripsi</label>
              <q-input
                v-model="pkgForm.description"
                dense
                outlined
                type="textarea"
                autogrow
                bg-color="white"
                readonly
              />
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <label class="label-custom">Level</label>
                <q-input :model-value="pkg.level" dense outlined readonly bg-color="grey-1" />
              </div>
              <div class="col-6">
                <label class="label-custom">Status</label>
                <q-badge
                  color="positive"
                  class="full-width flex flex-center"
                  style="height: 40px; border-radius: 8px"
                >
                  AKTIF
                </q-badge>
              </div>
            </div>

            <q-btn
              class="full-width q-mt-lg rounded-btn"
              outline
              color="grey-7"
              no-caps
              label="Kembali"
              icon="chevron_left"
              @click="goBack"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <div class="row items-center justify-between q-mb-lg">
          <div class="text-h5 text-weight-bold text-edulang-navy">Daftar Materi</div>
          <q-btn
            color="edulang-blue"
            unelevated
            no-caps
            label="Tambah Materi Baru"
            icon="add"
            class="rounded-btn q-px-md"
            @click="goAddLesson"
          />
        </div>

        <div v-if="lessons.length === 0" class="empty-state text-center q-pa-xl">
          <q-img
            src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
            style="width: 120px; opacity: 0.5"
          />
          <div class="text-h6 text-grey-6 q-mt-md">Belum ada materi yang ditambahkan</div>
          <p class="text-grey-5">Silakan tambah materi video untuk paket belajar ini.</p>
        </div>

        <div v-else class="q-gutter-y-md">
          <q-card v-for="lesson in lessons" :key="lesson.order" flat class="lesson-card shadow-1">
            <q-item class="q-pa-md">
              <q-item-section avatar>
                <div class="order-badge flex flex-center">
                  {{ lesson.order }}
                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-edulang-navy text-subtitle1">
                  {{ lesson.title || 'Materi Pertemuan ' + lesson.order }}
                </q-item-label>
                <q-item-label caption class="row items-center">
                  <q-icon name="link" size="14px" class="q-mr-xs" />
                  {{ lesson.videoUrl }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="auto_awesome"
                    @click="goGenerateSoal(lesson)"
                  >
                    <q-tooltip>Generate Soal AI</q-tooltip>
                  </q-btn>
                  <q-btn flat round color="orange-8" icon="edit" @click="goEditLesson(lesson)">
                    <q-tooltip>Edit Materi</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    @click="confirmDeleteLesson(lesson)"
                  >
                    <q-tooltip>Hapus</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-card>
        </div>

        <q-btn
          v-if="lessons.length > 0"
          class="q-mt-xl full-width rounded-btn border-dashed"
          outline
          color="edulang-blue"
          no-caps
          label="Klik untuk Tambah Video Lagi"
          icon="add_circle_outline"
          @click="goAddLesson"
        />
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
/* Color Overrides based on Edulang Guideline */
.text-edulang-navy {
  color: #003387;
}
.bg-edulang-navy {
  background-color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-blue {
  background-color: #0089ff;
}

/* UI Styling */
.rounded-borders-16 {
  border-radius: 16px;
}

.rounded-btn {
  border-radius: 10px;
  font-weight: 600;
}

.content-card {
  border-radius: 20px;
  background: white;
  border: 1px solid #eef0f3;
}

.lesson-card {
  border-radius: 16px;
  background: white;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.lesson-card:hover {
  transform: translateY(-3px);
  border-color: #0089ff;
  box-shadow: 0 10px 20px rgba(0, 51, 135, 0.08) !important;
}

.label-custom {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #003387;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-badge {
  width: 40px;
  height: 40px;
  background-color: #f5f7fa;
  color: #003387;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.1rem;
  border: 1px solid #e0e4e9;
}

.empty-state {
  background: white;
  border: 2px dashed #d1d9e2;
  border-radius: 24px;
}

.border-dashed {
  border-style: dashed !important;
  border-width: 2px;
}
</style>
