<template>
  <div class="user-course-thumbnail" @click="togglePlay">
    <!-- Poster/thumbnail -->
    <img
      v-if="!isPlaying && posterUrl"
      :src="posterUrl"
      alt=""
      class="thumbnail-img full-width full-height fit-cover"
    />
    <!-- Fallback jika tidak ada video -->
    <div
      v-else-if="!videoUrl"
      class="thumbnail-placeholder full-width full-height flex flex-center bg-grey-4"
    >
      <q-icon name="play_circle_outline" size="64px" color="grey-6" />
    </div>
    <!-- Video embed (playable) -->
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
      <img v-else :src="posterUrl" alt="" class="thumbnail-img full-width full-height fit-cover" />
    </template>
    <!-- Play overlay when not playing -->
    <div v-if="videoUrl && !isPlaying" class="play-overlay flex flex-center">
      <q-icon name="play_circle_filled" size="64px" color="white" class="play-icon" />
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
  return c?.introVideoUrl || c?.intro_url || c?.introUrl || ''
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
    const m = u.match(/youtu\.be\/([^?]+)/)
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
  if (c?.thumbnail || c?.imageUrl) return c.thumbnail || c.imageUrl
  const u = videoUrl.value
  if (u && !isVideoDirect.value) {
    const ytId = u.match(/[?&]v=([^&]+)/)?.[1] || u.match(/youtu\.be\/([^?]+)/)?.[1]
    if (ytId) return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
  }
  return 'https://placehold.co/640x360?text=Course'
})

function togglePlay() {
  if (!videoUrl.value) return
  isPlaying.value = !isPlaying.value
}
</script>

<style scoped>
.user-course-thumbnail {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 180px;
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
