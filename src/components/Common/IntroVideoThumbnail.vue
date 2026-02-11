<template>
  <div class="intro-video-thumbnail" @click.stop="togglePlay">
    <template v-if="!isPlaying">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        alt="Course thumbnail"
        class="thumbnail-img full-width full-height fit-cover"
        loading="eager"
        @error="onImgError"
      />

      <div
        v-else
        class="thumbnail-fallback full-width full-height flex flex-center flex-column"
        :style="fallbackBgStyle"
      >
        <q-img
          v-if="course?.languageType?.iconUrl"
          :src="course.languageType.iconUrl"
          width="64px"
          height="64px"
          class="q-mb-sm rounded-8"
        />
        <div class="fallback-text text-center">
          <div class="fallback-title">{{ courseTitle }}</div>
        </div>
      </div>

      <div class="play-overlay absolute-full flex flex-center">
        <q-icon name="play_circle_filled" size="64px" color="white" class="play-icon" />
      </div>
    </template>

    <template v-else-if="isPlaying && videoUrl">
      <video
        v-if="isVideoDirect"
        :src="videoUrl"
        class="thumbnail-video full-width full-height"
        controls
        autoplay
        playsinline
        @click.stop
      />
      <iframe
        v-else-if="embedUrl"
        :src="embedUrl"
        class="thumbnail-iframe full-width full-height"
        frameborder="0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
        "
        allowfullscreen
        @click.stop
      />
    </template>

    <div v-else class="thumbnail-placeholder full-width full-height flex flex-center bg-grey-9">
      <q-icon name="error_outline" size="48px" color="white" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  course: { type: Object, default: () => ({}) },
})

const isPlaying = ref(false)

const posterUrl = computed(() => {
  const c = props.course
  const thumb =
    c?.thumbnail || c?.thumbnailUrl || c?.imageUrl || c?.image_url || c?.image || c?.banner
  if (thumb) return thumb

  const u = videoUrl.value
  if (u && !isVideoDirect.value) {
    const ytId =
      u.match(/[?&]v=([^&]+)/)?.[1] ||
      u.match(/youtu\.be\/([^?&/]+)/)?.[1] ||
      u.match(/youtube\.com\/embed\/([^?&/]+)/)?.[1]
    if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
  }
  return null
})

const videoUrl = computed(() => {
  const c = props.course
  return (
    c?.introVideoUrl ||
    c?.intro_video_url ||
    c?.intro_url ||
    c?.introUrl ||
    c?.introVideo?.url ||
    ''
  )
})

const isVideoDirect = computed(() => {
  const u = videoUrl.value
  return u ? /\.(mp4|webm|ogg|mov)(\?|$)/i.test(u) || u.startsWith('blob:') : false
})

const embedUrl = computed(() => {
  const u = videoUrl.value
  if (!u || isVideoDirect.value) return ''
  if (u.includes('youtube.com/watch?v=')) {
    const m = u.match(/[?&]v=([^&]+)/)
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : ''
  }
  if (u.includes('youtu.be/')) {
    const m = u.match(/youtu\.be\/([^?&/]+)/)
    return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : ''
  }
  return u
})

const courseTitle = computed(() => props.course?.title || props.course?.name || 'Program Edulang')
const fallbackBgStyle = computed(() => ({
  background: 'linear-gradient(135deg, #003387 0%, #0089ff 100%)',
}))

function togglePlay() {
  if (!videoUrl.value) return
  isPlaying.value = !isPlaying.value
}

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
.intro-video-thumbnail {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px; /* Sedikit lebih tinggi agar proporsional */
  background: #000;
  border-radius: inherit;
  cursor: pointer;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Menghilangkan garis hitam */
  display: block;
}

.play-overlay {
  background: rgba(0, 0, 0, 0.3); /* Overlay halus agar icon play kontras */
  transition: background 0.3s ease;
}

.intro-video-thumbnail:hover .play-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.play-icon {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s ease;
}

.intro-video-thumbnail:hover .play-icon {
  transform: scale(1.1);
}

.thumbnail-video,
.thumbnail-iframe {
  width: 100%;
  height: 100%;
  background: #000;
}

.thumbnail-fallback {
  padding: 20px;
  color: white;
}

.fallback-title {
  font-size: 1.2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
