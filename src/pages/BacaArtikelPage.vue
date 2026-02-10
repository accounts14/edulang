<template>
  <q-page class="baca-artikel-page bg-grey-1 q-pa-md q-pa-md-xl">
    <div class="row justify-center">
      <div class="col-12 col-md-9 col-lg-7">
        <q-btn
          flat
          no-caps
          class="q-mb-xl back-btn"
          color="primary"
          icon="arrow_back"
          label="Kembali ke Informasi"
          @click="$router.push({ name: 'TipsInformasiPage' })"
        />

        <div v-if="loading" class="flex flex-center q-pa-xl column">
          <q-spinner-ring color="primary" size="64px" thickness="4" />
          <div class="q-mt-md text-grey-7 font-weight-medium">
            Memuat konten terbaik untuk Anda...
          </div>
        </div>

        <div
          v-else-if="!article"
          class="text-center q-pa-xl bg-white rounded-borders shadow-edulang"
        >
          <q-icon name="article" size="80px" color="grey-3" />
          <div class="text-h5 text-edulang-navy text-weight-bold q-mt-md">
            Artikel Tidak Ditemukan
          </div>
          <p class="text-grey-6">
            Maaf, artikel yang Anda cari mungkin telah dipindahkan atau dihapus.
          </p>
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Jelajahi Artikel Lain"
            class="q-mt-md rounded-borders-12 q-px-lg"
            @click="$router.push({ name: 'TipsInformasiPage' })"
          />
        </div>

        <template v-else>
          <div
            class="bg-white q-pa-md q-pa-md-xl rounded-borders-24 shadow-edulang article-container"
          >
            <header class="q-mb-xl text-center">
              <q-badge
                color="orange-1"
                text-color="orange-10"
                class="q-pa-xs q-px-md text-weight-bold q-mb-md"
              >
                BLOG & ARTIKEL
              </q-badge>
              <h1
                class="text-h3 text-weight-bolder text-edulang-navy leading-tight q-mt-none q-mb-md"
              >
                {{ article.title }}
              </h1>

              <div class="row items-center justify-center q-gutter-sm text-grey-6">
                <div class="row items-center">
                  <q-icon name="today" size="xs" class="q-mr-xs" />
                  {{ formatDate(article.createdAt) }}
                </div>
                <q-separator vertical inset />
                <div class="row items-center">
                  <q-icon name="person_outline" size="xs" class="q-mr-xs" />
                  {{ getAuthorName(article.author) || 'Tim Edulang' }}
                </div>
              </div>
            </header>

            <div class="media-container q-mb-xl overflow-hidden shadow-2">
              <template v-if="article.videoUrl">
                <div class="video-wrapper">
                  <iframe
                    :src="videoEmbedUrl"
                    frameborder="0"
                    allowfullscreen
                    allow="
                      accelerometer;
                      autoplay;
                      clipboard-write;
                      encrypted-media;
                      gyroscope;
                      picture-in-picture;
                    "
                  />
                </div>
              </template>

              <template v-else-if="article.imageUrl">
                <q-img
                  :src="getImageUrl(article.imageUrl)"
                  class="article-featured-image"
                  position="50% 50%"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-2 text-grey-4">
                      <q-icon name="broken_image" size="48px" />
                    </div>
                  </template>
                </q-img>
              </template>
            </div>

            <div class="article-body text-body1 text-grey-9" v-html="formattedContent" />

            <q-separator class="q-my-xl" />

            <div class="author-card row items-center q-pa-lg rounded-borders-12 bg-grey-1">
              <q-avatar size="60px" color="edulang-navy" text-color="white" class="q-mr-lg">
                {{ getAuthorName(article.author).charAt(0) || 'E' }}
              </q-avatar>
              <div class="col">
                <div class="text-subtitle2 text-grey-6 q-mb-xs">Ditulis oleh</div>
                <div class="text-h6 text-edulang-navy text-weight-bold">
                  {{ getAuthorName(article.author) || 'Tim Edulang' }}
                </div>
                <div class="text-caption text-grey-7">
                  Education Consultant Specialist at Edulang
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const article = ref(null)
const loading = ref(true)

const articleSlug = computed(() => route.params.slug)

const videoEmbedUrl = computed(() => {
  const url = article.value?.videoUrl
  if (!url) return ''
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0] || ''
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtube.com/watch?v=')) {
    const m = url.match(/[?&]v=([^&]+)/)
    return m ? `https://www.youtube.com/embed/${m[1]}` : ''
  }
  return url
})

const formattedContent = computed(() => {
  const c = article.value?.content || ''
  if (!c) return ''
  return c.replace(/\n/g, '<br />')
})

function getImageUrl(imageUrl) {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl
  const baseURL = api.defaults.baseURL || ''
  const cleanBaseURL = baseURL.replace(/\/$/, '')
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  return `${cleanBaseURL}${cleanImageUrl}`
}

function getAuthorName(author) {
  if (!author) return ''
  if (typeof author === 'object' && author.name) return author.name
  if (typeof author === 'string') return author
  return ''
}

function formatDate(dateString) {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

async function fetchArticle() {
  if (!articleSlug.value) {
    loading.value = false
    return
  }
  loading.value = true
  article.value = null
  try {
    const res = await api.get(`/articles/${encodeURIComponent(articleSlug.value)}`)
    article.value = res.data?.article ?? res.data?.data ?? res.data ?? null
    if (!article.value) {
      article.value = null
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat artikel.',
    })
    article.value = null
  } finally {
    loading.value = false
  }
}

watch(articleSlug, fetchArticle, { immediate: true })
</script>

<style scoped>
/* Colors & Helpers */
.text-edulang-navy {
  color: #003387;
}
.shadow-edulang {
  box-shadow: 0 15px 45px rgba(0, 51, 135, 0.05) !important;
}
.rounded-borders-24 {
  border-radius: 24px;
}
.rounded-borders-12 {
  border-radius: 12px;
}
.leading-tight {
  line-height: 1.2;
}

/* Container Styling */
.article-container {
  border: 1px solid rgba(0, 51, 135, 0.05);
}

.back-btn {
  transition: transform 0.3s ease;
  font-weight: 600;
}
.back-btn:hover {
  transform: translateX(-5px);
  background: transparent !important;
}

/* Media Styling (Image agar tidak terlalu besar) */
.media-container {
  border-radius: 16px;
  max-width: 850px; /* Batas lebar gambar */
  margin-left: auto;
  margin-right: auto;
}

.article-featured-image {
  max-height: 450px; /* Membatasi tinggi gambar */
  object-fit: cover;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 ratio */
  height: 0;
}
.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Typography & Content Layout */
.article-body {
  line-height: 1.8;
  letter-spacing: 0.2px;
  max-width: 800px;
  margin: 0 auto;
}

/* Mengatur style tag-tag HTML dalam konten (v-html) */
.article-body :deep(br) {
  content: '';
  display: block;
  margin-bottom: 1.2em;
}

.article-body :deep(h2),
.article-body :deep(h3) {
  color: #003387;
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 0.8em;
}

.author-card {
  border: 1px solid rgba(0, 51, 135, 0.08);
}

/* Responsivitas */
@media (max-width: 600px) {
  .text-h3 {
    font-size: 1.8rem;
  }
  .article-container {
    padding: 24px !important;
  }
  .article-featured-image {
    max-height: 250px;
  }
}
</style>
