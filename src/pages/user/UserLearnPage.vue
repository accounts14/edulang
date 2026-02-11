<template>
  <q-page class="bg-edulang-white">
    <div class="row no-wrap full-height main-wrapper overflow-hidden">
      <div class="col main-content q-pa-lg q-pa-md-xl scroll">
        <div class="header-section q-mb-xl">
          <q-breadcrumbs gutter="sm" class="text-edulang-blue q-mb-md text-weight-bold">
            <q-breadcrumbs-el label="Materi" icon="auto_stories" />
            <q-breadcrumbs-el :label="'Pertemuan ' + currentOrder" />
          </q-breadcrumbs>

          <div class="row items-center no-wrap">
            <div class="accent-bar q-mr-md"></div>
            <div class="text-h4 text-weight-bolder text-edulang-navy">
              {{ currentLesson?.title || 'Judul Materi Belajar' }}
            </div>
          </div>
        </div>

        <div class="video-outer-container shadow-navy rounded-24 overflow-hidden bg-black">
          <div class="video-inner">
            <iframe
              v-if="currentLesson?.videoUrl"
              :src="videoEmbedUrl"
              class="full-width"
              style="aspect-ratio: 16/9; border: none"
              allowfullscreen
            />
            <div v-else class="flex flex-center text-grey-8" style="aspect-ratio: 16/9">
              <div class="column items-center">
                <q-icon name="smart_display" size="100px" color="grey-9" />
                <div class="text-h6 q-mt-md">Video tidak tersedia</div>
              </div>
            </div>
          </div>
        </div>

        <div class="content-tabs q-mt-xl bg-white rounded-20 shadow-soft q-pa-md">
          <q-tabs
            v-model="activeTab"
            align="left"
            no-caps
            class="text-grey-7"
            active-color="primary"
            indicator-color="primary"
            inline-label
          >
            <q-tab name="deskripsi" icon="description" label="Deskripsi Materi" class="q-px-lg" />
            <q-tab name="soal" icon="assignment" label="Latihan Soal" class="q-px-lg" />
          </q-tabs>

          <q-separator color="grey-2" />

          <q-tab-panels v-model="activeTab" animated class="bg-transparent q-mt-md">
            <q-tab-panel name="deskripsi" class="q-pa-md">
              <div class="text-body1 text-grey-9 line-height-relaxed">
                {{ currentLesson?.description || 'Tidak ada deskripsi untuk pertemuan ini.' }}
              </div>
            </q-tab-panel>

            <q-tab-panel name="soal" class="q-pa-md flex flex-center" style="min-height: 200px">
              <div class="text-center">
                <q-icon name="quiz" size="60px" color="edulang-blue" class="q-mb-md" />
                <div class="text-h6 text-edulang-navy q-mb-lg">
                  Sudah siap menguji pemahaman Anda?
                </div>
                <q-btn
                  unelevated
                  no-caps
                  color="primary"
                  label="Mulai Kerjakan Soal"
                  icon-right="arrow_forward"
                  class="rounded-12 q-px-xl q-py-sm text-weight-bold"
                  :to="soalRoute"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>

      <div class="sidebar-right bg-white shadow-soft column">
        <div
          class="q-pa-lg border-bottom bg-edulang-navy text-white relative-position overflow-hidden"
        >
          <div class="abs-decor-sidebar"></div>
          <div class="relative-position">
            <div class="text-subtitle1 text-weight-bolder">Kurikulum Belajar</div>
            <div class="text-caption text-blue-2">{{ lessons.length }} Pertemuan Tersedia</div>

            <q-linear-progress
              :value="packageData?.progress / 100 || 0"
              color="edulang-yellow"
              class="q-mt-md rounded-borders"
              size="8px"
            />
          </div>
        </div>

        <q-list class="col scroll q-py-md q-px-sm">
          <q-item
            v-for="lesson in lessons"
            :key="lesson.order"
            clickable
            v-ripple
            :active="Number(lesson.order) === Number(currentOrder)"
            active-class="active-lesson-item"
            class="rounded-16 q-mb-sm lesson-item transition-base"
            @click="goToLesson(lesson.order)"
          >
            <q-item-section avatar>
              <div
                class="order-badge flex flex-center"
                :class="
                  Number(lesson.order) === Number(currentOrder)
                    ? 'bg-primary text-white'
                    : 'bg-grey-2 text-grey-7'
                "
              >
                {{ lesson.order }}
              </div>
            </q-item-section>

            <q-item-section>
              <q-item-label
                :class="
                  Number(lesson.order) === Number(currentOrder)
                    ? 'text-primary text-weight-bold'
                    : 'text-edulang-navy text-weight-medium'
                "
              >
                Pertemuan {{ lesson.order }}
              </q-item-label>
              <q-item-label caption lines="1" class="text-grey-6">{{ lesson.title }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon
                :name="Number(lesson.order) === Number(currentOrder) ? 'play_circle' : 'lock_open'"
                :color="Number(lesson.order) === Number(currentOrder) ? 'primary' : 'grey-4'"
                size="20px"
              />
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
/* Edulang Brand Colors */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-navy {
  background-color: #003387;
}
.bg-edulang-white {
  background-color: #f5f7fa;
}
.text-edulang-yellow {
  color: #ffc42c;
}
.bg-edulang-yellow {
  background-color: #ffc42c;
}

.main-wrapper {
  height: calc(100vh - 50px);
}

.accent-bar {
  width: 6px;
  height: 40px;
  background: #0089ff;
  border-radius: 10px;
}

/* Video Container */
.video-outer-container {
  max-width: 1000px;
  width: 100%;
  border: 1px solid rgba(0, 51, 135, 0.1);
}

.shadow-navy {
  box-shadow: 0 20px 40px rgba(0, 51, 135, 0.15);
}

/* Sidebar Styling */
.sidebar-right {
  width: 350px;
  min-width: 350px;
  border-left: 1px solid #edf2f7;
  z-index: 10;
}

.abs-decor-sidebar {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.lesson-item {
  border: 1px solid transparent;
}

.active-lesson-item {
  background-color: #e6f3ff !important;
  border: 1px solid rgba(0, 137, 255, 0.2);
}

.order-badge {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 13px;
}

/* Utilities */
.rounded-24 {
  border-radius: 24px;
}
.rounded-20 {
  border-radius: 20px;
}
.rounded-16 {
  border-radius: 16px;
}
.rounded-12 {
  border-radius: 12px;
}

.shadow-soft {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.line-height-relaxed {
  line-height: 1.8;
}

.transition-base {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.border-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Custom Scrollbar for Sidebar */
.scroll::-webkit-scrollbar {
  width: 6px;
}
.scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

@media (max-width: 1200px) {
  .sidebar-right {
    width: 300px;
    min-width: 300px;
  }
}

@media (max-width: 900px) {
  .main-wrapper {
    flex-direction: column;
    overflow-y: auto;
  }
  .sidebar-right {
    width: 100%;
    height: auto;
    border-left: none;
    border-top: 1px solid #edf2f7;
  }
}
</style>
