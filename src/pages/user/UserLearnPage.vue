<template>
  <q-page class="bg-grey-2">
    <div class="row no-wrap full-height main-wrapper">
      <div class="col main-content q-pa-lg scroll">
        <div class="header-section q-mb-lg">
          <q-breadcrumbs gutter="xs" class="text-azure q-mb-sm">
            <q-breadcrumbs-el label="Materi" icon="school" />
            <q-breadcrumbs-el :label="'Pertemuan ' + currentOrder" />
          </q-breadcrumbs>
          <div class="text-h5 text-weight-bolder text-navy">
            {{ currentLesson?.title || 'Judul Materi Belajar' }}
          </div>
        </div>

        <div class="video-outer-container">
          <div class="video-inner shadow-4 rounded-borders bg-black">
            <iframe
              v-if="currentLesson?.videoUrl"
              :src="videoEmbedUrl"
              class="full-width"
              style="aspect-ratio: 16/9; border: none"
              allowfullscreen
            />
            <div v-else class="flex flex-center text-grey-5" style="aspect-ratio: 16/9">
              <q-icon name="play_circle_filled" size="80px" />
            </div>
          </div>
        </div>

        <div class="content-tabs q-mt-xl">
          <q-tabs
            v-model="activeTab"
            align="left"
            no-caps
            class="text-grey-7"
            active-color="azure"
            indicator-color="azure"
          >
            <q-tab name="deskripsi" label="Deskripsi" />
            <q-tab name="soal" label="Latihan Soal" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="activeTab" animated class="bg-transparent q-mt-md">
            <q-tab-panel name="deskripsi" class="q-pa-none">
              <p class="text-body1 text-grey-9">
                {{ currentLesson?.description || 'Tidak ada deskripsi.' }}
              </p>
            </q-tab-panel>
            <q-tab-panel name="soal" class="q-pa-none">
              <q-btn
                unelevated
                color="azure"
                label="Mulai Kerjakan Soal"
                icon="quiz"
                :to="soalRoute"
              />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>

      <div class="sidebar-right bg-white shadow-1">
        <div class="q-pa-md border-bottom bg-grey-1">
          <div class="text-subtitle1 text-weight-bold text-navy">Kurikulum Belajar</div>
          <div class="text-caption text-grey-6">{{ lessons.length }} Pertemuan Tersedia</div>
        </div>

        <q-list class="q-py-md">
          <q-item
            v-for="lesson in lessons"
            :key="lesson.order"
            clickable
            v-ripple
            :active="Number(lesson.order) === Number(currentOrder)"
            active-class="active-lesson-item"
            class="q-mx-sm rounded-borders q-mb-xs lesson-item"
            @click="goToLesson(lesson.order)"
          >
            <q-item-section avatar>
              <q-icon
                :name="
                  Number(lesson.order) === Number(currentOrder) ? 'play_circle' : 'lock_outline'
                "
                :color="Number(lesson.order) === Number(currentOrder) ? 'azure' : 'grey-5'"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label
                :class="
                  Number(lesson.order) === Number(currentOrder)
                    ? 'text-navy text-weight-bold'
                    : 'text-grey-8'
                "
              >
                Pertemuan {{ lesson.order }}
              </q-item-label>
              <q-item-label caption lines="1">{{ lesson.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { packageEndpoints } from 'src/api/endpoints'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const packageData = ref(null)

const packageId = computed(() => route.params.packageId)
const currentOrder = computed(() => route.params.order || '1')

const lessons = computed(() => {
  const list = packageData.value?.lessons
  if (!Array.isArray(list)) return []
  return list.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

const currentLesson = computed(() =>
  lessons.value.find((l) => String(l.order) === String(currentOrder.value)),
)

const videoEmbedUrl = computed(() => {
  const url = currentLesson.value?.videoUrl
  if (!url) return ''
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0] || ''
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtube.com/watch?v=')) {
    const m = url.match(/[?&]v=([^&]+)/)
    return m ? `https://www.youtube.com/embed/${m[1]}` : ''
  }
  return url
})

const activeTab = ref('deskripsi')

const soalRoute = computed(() => ({
  name: 'UserSoal',
  params: { packageId: packageId.value, order: currentOrder.value },
}))

function goToLesson(order) {
  router.push({
    name: 'UserLearnLesson',
    params: { packageId: packageId.value, order: String(order) },
  })
}

async function fetchPackage() {
  if (!packageId.value) return
  loading.value = true
  try {
    let data
    try {
      // Utama: gunakan API User Progress (my-progress)
      const res = await api.get(`/userprogress/my-progress/${packageId.value}`)
      const body = res.data ?? {}
      data = body.data ?? body
    } catch {
      // Fallback jika endpoint my-progress belum tersedia
      const res = await api.get(packageEndpoints.detail(packageId.value))
      const body = res.data ?? {}
      data = body.data ?? body
    }

    const pkg = data.package ?? data.packageDetail ?? data
    packageData.value = {
      ...(typeof pkg === 'object' ? pkg : {}),
      lessons: data.lessons ?? pkg.lessons ?? [],
      progress: data.percentage ?? data.progress ?? data.progressPercent ?? pkg.progress ?? 0,
    }
  } catch {
    packageData.value = null
  } finally {
    loading.value = false
  }
}

watch(packageId, () => fetchPackage(), { immediate: true })

// Jika masuk lewat /dashboard/learn/:packageId (tanpa order di URL), redirect ke lesson 1
watch(
  () => route.params.order,
  (order) => {
    if (packageId.value && order === undefined) {
      router.replace({
        name: 'UserLearnLesson',
        params: { packageId: packageId.value, order: '1' },
      })
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* Variabel Warna sesuai Guideline Edulang */
.text-navy {
  color: #0a3967;
}
.text-azure {
  color: #0096d9;
}
.bg-navy {
  background-color: #0a3967;
}
.bg-azure {
  background-color: #0096d9;
}

.main-wrapper {
  height: calc(100vh - 50px); /* Sesuaikan dengan tinggi header Anda */
}

/* Membatasi Lebar Video Agar Tidak Terlalu Besar */
.video-outer-container {
  max-width: 900px; /* Ukuran ideal agar video tidak pecah di layar lebar */
  width: 100%;
}

.video-inner {
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Sidebar Styling - Lebih Modern */
.sidebar-right {
  width: 320px;
  min-width: 320px;
  border-left: 1px solid #e0e0e0;
}

.lesson-item {
  transition: all 0.2s ease;
}

.active-lesson-item {
  background-color: #e6f4fb !important; /* Warna Azure sangat muda */
  border-left: 4px solid #0096d9; /* Aksen Azure di samping */
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

/* Scrollbar halus untuk sidebar */
.scroll {
  scrollbar-width: thin;
  scrollbar-color: #0096d9 #f1f1f1;
}

@media (max-width: 1024px) {
  .sidebar-right {
    width: 280px;
    min-width: 280px;
  }
}

/* Responsif Mobile */
@media (max-width: 768px) {
  .main-wrapper {
    flex-direction: column;
    height: auto;
  }
  .sidebar-right {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e0e0e0;
  }
}
</style>
