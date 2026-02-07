<template>
  <q-card
    flat
    bordered
    class="rounded-borders-16 bg-white course-card cursor-pointer"
    @click="goToDetail"
  >
    <q-card-section class="q-pa-none">
      <div class="thumb-wrap rounded-borders-16-top">
        <IntroVideoThumbnail :course="course" />
        <div class="level-chip-overlay">
          <q-chip
            dense
            color="white"
            text-color="dark"
            icon="signal_cellular_alt"
            class="text-weight-bold"
          >
            {{ levelInfo }}
          </q-chip>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="text-caption text-orange-9 text-weight-bold q-mb-xs">{{ levelInfo }}</div>
      <div class="text-h6 text-weight-bold ellipsis text-dark q-mb-xs">{{ title }}</div>
      <div class="text-caption text-grey-7 ellipsis-2-lines q-mb-sm">{{ descriptionText }}</div>

      <div class="row items-center q-mb-md">
        <q-avatar size="24px" class="q-mr-sm">
          <img src="https://cdn.quasar.dev/img/avatar.png" alt="" />
        </q-avatar>
        <div class="text-caption text-weight-medium text-grey-9">
          {{ mentorName }}
        </div>
      </div>

      <div class="row items-center justify-between">
        <div class="price-text text-weight-bold">{{ priceDisplay }}</div>
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
        @click.stop="goToDetail"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import IntroVideoThumbnail from '../Common/IntroVideoThumbnail.vue'

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

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

const descriptionText = computed(() => {
  const desc = props.course.description
  if (desc) return desc
  const total = props.course.totalMeeting || props.course.total_meeting || props.course.meetingCount
  if (!total) return 'Jadwal menyesuaikan'
  return `${total} Pertemuan`
})

const mentorName = computed(
  () => props.course.mentor?.name || props.course.mentor?.email || 'Mentor Edulang',
)

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
.price-text {
  color: var(--edulang-blue, #1976d2);
  font-size: 1.1rem;
}
.rating-text {
  color: var(--edulang-yellow, #ffc107);
}
.rating-text span {
  color: var(--edulang-black, #212121);
  opacity: 0.8;
}
.btn-yellow {
  background: var(--edulang-yellow, #ffc42c) !important;
  color: var(--edulang-black, #212121) !important;
}
.course-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}
</style>
