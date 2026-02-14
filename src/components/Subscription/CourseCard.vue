<template>
  <q-card
    flat
    class="course-card rounded-16 bg-white cursor-pointer shadow-subtle column full-height"
    @click="goToDetail"
  >
    <q-card-section class="q-pa-none">
      <div class="thumb-wrap">
        <IntroVideoThumbnail :course="course" />
        <div class="level-chip-overlay">
          <div class="custom-level-chip">
            <span class="dot-indicator"></span>
            {{ levelInfo }}
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md col column justify-between">
      <div class="col">
        <div class="text-caption text-weight-bold text-blue-primary text-uppercase q-mb-xs">
          {{ levelInfo }}
        </div>

        <div class="text-subtitle1 text-weight-bolder text-navy title-clamp q-mb-xs">
          {{ title }}
        </div>

        <div class="text-caption text-grey-7 description-clamp q-mb-md">
          {{ descriptionText }}
        </div>

        <div class="row items-center q-mb-lg">
          <q-avatar
            size="28px"
            color="blue-1"
            text-color="blue-primary"
            class="q-mr-sm text-weight-bold"
          >
            <span v-if="!mentorAvatar">{{ mentorName.charAt(0) }}</span>
            <img v-else :src="mentorAvatar" />
          </q-avatar>
          <div class="text-caption text-weight-medium text-grey-8">
            {{ mentorName }}
          </div>
        </div>
      </div>

      <div>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle1 text-weight-bolder text-blue-primary">
            {{ priceDisplay }}
          </div>

          <!-- 🔹 RATING DARI API (bukan dummy) -->
          <div class="row items-center text-grey-8">
            <q-icon name="star" color="orange-5" size="18px" />
            <span class="q-ml-xs text-weight-medium text-caption">
              {{ ratingDisplay }}
            </span>
          </div>
        </div>

        <q-btn
          unelevated
          color="blue-primary"
          class="full-width text-weight-bold no-caps br-12 py-sm"
          label="DAFTAR SEKARANG"
          @click.stop="goToDetail"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import IntroVideoThumbnail from '../Common/IntroVideoThumbnail.vue'

const props = defineProps({
  course: { type: Object, required: true },
})

const router = useRouter()

// 🔹 STATE untuk rating dari API
const avgRating = ref(0)
const totalRatings = ref(0)

const title = computed(() => props.course.name || props.course.title || 'Nama Course')
const mentorName = computed(() => props.course.mentor?.name || 'Mentor Edulang')
const mentorAvatar = computed(() => props.course.mentor?.avatar || null)
const levelInfo = computed(() => props.course.level || 'Pemula')

const priceDisplay = computed(() => {
  const price = props.course.price ?? props.course.priceIdr
  if (price === 0 || price === '0') return 'Rp 0'
  if (!price) return 'Gratis'
  return `Rp ${new Intl.NumberFormat('id-ID').format(price)}`
})

const descriptionText = computed(() => {
  return props.course.description || 'Belajar dari dasar hingga mahir...'
})

// 🔹 COMPUTED untuk display rating
const ratingDisplay = computed(() => {
  if (totalRatings.value === 0) {
    return '(0.0)'
  }
  // Format rating dengan 1 desimal
  return `(${avgRating.value.toFixed(1)})`
})

const goToDetail = () => {
  const id = props.course._id || props.course.id
  router.push(`/courses/${id}`)
}

// 🔹 FETCH RATING dari API
const fetchRating = async () => {
  try {
    const packageId = props.course._id || props.course.id
    if (!packageId) return

    const response = await api.get(`/ratings/packages/${packageId}`)
    const data = response.data.data || response.data

    avgRating.value = data.avgRating || 0
    totalRatings.value = data.totalRatings || 0
  } catch (error) {
    console.error('Error fetching rating:', error)
    // Jika error, biarkan default 0
    avgRating.value = 0
    totalRatings.value = 0
  }
}

// 🔹 FETCH saat component dimount
onMounted(() => {
  fetchRating()
})
</script>

<style scoped>
/* Main Colors */
.text-blue-primary {
  color: #0089ff;
}
.bg-blue-primary {
  background: #0089ff !important;
}
.text-navy {
  color: #003387;
}

/* Card Scaling */
.course-card {
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
}
.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 51, 135, 0.12) !important;
}

.shadow-subtle {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Thumbnail Styling - FIXED */
.thumb-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  background: #eee;
  overflow: hidden;
}

/* Level Chip Overlay (Custom Dot Style) */
.level-chip-overlay {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 10;
  pointer-events: none;
}

.custom-level-chip {
  background: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #444;
}

.dot-indicator {
  width: 6px;
  height: 6px;
  background: #0089ff;
  border-radius: 50%;
  margin-right: 6px;
}

/* Utilities */
.rounded-16 {
  border-radius: 16px;
}
.br-12 {
  border-radius: 12px;
}
.line-height-tight {
  line-height: 1.3;
}
.py-sm {
  padding-top: 10px;
  padding-bottom: 10px;
}

/* Multi-line ellipsis fix */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.title-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
