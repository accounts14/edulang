<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-between items-end q-mb-xl">
      <div class="col-12 col-md-8">
        <div class="row items-center q-gutter-x-sm q-mb-xs">
          <q-icon name="auto_stories" color="primary" size="24px" />
          <div class="text-edulang-blue text-weight-bold letter-spacing-1">#ARTIKEL</div>
        </div>
        <h1 class="text-h3 text-weight-bold text-edulang-navy q-ma-none">Ruang Informasi</h1>
        <p class="text-subtitle1 text-grey-7 q-mt-sm">
          Pusat edukasi, tips, dan update terkini untuk ekosistem Edulang.
        </p>
      </div>
      <div class="col-12 col-md-auto q-mt-md">
        <q-btn
          unelevated
          label="Tambahkan Artikel Baru"
          icon="add"
          no-caps
          class="rounded-btn btn-edulang-primary q-px-xl q-py-sm shadow-2"
          @click="goAdd"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-ring color="primary" size="60px" thickness="4" />
      <div class="text-grey-6 q-mt-md">Menyiapkan informasi...</div>
    </div>

    <div v-else-if="articles.length === 0" class="text-center q-pa-xl empty-state-container">
      <q-icon name="description" size="100px" color="grey-3" />
      <div class="text-h6 text-grey-7 q-mt-md">Belum ada artikel yang diterbitkan</div>
      <q-btn flat color="primary" label="Mulai menulis sekarang" class="q-mt-md" @click="goAdd" />
    </div>

    <div v-else>
      <q-banner
        v-if="onlyPublishedShown"
        rounded
        class="bg-blue-1 text-edulang-navy q-mb-xl border-blue-light"
      >
        <template v-slot:avatar>
          <q-icon name="info" color="primary" />
        </template>
        <div class="text-weight-medium">Mode Peninjauan Admin</div>
        <div class="text-caption opacity-80">
          Saat ini hanya menampilkan artikel publik. Hubungi backend untuk integrasi
          <code>/admin</code> secara penuh.
        </div>
      </q-banner>

      <div class="row q-col-gutter-xl">
        <div v-for="art in articles" :key="art._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="article-card overflow-hidden" flat>
            <div class="relative-position cursor-pointer" @click="goEdit(art)">
              <q-img
                :src="art.imageUrl || 'https://cdn.quasar.dev/img/parallax2.jpg'"
                :ratio="4 / 3"
                class="article-img shadow-1"
              >
                <template v-slot:loading>
                  <q-skeleton class="full-height" />
                </template>
              </q-img>

              <div class="absolute-top-right q-ma-md">
                <q-chip
                  :color="statusColor(art.status)"
                  text-color="white"
                  size="sm"
                  class="text-weight-bold px-md"
                >
                  {{ statusLabel(art.status) }}
                </q-chip>
              </div>
            </div>

            <q-card-section class="q-pa-md">
              <div class="row items-center justify-between text-caption text-grey-6 q-mb-sm">
                <div class="row items-center">
                  <q-icon name="person" size="14px" class="q-mr-xs" />
                  {{ authorName(art) }}
                </div>
                <div class="row items-center">
                  <q-icon name="visibility" size="14px" class="q-mr-xs" />
                  {{ art.views ?? 0 }}
                </div>
              </div>

              <div
                class="text-h6 text-weight-bold text-edulang-navy leading-tight cursor-pointer hover-blue"
                @click="goEdit(art)"
              >
                {{ art.title || 'Tanpa judul' }}
              </div>

              <div class="text-caption text-grey-5 q-mt-xs text-italic">
                {{ art.slug || 'no-slug-generated' }}
              </div>

              <q-separator class="q-my-md opacity-20" />

              <div class="row items-center justify-between">
                <div class="column">
                  <div class="text-overline text-grey-5 leading-none">DITERBITKAN</div>
                  <div class="text-caption text-weight-bold text-grey-7">
                    {{ formatDate(art.publishedAt) }}
                  </div>
                </div>

                <div class="row q-gutter-x-sm">
                  <q-btn flat round color="primary" icon="edit_note" size="sm" @click="goEdit(art)">
                    <q-tooltip>Edit Artikel</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete_outline"
                    size="sm"
                    @click="confirmDelete(art)"
                  >
                    <q-tooltip>Hapus</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
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
  draft: 'DRAF',
  review: 'REVIEW',
  published: 'PUBLISHED',
  archived: 'ARCHIVED',
}

const statusColors = {
  draft: 'amber-9',
  review: 'orange-8',
  published: 'primary',
  archived: 'grey-8',
}

function statusLabel(s) {
  return statusLabels[s] || s || 'DRAF'
}
function statusColor(s) {
  return statusColors[s] || 'grey'
}

function authorName(art) {
  const a = art.author
  if (!a) return 'Edulang Admin'
  return a.name || a.email || 'Admin'
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function goAdd() {
  router.push('/admin/artikel/add')
}

function goEdit(art) {
  const slug = art.slug
  if (slug) router.push(`/admin/artikel/${encodeURIComponent(slug)}/edit`)
}

function confirmDelete(art) {
  $q.dialog({
    title: '<span class="text-edulang-navy">Hapus Artikel</span>',
    message: `Apakah Anda yakin ingin menghapus artikel <b>"${art.title}"</b>? Tindakan ini tidak dapat dibatalkan.`,
    html: true,
    ok: {
      label: 'Ya, Hapus',
      color: 'negative',
      unelevated: true,
      noCaps: true,
      class: 'rounded-btn',
    },
    cancel: { label: 'Batal', flat: true, noCaps: true, color: 'grey-7' },
  }).onOk(async () => {
    try {
      await api.delete(`/articles/${art._id || art.id}`)
      $q.notify({ type: 'positive', message: 'Artikel telah dihapus.' })
      await fetchArticles()
    } catch {
      $q.notify({ type: 'negative', message: 'Gagal menghapus artikel.' })
    }
  })
}

async function fetchArticles() {
  onlyPublishedShown.value = false
  loading.value = true
  try {
    const res = await api.get('/articles/admin')
    const list = res.data?.articles || res.data?.data || []
    articles.value = Array.isArray(list) ? list : []
  } catch {
    // Fallback logic remains as per original request to handle API limits
    try {
      const pub = await api.get('/articles', { params: { limit: 100 } })
      articles.value = pub.data?.articles || pub.data?.data || []
      onlyPublishedShown.value = true
    } catch {
      articles.value = []
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchArticles)
</script>

<style scoped>
/* Identitas Warna */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.btn-edulang-primary {
  background-color: #003387;
  color: white;
  transition: all 0.3s;
}
.btn-edulang-primary:hover {
  background-color: #0089ff;
  transform: translateY(-2px);
}

/* Card Styling */
.article-card {
  border-radius: 20px;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.article-card:hover {
  transform: translateY(-8px);
}

.article-img {
  border-radius: 20px;
  border: 4px solid white;
}

.rounded-btn {
  border-radius: 12px;
}

.empty-state-container {
  background: white;
  border-radius: 24px;
  border: 2px dashed #e0e6ed;
}

/* Typography */
.leading-tight {
  line-height: 1.25;
}
.leading-none {
  line-height: 1;
}
.letter-spacing-1 {
  letter-spacing: 1.5px;
}
.hover-blue:hover {
  color: #0089ff !important;
  transition: color 0.2s;
}

.border-blue-light {
  border: 1px solid #d0e6ff;
}
.opacity-20 {
  opacity: 0.2;
}
.opacity-80 {
  opacity: 0.8;
}
</style>
