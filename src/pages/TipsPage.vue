<template>
  <q-page class="q-pa-xl bg-blue-1">
    <div class="row justify-between items-center q-mb-md">
      <div class="col-12 col-md-8">
        <div class="text-orange-9 text-weight-bold">#Tips & Informasi</div>
        <div class="text-h4 text-weight-bolder text-indigo-10 q-mt-sm">
          Ruang Tips & Informasi Edulang
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="row q-mb-xl">
      <div class="col-12 col-md-6">
        <q-input
          v-model="searchQuery"
          filled
          placeholder="Cari artikel..."
          bg-color="white"
          @update:model-value="filterArticles"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append v-if="searchQuery">
            <q-icon name="close" class="cursor-pointer" @click="clearSearch" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-center column q-pa-xl text-grey-7">
      <q-spinner-dots color="primary" size="40px" class="q-mb-md" />
      <div>Mengambil data artikel...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center q-pa-xl">
      <q-icon name="error_outline" size="48px" color="negative" class="q-mb-md" />
      <div class="text-h6 text-grey-6">{{ error }}</div>
      <q-btn flat label="Coba Lagi" color="primary" class="q-mt-md" @click="fetchArticles" />
    </div>

    <!-- Articles List -->
    <div v-else-if="filteredArticles.length > 0" class="row q-col-gutter-md">
      <div v-for="article in filteredArticles" :key="article._id" class="col-12 col-sm-6 col-md-4">
        <q-card class="my-card cursor-pointer" @click="viewArticle(article._id)">
          <!-- Image -->
          <q-img
            v-if="article.imageUrl"
            :src="getImageUrl(article.imageUrl)"
            :ratio="16 / 9"
            class="article-image"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3">
                <q-icon name="broken_image" size="48px" color="grey-5" />
              </div>
            </template>
            <template v-slot:loading>
              <div class="absolute-full flex flex-center bg-grey-2">
                <q-spinner color="primary" size="32px" />
              </div>
            </template>
          </q-img>

          <!-- Placeholder jika tidak ada gambar -->
          <div v-else class="no-image-placeholder">
            <q-icon name="article" size="64px" color="grey-5" />
          </div>

          <q-card-section>
            <div class="text-h6 text-weight-bold line-clamp-2">
              {{ article.title }}
            </div>
            <div class="text-subtitle2 text-grey-7 q-mt-xs">
              Oleh: {{ getAuthorName(article.author) }}
            </div>
            <div class="text-caption text-grey-6 q-mt-xs">
              <q-icon name="schedule" size="16px" class="q-mr-xs" />
              {{ formatDate(article.createdAt) }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-body2 text-grey-8 line-clamp-3">
              {{ getExcerpt(article) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md">
            <q-btn
              flat
              label="Baca Selengkapnya"
              color="primary"
              icon-right="arrow_forward"
              size="sm"
              @click.stop="viewArticle(article._id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Empty State - No Results -->
    <div v-else-if="searchQuery && !loading" class="text-center q-pa-xl">
      <q-icon name="search_off" size="64px" color="grey-4" class="q-mb-md" />
      <div class="text-h6 text-grey-6">Artikel tidak ditemukan</div>
      <div class="text-body2 text-grey-5 q-mt-sm">
        Tidak ada artikel yang cocok dengan pencarian "{{ searchQuery }}"
      </div>
      <q-btn flat label="Hapus Pencarian" color="primary" class="q-mt-md" @click="clearSearch" />
    </div>

    <!-- Empty State - No Articles -->
    <div v-else-if="!loading" class="text-center q-pa-xl">
      <q-icon name="article" size="64px" color="grey-4" class="q-mb-md" />
      <div class="text-h6 text-grey-6">Belum ada artikel yang tersedia.</div>
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

// View article detail
const viewArticle = (id) => {
  // Sesuaikan dengan routing Anda
  router.push({ name: 'article-detail', params: { id } })
  // Atau:
  // router.push(`/articles/${id}`)
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.text-indigo-10 {
  color: #0d2a5c;
}

.my-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.my-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.cursor-pointer {
  cursor: pointer;
}

.article-image {
  background-color: #f5f5f5;
}

.no-image-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
}
</style>
