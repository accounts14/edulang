<template>
  <q-page class="user-learn-page bg-grey-2">
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="!packageData" class="q-pa-xl text-center">
      <q-icon name="error_outline" size="48px" color="negative" />
      <div class="text-h6 q-mt-md">Package tidak ditemukan</div>
      <q-btn
        flat
        no-caps
        color="primary"
        label="Kembali ke Langganan"
        :to="{ name: 'UserLangganan' }"
      />
    </div>

    <div v-else class="row no-wrap full-height">
      <!-- Konten utama: video + tab Deskripsi / Soal -->
      <div class="col q-pa-md scroll-area">
        <!-- Video -->
        <div class="video-wrapper rounded-borders bg-black q-mb-md">
          <template v-if="currentLesson?.videoUrl">
            <iframe
              :src="videoEmbedUrl"
              class="full-width"
              style="aspect-ratio: 16/9; height: auto; min-height: 320px"
              frameborder="0"
              allowfullscreen
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
              "
            />
          </template>
          <div
            v-else
            class="flex flex-center text-white"
            style="aspect-ratio: 16/9; min-height: 320px"
          >
            <div class="text-center">
              <q-icon name="ondemand_video" size="64px" />
              <div class="q-mt-sm">Video pertemuan {{ currentOrder }}</div>
            </div>
          </div>
        </div>

        <!-- Tab Deskripsi | Soal -->
        <q-tabs v-model="activeTab" dense align="left" class="text-grey-8">
          <q-tab name="deskripsi" label="Deskripsi" />
          <q-tab name="soal" label="Soal" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="activeTab" animated class="bg-transparent">
          <q-tab-panel name="deskripsi" class="q-pa-none q-pt-md">
            <div class="text-body1 text-grey-8" style="white-space: pre-line">
              {{ currentLesson?.title || packageData.title || '' }}
              {{ packageData.description || 'Deskripsi materi untuk pertemuan ini.' }}
            </div>
          </q-tab-panel>
          <q-tab-panel name="soal" class="q-pa-none q-pt-md">
            <div class="text-h6 text-weight-bold text-grey-9 q-mb-sm">
              Soal Course - Pertemuan {{ currentOrder }}
            </div>
            <div class="text-body2 text-grey-7 q-mb-md">
              Kerjakan soal untuk pertemuan ini. Klik tombol di bawah untuk mulai.
            </div>
            <q-btn
              unelevated
              no-caps
              color="primary"
              size="lg"
              label="Kerjakan Soal"
              icon="quiz"
              :to="soalRoute"
              class="rounded-borders"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <!-- Sidebar kanan: daftar pertemuan -->
      <div class="sidebar-pertemuan bg-grey-3 q-pa-md">
        <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-sm">Selamat Belajar</div>
        <div class="text-caption text-grey-7 q-mb-md">Materi Belajar</div>
        <q-list dense>
          <q-item
            v-for="lesson in lessons"
            :key="lesson.order"
            clickable
            :active="Number(lesson.order) === Number(currentOrder)"
            active-class="bg-primary text-white rounded-borders"
            class="rounded-borders q-mb-xs"
            @click="goToLesson(lesson.order)"
          >
            <q-item-section avatar>
              <q-icon name="play_circle_outline" size="sm" />
            </q-item-section>
            <q-item-section>
              <q-item-label
                >Pertemuan {{ lesson.order }} -
                {{ lesson.title || lesson.judulMateri || 'Materi' }}</q-item-label
              >
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
    const res = await api.get(packageEndpoints.detail(packageId.value))
    packageData.value = res.data?.data ?? res.data ?? null
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
.user-learn-page {
  min-height: calc(100vh - 50px);
}
.scroll-area {
  min-width: 0;
  overflow: auto;
}
.sidebar-pertemuan {
  width: 280px;
  min-width: 280px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}
@media (max-width: 768px) {
  .sidebar-pertemuan {
    width: 100%;
    min-width: 100%;
    border-left: none;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }
}
</style>
