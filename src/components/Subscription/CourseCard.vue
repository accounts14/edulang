<template>
  <q-card flat bordered class="rounded-borders-16 bg-white course-card">
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
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
})

const thumbnailSrc = computed(
  () =>
    props.course.thumbnail || props.course.imageUrl || 'https://cdn.quasar.dev/img/mountains.jpg',
)

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
