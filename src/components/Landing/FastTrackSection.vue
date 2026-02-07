<!-- src/components/landing/FastTrackSection.vue -->
<template>
  <section class="fasttrack-section container">
    <div class="row items-center justify-between section-header q-mb-lg">
      <div>
        <div class="fasttrack-tag text-weight-bold">Kelas Fast-Track</div>
        <h2 class="fasttrack-title text-weight-bold">Course Belajar Unggulan Edulang</h2>
      </div>
      <q-btn unelevated rounded class="btn-yellow" label="Lihat Semua Program" to="/berlangganan" />
    </div>

    <div v-if="loading" class="row q-col-gutter-md">
      <div class="col-12 col-md-4" v-for="n in 3" :key="n">
        <q-card flat bordered class="rounded-borders-16">
          <q-skeleton height="200px" square />
          <q-card-section>
            <q-skeleton type="text" class="text-h6" />
            <q-skeleton type="text" width="50%" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div class="col-12 col-md-4" v-for="pkg in displayedPackages" :key="pkg._id">
        <q-card
          flat
          bordered
          class="course-card rounded-borders-16 bg-white cursor-pointer"
          @click="goToDetail(pkg._id)"
        >
          <q-card-section class="q-pa-none">
            <div class="thumb-wrap rounded-borders-16-top">
              <IntroVideoThumbnail :course="pkg" />
              <div class="level-chip-overlay">
                <q-chip
                  dense
                  color="white"
                  text-color="dark"
                  icon="signal_cellular_alt"
                  class="text-weight-bold"
                >
                  {{ pkg.level }}
                </q-chip>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="text-caption text-orange-9 text-weight-bold q-mb-xs">{{ pkg.level }}</div>
            <div class="text-h6 text-weight-bold ellipsis text-dark q-mb-xs">{{ pkg.title }}</div>
            <div class="text-caption text-grey-7 ellipsis-2-lines q-mb-sm">
              {{ pkg.description }}
            </div>

            <div class="row items-center q-mb-md">
              <q-avatar size="24px" class="q-mr-sm">
                <img src="https://cdn.quasar.dev/img/avatar.png" alt="" />
              </q-avatar>
              <div class="text-caption text-weight-medium text-grey-9">
                {{ pkg.mentor?.name || 'Mentor Edulang' }}
              </div>
            </div>

            <div class="row items-center justify-between">
              <div class="price-text text-weight-bold">Rp {{ formatCurrency(pkg.price) }}</div>
              <div class="row items-center rating-text">
                <q-icon name="star" size="18px" />
                <span class="q-ml-xs text-weight-medium">(4.8)</span>
              </div>
            </div>

            <q-btn
              unelevated
              class="btn-yellow full-width text-weight-bold no-caps q-mt-md"
              label="Daftar Sekarang"
              style="border-radius: 8px"
              :to="`/courses/${pkg._id}`"
              @click.stop
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import IntroVideoThumbnail from '../Common/IntroVideoThumbnail.vue'

const $q = useQuasar()
const router = useRouter()
const displayedPackages = ref([])
const loading = ref(true)

function goToDetail(id) {
  if (!id) return
  router.push(`/courses/${id}`)
}

const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}

const fetchPackages = async () => {
  loading.value = true
  try {
    const response = await api.get('/packages')
    const data = response.data || {}
    const list = Array.isArray(data.packages)
      ? data.packages
      : Array.isArray(data.data)
        ? data.data
        : []
    const shuffled = [...list].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 3)
    if (selected.length === 0) {
      displayedPackages.value = []
      return
    }
    const results = await Promise.allSettled(
      selected.map((p) => api.get(`/packages/${p._id || p.id}`)),
    )
    const fullPackages = results.map((r, i) => {
      if (r.status === 'fulfilled' && r.value?.data) {
        const res = r.value.data
        const pkg = res.package ?? res.data ?? res
        if (pkg && typeof pkg === 'object') {
          return { ...selected[i], ...pkg, _id: pkg._id ?? selected[i]._id }
        }
      }
      return selected[i]
    })
    displayedPackages.value = fullPackages
  } catch (error) {
    console.error('API Error:', error)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat daftar kursus unggulan.',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPackages()
})
</script>

<style scoped>
.fasttrack-section {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.fasttrack-tag {
  color: var(--edulang-yellow);
  font-size: 0.9375rem;
}

.fasttrack-title {
  color: var(--edulang-black);
  font-size: clamp(1.35rem, 3vw, 1.5rem);
}

.btn-yellow {
  background: var(--edulang-yellow) !important;
  color: var(--edulang-black) !important;
}

.price-text {
  color: var(--edulang-blue);
  font-size: 1.1rem;
}

.rating-text {
  color: var(--edulang-yellow);
}

.rating-text span {
  color: var(--edulang-black);
  opacity: 0.8;
}

.btn-outline {
  border-color: var(--edulang-navy) !important;
  color: var(--edulang-navy) !important;
}

.rounded-borders-16-top {
  border-radius: 16px 16px 0 0;
}
.thumb-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
  display: block;
}
.thumb-wrap :deep(.intro-video-thumbnail) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.level-chip-overlay {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 1;
}
</style>
