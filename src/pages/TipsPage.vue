<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-center q-mb-xl">
      <div class="col-12 col-md-10 text-center">
        <q-badge
          color="orange-2"
          text-color="orange-10"
          class="q-pa-sm q-px-md rounded-borders-12 text-weight-bold"
        >
          <q-icon name="auto_awesome" class="q-mr-xs" /> #TIPS & INFORMASI
        </q-badge>

        <h1 class="text-h3 text-weight-bolder text-edulang-navy q-mt-md q-mb-sm">
          Ruang Informasi <span class="text-edulang-blue">Edulang</span>
        </h1>

        <p class="text-subtitle1 text-grey-7 q-mx-auto text-center" style="max-width: 600px">
          Temukan panduan kuliah luar negeri, tips belajar bahasa, dan update terbaru seputar studi
          internasional.
        </p>
      </div>
    </div>

    <div class="row justify-center q-mb-xl">
      <div class="col-12 col-md-8">
        <q-input
          v-model="searchQuery"
          outlined
          rounded
          placeholder="Cari topik, tips, atau berita..."
          bg-color="white"
          class="shadow-edulang search-input"
          @update:model-value="filterArticles"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
          <template v-slot:append v-if="searchQuery">
            <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
          </template>
        </q-input>
      </div>
    </div>

    <div v-if="loading" class="flex flex-center column q-pa-xl">
      <q-spinner-ring color="primary" size="60px" thickness="4" />
      <div class="text-edulang-navy q-mt-md font-weight-medium">
        Menyusun informasi untuk Anda...
      </div>
    </div>

    <div
      v-else-if="error"
      class="text-center q-pa-xl bg-white rounded-borders-20 shadow-1 mx-auto"
      style="max-width: 400px"
    >
      <q-icon name="cloud_off" size="64px" color="negative" class="q-mb-md" />
      <div class="text-h6 text-grey-8 text-weight-bold">Koneksi Terputus</div>
      <div class="text-body2 text-grey-6">{{ error }}</div>
      <q-btn
        unelevated
        label="Coba Lagi"
        color="primary"
        class="q-mt-lg rounded-borders-12"
        @click="fetchArticles"
      />
    </div>

    <div v-else-if="filteredArticles.length > 0" class="row q-col-gutter-xl justify-center">
      <div v-for="article in filteredArticles" :key="article._id" class="col-12 col-sm-6 col-md-4">
        <q-card class="article-card shadow-edulang" @click="viewArticle(article)">
          <div class="relative-position">
            <q-img
              v-if="article.imageUrl"
              :src="getImageUrl(article.imageUrl)"
              :ratio="16 / 9"
              class="article-image"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-2">
                  <q-icon name="image_not_supported" size="48px" color="grey-4" />
                </div>
              </template>
            </q-img>
            <div v-else class="no-image-placeholder">
              <q-icon name="auto_stories" size="64px" color="grey-3" />
            </div>

            <q-badge
              color="edulang-yellow"
              text-color="black"
              class="absolute-top-left q-ma-md q-pa-sm text-weight-bold shadow-2"
            >
              NEW
            </q-badge>
          </div>

          <q-card-section class="q-pa-lg">
            <div class="row items-center q-gutter-x-sm q-mb-sm">
              <q-avatar size="24px" color="edulang-navy" text-color="white">
                {{ getAuthorName(article.author).charAt(0) }}
              </q-avatar>
              <div class="text-caption text-grey-8 text-weight-bold">
                {{ getAuthorName(article.author) }}
              </div>
              <q-icon name="circle" size="4px" color="grey-4" />
              <div class="text-caption text-grey-6">
                {{ formatDate(article.createdAt) }}
              </div>
            </div>

            <div class="text-h6 text-weight-bold text-edulang-navy line-clamp-2 title-link q-mb-sm">
              {{ article.title }}
            </div>

            <div class="text-body2 text-grey-7 line-clamp-3">
              {{ getExcerpt(article) }}
            </div>
          </q-card-section>

          <q-card-actions class="q-px-lg q-pb-lg">
            <q-btn
              flat
              no-caps
              label="Baca Selengkapnya"
              color="primary"
              class="text-weight-bolder q-px-none read-more-btn"
              icon-right="chevron_right"
              @click.stop="viewArticle(article)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div v-else class="text-center q-pa-xl">
      <q-icon name="receipt_long" size="80px" color="grey-3" />
      <div class="text-h5 text-grey-5 q-mt-md">Belum ada artikel yang dipublikasikan.</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()
