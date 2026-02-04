<template>
  <q-page class="q-pa-lg bg-blue-1">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 q-mb-xs">
        Dashboard / <span class="text-primary text-weight-medium">Rating dan Review</span>
      </div>
      <div class="text-h4 text-weight-bolder text-indigo-10">Review dan Rating</div>
      <div class="text-grey-7 q-mt-xs">
        Lihat feedback student ke kamu untuk setiap kelas yang kamu ajar.
      </div>
    </div>

    <!-- Search Bar -->
    <div class="q-mb-xl">
      <q-input
        v-model="search"
        dense
        outlined
        bg-color="white"
        placeholder="Cari kelas / tipe kelas"
        class="search-input"
      >
        <template #prepend>
          <q-icon name="search" color="grey-6" />
        </template>
      </q-input>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredReviews.length === 0" class="q-pa-xl flex flex-center">
      <q-card flat class="empty-card bg-blue-1 text-center">
        <div class="q-mb-lg">
          <q-img
            src="https://cdn.quasar.dev/img/avatar.png"
            style="width: 180px; max-width: 60vw"
            ratio="1"
            class="q-mx-auto"
          />
        </div>
        <div class="text-h5 text-weight-bolder text-indigo-10 q-mb-sm">
          Oops! Belum ada Review dan Rating dari Student.
        </div>
        <div class="text-body2 text-grey-7">
          Siswa Anda belum memberikan umpan balik. Ajak mereka untuk berbagi pengalaman belajar!
        </div>
      </q-card>
    </div>

    <!-- List Reviews -->
    <div v-else>
      <div class="row q-col-gutter-lg q-mb-lg">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card flat class="review-card bg-white rounded-borders-16 shadow-1 q-pa-md">
            <div class="row items-center q-mb-sm">
              <q-avatar size="42px" class="q-mr-sm">
                <img :src="review.imageUrl" />
              </q-avatar>
              <div>
                <div class="text-caption text-grey-6">{{ review.badge }}</div>
                <div class="text-subtitle2 text-weight-bold text-indigo-10 ellipsis-2-lines">
                  {{ review.title }}
                </div>
              </div>
            </div>

            <div class="text-caption text-grey-7 q-mt-xs ellipsis-3-lines">
              {{ review.comment }}
            </div>

            <div class="q-mt-md row items-center justify-between">
              <q-rating
                :model-value="review.rating"
                readonly
                max="5"
                size="20px"
                color="amber"
              />
              <div class="text-caption text-grey-6">
                {{ review.rating.toFixed(1) }}/5
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <div class="text-center q-mt-md">
        <q-btn
          unelevated
          color="primary"
          no-caps
          label="Lihat Semua Komentar"
          class="q-px-xl rounded-borders"
          @click="handleSeeAll"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const loading = ref(true)
const search = ref('')
const rawReviews = ref([])

const normalizedReviews = computed(() => {
  const list = Array.isArray(rawReviews.value) ? rawReviews.value : []
  return list.map((r) => {
    const pkg = r.package || r.course || {}
    return {
      id: r._id || r.id,
      title: pkg.title || pkg.name || 'Nama Course',
      badge: pkg.type || 'Program Course',
      imageUrl: pkg.imageUrl || 'https://cdn.quasar.dev/img/parallax2.jpg',
      comment:
        r.comment ||
        r.review ||
        'Sangat membantu, materi jelas, dan mentor menjelaskan dengan detail.',
      rating: Number(r.rating || r.stars || 5),
    }
  })
})

const filteredReviews = computed(() => {
  const q = (search.value || '').toLowerCase().trim()
  if (!q) return normalizedReviews.value
  return normalizedReviews.value.filter((item) => {
    return (
      (item.title || '').toLowerCase().includes(q) ||
      (item.badge || '').toLowerCase().includes(q)
    )
  })
})

async function fetchReviews() {
  loading.value = true
  try {
    // Asumsi endpoint: /reviews yang mengembalikan list review mentor
    const res = await api.get('/reviews')
    const data = res.data || {}
    rawReviews.value = data.reviews || data.data || (Array.isArray(data) ? data : [])
  } catch (err) {
    console.error('[Mentor Rating] Gagal memuat review:', err)
    rawReviews.value = []
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data review dan rating.',
    })
  } finally {
    loading.value = false
  }
}

function handleSeeAll() {
  // Placeholder - bisa diarahkan ke halaman detail komentar di masa depan
  $q.notify({
    type: 'info',
    message: 'Fitur detail komentar akan segera hadir.',
  })
}

onMounted(fetchReviews)
</script>

<style scoped>
.search-input {
  max-width: 420px;
}

.empty-card {
  max-width: 680px;
  border-radius: 24px;
  padding: 32px 24px;
}

.review-card {
  min-height: 220px;
}

.rounded-borders-16 {
  border-radius: 16px;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

