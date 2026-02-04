<!-- src/components/landing/FastTrackSection.vue -->
<template>
  <section class="fasttrack-section container">
    <div class="row items-center justify-between section-header q-mb-lg">
      <div>
        <div class="fasttrack-tag text-weight-bold">Kelas Fast-Track</div>
        <h2 class="fasttrack-title text-weight-bold">Course Belajar Unggulan Edulang</h2>
      </div>
      <q-btn unelevated rounded class="btn-yellow" label="Lihat Semua Program" />
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
      <div class="col-12 col-md-4" v-for="pkg in packages" :key="pkg._id">
        <q-card flat bordered class="course-card rounded-borders-16 full-height column">
          <q-img
            :src="pkg.introVideoUrl || 'https://placehold.co/600x400?text=Course+Thumbnail'"
            :ratio="16 / 9"
            class="rounded-borders-16-top"
          >
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
              <div class="price-text text-weight-bold">
                Rp {{ formatCurrency(pkg.price) }}
              </div>
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
              outline
              class="btn-outline full-width text-weight-bold"
              label="LIHAT DETAIL"
              style="border-radius: 8px"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const packages = ref([])
const loading = ref(true)

const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}

const fetchPackages = async () => {
  loading.value = true
  try {
    const response = await api.get('/packages')
    if (response.data && Array.isArray(response.data.packages)) {
      packages.value = response.data.packages
    } else {
      packages.value = []
    }
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
</style>