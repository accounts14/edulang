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
          class="course-card rounded-borders-16 full-height column cursor-pointer"
          @click="goToDetail(pkg._id)"
        >
          <q-img :src="getThumbnail(pkg)" :ratio="16 / 9" class="rounded-borders-16-top">
            <div class="absolute-bottom-right bg-transparent q-pa-sm">
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
          </q-img>

          <q-card-section class="q-pb-none">
            <div class="text-h6 text-weight-bold ellipsis text-dark">{{ pkg.title }}</div>
            <div class="text-caption text-grey-7 ellipsis-2-lines q-mt-xs">
              {{ pkg.description }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-md">
            <div class="row items-center q-mb-md">
              <q-avatar size="24px" class="q-mr-sm">
                <img src="https://cdn.quasar.dev/img/avatar.png" />
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
          </q-card-section>

          <q-space />

          <q-card-actions class="q-pa-md">
            <q-btn
              unelevated
              class="btn-yellow full-width text-weight-bold no-caps"
              label="Daftar Sekarang"
              style="border-radius: 8px"
              :to="`/courses/${pkg._id}`"
              @click.stop
            />
          </q-card-actions>
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

const $q = useQuasar()
const router = useRouter()
const displayedPackages = ref([])
const loading = ref(true)

// Thumbnail per bahasa (sama seperti BerlanggananPage / CourseCard)
const languageThumbnails = {
  'Bahasa Arab': 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
  'Bahasa German': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
  'Bahasa Inggris': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  'Bahasa Inggris (British)':
    'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80',
  'Bahasa Jepang': 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80',
  'Bahasa Korea': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80',
  'Bahasa Mandarin': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
  'Bahasa Mandarin (Taiwan)':
    'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=800&q=80',
}

function getThumbnail(pkg) {
  if (pkg.introVideoUrl) return pkg.introVideoUrl
  if (pkg.thumbnail || pkg.imageUrl) return pkg.thumbnail || pkg.imageUrl
  const langName = pkg.languageType?.name || pkg.languageType?.label || ''
  if (langName && languageThumbnails[langName]) return languageThumbnails[langName]
  return 'https://placehold.co/600x400?text=Course+Thumbnail'
}

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
    const list =
      response.data && Array.isArray(response.data.packages) ? response.data.packages : []
    // Tampil hanya 3, acak setiap kali data dimuat (berganti-ganti secara random)
    const shuffled = [...list].sort(() => Math.random() - 0.5)
    displayedPackages.value = shuffled.slice(0, 3)
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
</style>
