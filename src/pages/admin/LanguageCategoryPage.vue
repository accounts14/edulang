<template>
  <q-page class="q-pa-md q-pa-sm-xl bg-accent">
    <div class="max-width-container mx-auto">
      <q-card flat class="rounded-24 shadow-2 q-pa-md q-pa-md-xl bg-white border-subtle">
        <div class="row items-center justify-between q-mb-xl">
          <div class="col-12 col-sm-auto q-mb-md q-sm-mb-none">
            <div class="row items-center">
              <div class="bg-edulang-blue-light q-pa-sm rounded-12 q-mr-md">
                <q-icon name="translate" color="edulang-blue" size="sm" />
              </div>
              <div>
                <div class="text-h5 text-weight-bolder text-edulang-navy font-outfit">
                  Manajemen Bahasa
                </div>
                <div class="text-caption text-grey-7">
                  Kelola kategori bahasa dan pantau distribusi kursus
                </div>
              </div>
            </div>
          </div>
          <q-btn
            color="edulang-blue"
            unelevated
            no-caps
            class="rounded-12 q-px-lg text-weight-bold btn-hover-effect"
            label="Tambah Kategori"
            icon="add"
            @click="goToAdd"
          />
        </div>

        <div class="row q-col-gutter-xl items-start">
          <div class="col-12 col-lg-7">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6" v-for="lang in languageDetails" :key="lang._id">
                <q-card flat class="lang-card q-pa-md rounded-16 relative-position border-grey">
                  <div class="row items-center justify-between q-mb-md">
                    <div class="row items-center">
                      <q-img
                        :src="lang.iconUrl || getFlag(lang.name)"
                        style="width: 36px; height: 26px"
                        class="rounded-4 shadow-1 q-mr-md"
                        fit="cover"
                      />
                      <div>
                        <div class="text-subtitle2 text-weight-bold text-edulang-navy">
                          {{ lang.name }}
                        </div>
                        <div class="text-caption text-grey-6">{{ lang.courseCount }} Kursus</div>
                      </div>
                    </div>
                    <q-badge outline color="edulang-blue" class="rounded-4 q-px-sm"
                      >Premium</q-badge
                    >
                  </div>

                  <q-separator dashed class="q-my-sm" />

                  <div class="row items-center justify-between">
                    <div
                      class="text-caption text-grey-7 italic text-truncate"
                      style="max-width: 120px"
                    >
                      {{ lang.description || 'Tanpa deskripsi' }}
                    </div>
                    <div class="row q-gutter-xs">
                      <q-btn
                        flat
                        round
                        size="sm"
                        color="edulang-blue"
                        icon="edit"
                        @click.stop="goToEdit(lang)"
                      >
                        <q-tooltip>Edit Bahasa</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        size="sm"
                        color="negative"
                        icon="delete_outline"
                        @click.stop="confirmDelete(lang)"
                      >
                        <q-tooltip>Hapus</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-5 text-center flex flex-center">
            <div class="chart-container q-pa-lg rounded-24 bg-f5 full-width">
              <div class="text-subtitle1 text-weight-bold text-edulang-navy q-mb-lg">
                Statistik Distribusi
              </div>
              <div class="relative-position inline-block">
                <svg width="240" height="240" viewBox="0 0 42 42" class="donut">
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#E0E7FF"
                    stroke-width="4"
                  />
                  <circle
                    v-for="(segment, i) in chartSegments"
                    :key="i"
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    :stroke="segment.color"
                    stroke-width="5"
                    :stroke-dasharray="`${segment.percent} ${100 - segment.percent}`"
                    :stroke-dashoffset="segment.offset"
                    stroke-linecap="round"
                    class="donut-segment"
                  />
                </svg>
                <div class="absolute-center">
                  <div class="text-h3 text-weight-bolder text-edulang-navy">
                    {{ languageDetails.length }}
                  </div>
                  <div class="text-caption text-grey-7 text-weight-bold">TOTAL BAHASA</div>
                </div>
              </div>

              <div class="row q-col-gutter-sm q-mt-xl justify-center">
                <div v-for="(segment, i) in chartSegments" :key="i" class="col-auto">
                  <div class="row items-center q-gutter-xs">
                    <div :style="{ backgroundColor: segment.color }" class="legend-dot"></div>
                    <span class="text-caption text-weight-medium"
                      >{{ segment.name }}: {{ segment.percent }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()

const languageDetails = ref([])
const totalCourses = ref(0)

const goToAdd = () => {
  router.push('/admin/kategori/add')
}

const goToEdit = (lang) => {
  router.push(`/admin/kategori/${lang._id}/edit`)
}

const confirmDelete = (lang) => {
  $q.dialog({
    title: 'Hapus Kategori',
    message: `Yakin ingin menghapus bahasa "${lang.name}"?`,
    ok: { label: 'Hapus', color: 'negative', unelevated: true },
    cancel: { label: 'Batal', flat: true },
  }).onOk(async () => {
    try {
      await api.delete(`/language-types/${lang._id}`)
      $q.notify({ type: 'positive', message: 'Kategori bahasa berhasil dihapus.' })
      await fetchData()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Gagal menghapus kategori bahasa.',
      })
    }
  })
}

