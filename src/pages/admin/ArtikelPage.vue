<template>
  <q-page class="q-pa-xl bg-blue-1">
    <div class="row justify-between items-center q-mb-xl">
      <div class="col-12 col-md-8">
        <div class="text-orange-9 text-weight-bold">#Artikel</div>
        <div class="text-h4 text-weight-bolder text-indigo-10 q-mt-sm">Ruang Informasi Edulang</div>
        <div class="text-grey-7 q-mt-xs">Tempat Tips dan Informasi Terkini Tersedia</div>
      </div>
      <div class="col-12 col-md-auto q-mt-md">
        <q-btn
          unelevated
          color="primary"
          label="Tambahkan Artikel Baru"
          no-caps
          class="rounded-borders q-px-lg"
          @click="goAdd"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="articles.length === 0" class="text-center q-pa-xl text-grey-7">
      Belum ada artikel. Klik <b>Tambahkan Artikel Baru</b> untuk membuat.
    </div>

    <div v-else>
      <p v-if="onlyPublishedShown" class="text-amber-9 text-caption q-mb-md">
        Saat ini hanya artikel Published yang dikembalikan API. Agar <b>semua status</b> (Draf,
        Review, Published, Archived) tetap tampil di halaman ini, backend harus menyediakan
        <code>GET /api/articles/admin</code> yang mengembalikan seluruh artikel tanpa filter status.
      </p>
      <div class="row q-col-gutter-lg">
        <div v-for="art in articles" :key="art._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="rounded-borders-16 overflow-hidden" flat bordered>
            <div class="relative-position">
              <q-img
                :src="art.imageUrl || 'https://cdn.quasar.dev/img/parallax2.jpg'"
                :ratio="16 / 9"
                class="article-img"
              />
              <q-badge
                :color="statusColor(art.status)"
                class="absolute-top-right q-ma-sm"
                :label="statusLabel(art.status)"
              />
            </div>
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-indigo-10">
                {{ art.title || 'Tanpa judul' }}
              </div>
              <div class="text-caption text-grey-7">Slug: {{ art.slug || '—' }}</div>
              <div class="text-caption text-grey-7">Autor : {{ authorName(art) }}</div>
              <div class="text-caption text-grey-7">
                Published At: {{ formatDate(art.publishedAt) }}
              </div>
              <div class="text-caption text-grey-7">View: {{ art.views ?? 0 }}</div>
            </q-card-section>
            <q-card-actions align="right" class="q-pt-none">
              <q-btn flat round dense color="amber-8" icon="edit" @click="goEdit(art)" />
              <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(art)" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const loading = ref(true)
const articles = ref([])
const onlyPublishedShown = ref(false)

const statusLabels = {
  draft: 'Draf',
  review: 'Review',
  published: 'Published',
  archived: 'Archived',
}

const statusColors = {
  draft: 'amber',
  review: 'green',
  published: 'primary',
  archived: 'negative',
}

function statusLabel(s) {
  return statusLabels[s] || s || 'Draf'
}

function statusColor(s) {
  return statusColors[s] || 'grey'
}

function authorName(art) {
  const a = art.author
  if (!a) return '—'
  return a.name || a.email || '—'
}

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('id-ID', { dateStyle: 'short' })
  } catch {
    return '—'
  }
}

function goAdd() {
  router.push('/admin/artikel/add')
}

function goEdit(art) {
  const slug = art.slug
  if (slug) router.push(`/admin/artikel/${encodeURIComponent(slug)}/edit`)
}

function confirmDelete(art) {
  const id = art._id || art.id
  if (!id) return

  $q.dialog({
    title: 'Hapus Artikel',
    message: `Yakin ingin menghapus artikel "${art.title || 'ini'}"?`,
    ok: { label: 'Hapus', color: 'negative', unelevated: true },
    cancel: { label: 'Batal', flat: true },
  }).onOk(async () => {
    try {
      await api.delete(`/articles/${id}`)
      $q.notify({ type: 'positive', message: 'Artikel berhasil dihapus.' })
      await fetchArticles()
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: err.response?.data?.message || 'Gagal menghapus artikel.',
      })
    }
  })
}

async function fetchArticles() {
  onlyPublishedShown.value = false
  loading.value = true
  try {
    // Utama: endpoint admin yang mengembalikan semua status (draft, review, published, archived)
    const res = await api.get('/articles/admin')
    const data = res.data || {}
    const list = data.articles || data.data || []
    articles.value = Array.isArray(list) ? list : []
  } catch (err) {
    const is404 = err.response?.status === 404
    const msg = (err.response?.data?.message || '').toLowerCase()
    if (is404 || msg.includes('not found')) {
      // Fallback 1: coba dengan param yang meminta semua status (jika backend mendukung)
      try {
        const fallback = await api.get('/articles', {
          params: { limit: 100, page: 1, status: 'all', admin: true },
        })
        const data = fallback.data || {}
        const list = data.articles || data.data || []
        articles.value = Array.isArray(list) ? list : []
        onlyPublishedShown.value = true
      } catch {
        // Fallback 2: endpoint public (biasanya hanya published)
        try {
          const pub = await api.get('/articles', { params: { limit: 100, page: 1 } })
          const data = pub.data || {}
          const list = data.articles || data.data || []
          articles.value = Array.isArray(list) ? list : []
          onlyPublishedShown.value = true
        } catch {
          articles.value = []
          $q.notify({
            type: 'negative',
            message:
              'Gagal memuat artikel. Pastikan GET /api/articles/admin atau GET /api/articles tersedia.',
          })
        }
      }
    } else {
      articles.value = []
      $q.notify({
        type: 'negative',
        message: err.response?.data?.message || 'Gagal memuat artikel.',
      })
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchArticles)
</script>

<style scoped>
.rounded-borders-16 {
  border-radius: 16px;
  overflow: hidden;
}
.text-indigo-10 {
  color: #0d2a5c;
}
.article-img {
  min-height: 120px;
}
</style>