const articles = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')

// Filtered articles based on search query
const filteredArticles = computed(() => {
  if (!searchQuery.value) {
    return articles.value
  }

  const query = searchQuery.value.toLowerCase().trim()

  return articles.value.filter((article) => {
    const title = article.title?.toLowerCase() || ''
    const content = article.content?.toLowerCase() || ''
    const excerpt = article.excerpt?.toLowerCase() || ''
    const authorName = getAuthorName(article.author).toLowerCase()

    return (
      title.includes(query) ||
      content.includes(query) ||
      excerpt.includes(query) ||
      authorName.includes(query)
    )
  })
})

// Fetch articles from API
const fetchArticles = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await api.get('/articles')

    console.log('API Response:', response.data)

    // Sesuaikan dengan struktur response API
    if (Array.isArray(response.data)) {
      articles.value = response.data
    } else if (response.data.data && Array.isArray(response.data.data)) {
      articles.value = response.data.data
    } else if (response.data.articles && Array.isArray(response.data.articles)) {
      articles.value = response.data.articles
    } else {
      throw new Error('Format response tidak sesuai')
    }

    console.log('Articles:', articles.value)
  } catch (err) {
    console.error('Error fetching articles:', err)
    error.value = err.response?.data?.message || 'Gagal mengambil data artikel. Silakan coba lagi.'

    Notify.create({
      type: 'negative',
      message: error.value,
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
}

// Filter articles (optional - jika ingin debounce)
const filterArticles = () => {
  // Computed property sudah otomatis filter
  // Function ini bisa digunakan untuk debounce jika diperlukan
}

// Get author name from author object
const getAuthorName = (author) => {
  if (!author) return 'Admin'

  // Jika author adalah object dengan property name
  if (typeof author === 'object' && author.name) {
    return author.name
  }

  // Jika author adalah string
  if (typeof author === 'string') {
    return author
  }

  return 'Admin'
}

// Get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''

  console.log('Image URL:', imageUrl)

  // Jika sudah URL lengkap
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // Jika relative path, gabungkan dengan base URL
  const baseURL = api.defaults.baseURL || ''
  // Hapus trailing slash dari baseURL dan leading slash dari imageUrl
  const cleanBaseURL = baseURL.replace(/\/$/, '')
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`

  return `${cleanBaseURL}${cleanImageUrl}`
}

// Get excerpt or truncate content
const getExcerpt = (article) => {
  // Prioritas: excerpt -> content -> placeholder
  if (article.excerpt) {
    return truncateContent(article.excerpt, 120)
  }

  if (article.content) {
    return truncateContent(article.content, 120)
  }

  return 'Tidak ada konten tersedia.'
}

// Truncate content
const truncateContent = (content, maxLength) => {
  if (!content) return ''

  // Remove HTML tags if any
  const plainText = content.replace(/<[^>]*>/g, '').trim()

  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength) + '...'
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

// View article detail - navigasi ke BacaArtikel (API memakai slug, bukan _id)
const viewArticle = (article) => {
  const slug = article?.slug || article?._id
  if (!slug) return
  router.push({ name: 'BacaArtikel', params: { slug } })
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
/* Color Palette from Edulang Guideline */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-yellow {
  background-color: #ffc42c !important;
}

/* Global Styling */
.rounded-borders-12 {
  border-radius: 12px;
}
.rounded-borders-20 {
  border-radius: 20px;
}

.shadow-edulang {
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.08) !important;
  border: 1px solid rgba(224, 230, 237, 0.5);
}

/* Card Styling */
.article-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px rgba(0, 51, 135, 0.12) !important;
}

.article-card:hover .title-link {
  color: #0089ff;
}

.article-card:hover .article-image {
  transform: scale(1.05);
}

.article-image {
  transition: transform 0.6s ease;
}

.no-image-placeholder {
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
}

/* Typography & Limits */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 3em;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
}

.read-more-btn {
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  letter-spacing: 0.5px;
  background: rgba(0, 137, 255, 0.05);
}

/* Search Bar Customization */
.search-input :deep(.q-field__control) {
  height: 60px;
  padding: 0 20px;
}

.search-input :deep(.q-field__marginal) {
  height: 60px;
}
</style>
