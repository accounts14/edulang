<template>
  <div class="intro-video-thumbnail" @click.stop="togglePlay">
    <img
      v-if="!isPlaying && posterUrl"
      :src="posterUrl"
      alt=""
      class="thumbnail-img full-width full-height fit-cover"
      loading="eager"
      @error="onImgError"
    />
    <div
      v-else-if="!videoUrl"
      class="thumbnail-placeholder full-width full-height flex flex-center bg-grey-4"
    >
      <q-icon name="play_circle_outline" size="48px" color="grey-6" />
    </div>
    <template v-else>
      <video
        v-if="isVideoDirect && isPlaying"
        :src="videoUrl"
        class="thumbnail-video full-width full-height"
        controls
        autoplay
        playsinline
        @click.stop
      />
      <iframe
        v-else-if="embedUrl && isPlaying"
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
      <img
        v-else
        :src="posterUrl"
        alt=""
        class="thumbnail-img full-width full-height fit-cover"
        @error="onImgError"
      />
    </template>
    <div v-if="videoUrl && !isPlaying" class="play-overlay flex flex-center">
      <q-icon name="play_circle_filled" size="56px" color="white" class="play-icon" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  course: {
    type: Object,
    default: () => ({}),
  },
})

const isPlaying = ref(false)

const videoUrl = computed(() => {
  const c = props.course
  return (
    c?.introVideoUrl ||
    c?.intro_video_url ||
    c?.intro_url ||
    c?.introUrl ||
    c?.introVideo?.url ||
    c?.introVideo?.link ||
    ''
  )
})

const isVideoDirect = computed(() => {
  const u = videoUrl.value
  if (!u) return false
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(u) || u.startsWith('blob:')
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
  if (u.includes('vimeo.com')) {
    const m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    return m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1` : ''
  }
  if (u.includes('embed') || u.includes('iframe')) return u
  return u
})

const posterUrl = computed(() => {
  const c = props.course
  const thumb =
    c?.thumbnail || c?.thumbnailUrl || c?.imageUrl || c?.image_url || c?.introVideo?.thumbnail
  if (thumb) return thumb
  const u = videoUrl.value
  if (u && !isVideoDirect.value) {
    const ytId =
      u.match(/[?&]v=([^&]+)/)?.[1] ||
      u.match(/youtu\.be\/([^?&/]+)/)?.[1] ||
      u.match(/youtube\.com\/embed\/([^?&/]+)/)?.[1]
    if (ytId) return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
  }
  return 'https://placehold.co/640x360?text=Course'
})

function togglePlay() {
  if (!videoUrl.value) return
  isPlaying.value = !isPlaying.value
}

function onImgError(e) {
  if (e?.target && e.target.src !== FALLBACK_IMG) {
    e.target.src = FALLBACK_IMG
  }
}
const FALLBACK_IMG = 'https://placehold.co/640x360?text=Course'
</script>

<style scoped>
.intro-video-thumbnail {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 160px;
  background: #000;
  cursor: pointer;
}
.thumbnail-img,
.thumbnail-placeholder,
.thumbnail-video,
.thumbnail-iframe {
  position: absolute;
  inset: 0;
  object-fit: cover;
}
.thumbnail-video,
.thumbnail-iframe {
  object-fit: contain;
  background: #000;
}
.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.play-icon {
  opacity: 0.9;
}
</style>
