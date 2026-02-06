<template>
  <q-card flat bordered class="rounded-borders-16 bg-white course-card cursor-pointer" @click="goToDetail">
    <q-card-section class="q-pa-none">
      <q-img :src="thumbnailSrc" :ratio="16 / 9" class="rounded-borders-16-top" />
    </q-card-section>
    <q-card-section>
      <div class="text-caption text-orange-9 text-weight-bold q-mb-xs">
        {{ levelInfo }}
      </div>
      <div class="text-subtitle1 text-weight-bolder q-mb-xs">
        {{ title }}
      </div>
      <div class="text-caption text-grey-7 q-mb-sm">
        {{ meetingInfo }}
      </div>

      <div class="row items-center justify-between q-mt-md">
        <div>
          <div class="text-caption text-grey-6">Investasi mulai dari</div>
          <div class="text-weight-bolder text-primary text-subtitle1">
            {{ priceDisplay }}
          </div>
        </div>
        <q-btn
          unelevated
          dense
          color="warning"
          text-color="black"
          no-caps
          class="text-weight-bold q-px-md"
          label="Daftar Sekarang"
          @click.stop="goToDetail"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

// Mapping bahasa ke thumbnail
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

const thumbnailSrc = computed(() => {
  // Prioritas: 1. Thumbnail dari course, 2. Berdasarkan nama bahasa, 3. Default
  if (props.course.thumbnail || props.course.imageUrl) {
    return props.course.thumbnail || props.course.imageUrl
  }

  // Cek apakah ada nama course/title yang cocok dengan mapping bahasa
  const courseName = props.course.name || props.course.title || ''

  // Cari thumbnail berdasarkan nama bahasa
  const matchedThumbnail = languageThumbnails[courseName]

  if (matchedThumbnail) {
    return matchedThumbnail
  }

  // Fallback ke gambar default
  return 'https://cdn.quasar.dev/img/mountains.jpg'
})

const title = computed(() => props.course.name || props.course.title || 'Nama Course')

const priceDisplay = computed(() => {
  const price = props.course.price || props.course.priceIdr || props.course.price_idr
  if (!price && price !== 0) return 'Harga belum tersedia'
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `Rp ${price}`
  }
})

const meetingInfo = computed(() => {
  const total = props.course.totalMeeting || props.course.total_meeting || props.course.meetingCount
  if (!total) return 'Jadwal menyesuaikan'
  return `${total} Pertemuan`
})

const levelInfo = computed(() => props.course.level || props.course.levelName || 'Semua level')

const goToDetail = () => {
  const id = props.course._id || props.course.id
  if (!id) return
  router.push(`/courses/${id}`)
}
</script>

<style scoped>
.rounded-borders-16 {
  border-radius: 16px;
}

.rounded-borders-16-top {
  border-radius: 16px 16px 0 0;
}

.course-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}
</style>