const getFlag = (name) => {
  const flags = {
    English: 'https://flagcdn.com/us.svg',
    Chinese: 'https://flagcdn.com/cn.svg',
    Japan: 'https://flagcdn.com/jp.svg',
    Germany: 'https://flagcdn.com/de.svg',
    Arab: 'https://flagcdn.com/sa.svg',
    Indonesian: 'https://flagcdn.com/id.svg',
  }
  return flags[name] || 'https://flagcdn.com/un.svg'
}

const fetchData = async () => {
  try {
    // Bahasa
    const langRes = await api.get('/language-types')
    const langData = langRes.data || {}
    const langs = Array.isArray(langData.languagetypes)
      ? langData.languagetypes
      : langData.data || []

    // Packages untuk hitung course per bahasa
    const pkgRes = await api.get('/packages')
    const pkgData = pkgRes.data || {}
    const packages = Array.isArray(pkgData.packages) ? pkgData.packages : pkgData.data || []
    totalCourses.value = packages.length

    languageDetails.value = langs.map((lang) => {
      const langId = lang._id
      const courseCount = packages.filter((p) => {
        const pLang = p.languageType
        const pLangId = typeof pLang === 'object' && pLang !== null ? pLang._id || pLang.id : pLang
        return String(pLangId) === String(langId)
      }).length

      return {
        _id: langId,
        name: lang.name,
        description: lang.description,
        iconUrl: lang.iconUrl || lang.icon_url || '',
        courseCount,
      }
    })
  } catch (error) {
    console.error('[ADMIN KATEGORI] Gagal memuat data', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat data kategori bahasa.',
    })
  }
}

const chartSegments = computed(() => {
  if (languageDetails.value.length === 0) {
    return [{ percent: 100, offset: 25, color: '#F5F7FA', name: 'N/A' }]
  }

  // Menghitung total seluruh kursus dari semua bahasa untuk persentase
  const totalAllCourses = languageDetails.value.reduce((acc, l) => acc + l.courseCount, 0) || 1

  // Warna resmi Edulang: Navy, Blue, Yellow
  const colors = ['#003387', '#0089FF', '#FFC42C', '#2D2D2D', '#6366F1']
  let currentOffset = 25

  return languageDetails.value.map((lang, i) => {
    const percent = (lang.courseCount / totalAllCourses) * 100
    const segment = {
      name: lang.name,
      percent: parseFloat(percent.toFixed(1)),
      offset: currentOffset,
      color: colors[i % colors.length],
    }
    currentOffset -= percent
    return segment
  })
})
onMounted(fetchData)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Warna Brand Edulang */
.text-edulang-navy {
  color: #003387;
}
.bg-edulang-blue {
  background-color: #0089ff;
}
.bg-edulang-blue-light {
  background-color: rgba(0, 137, 255, 0.1);
}
.border-subtle {
  border: 1px solid rgba(0, 51, 135, 0.05);
}

.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}
.rounded-24 {
  border-radius: 24px;
}
.rounded-16 {
  border-radius: 16px;
}
.rounded-12 {
  border-radius: 12px;
}

.lang-card {
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}
.lang-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 51, 135, 0.08) !important;
  border-color: #0089ff;
}

.bg-f5 {
  background-color: #f5f7fa;
} /* Edulang White/Grey */

.donut {
  transform: rotate(-90deg);
  transition: all 1s ease;
}
.donut-segment {
  transition: stroke-dasharray 0.5s ease;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.btn-hover-effect {
  transition: filter 0.2s;
}
.btn-hover-effect:hover {
  filter: brightness(1.1);
}
</style>
