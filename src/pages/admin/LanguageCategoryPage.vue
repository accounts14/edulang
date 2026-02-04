<template>
  <q-page class="q-pa-xl bg-blue-1">
    <q-card flat class="rounded-borders-lg shadow-1 q-pa-xl bg-white">
      <div class="row items-center justify-between q-mb-lg">
        <div class="row items-center">
          <q-avatar color="grey-3" icon="translate" size="md" class="q-mr-sm" />
          <div class="text-h6 text-weight-bolder">Bahasa Tersedia</div>
        </div>
        <q-btn
          color="primary"
          unelevated
          no-caps
          class="rounded-borders q-px-lg"
          label="Tambah Kategori"
          @click="goToAdd"
        />
      </div>

      <div class="row q-col-gutter-xl items-center">
        <!-- Kartu bahasa -->
        <div class="col-12 col-md-6">
          <div class="row q-col-gutter-md">
            <div
              class="col-6"
              v-for="lang in languageDetails"
              :key="lang._id"
            >
              <q-card flat class="bg-grey-2 q-pa-md rounded-borders relative-position">
                <div class="row items-center no-wrap q-mb-sm">
                  <q-img :src="lang.iconUrl || getFlag(lang.name)" style="width: 28px; border-radius: 4px" class="q-mr-sm" />
                  <div class="text-caption text-weight-bold">{{ lang.name }}</div>
                  <q-badge floating color="blue" size="xs">PRO</q-badge>
                </div>
                <div class="text-h5 text-weight-bolder q-mt-sm">{{ lang.courseCount }}</div>
                <div class="text-caption text-grey-7">Bahasa Tersedia</div>

                <q-card-actions align="right" class="q-mt-sm q-pa-none">
                  <q-btn
                    flat
                    round
                    size="sm"
                    color="orange-5"
                    icon="edit"
                    @click.stop="goToEdit(lang)"
                  />
                  <q-btn
                    flat
                    round
                    size="sm"
                    color="negative"
                    icon="delete"
                    @click.stop="confirmDelete(lang)"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="col-12 col-md-6 text-center">
          <div class="flex flex-center relative-position">
            <svg width="260" height="260" viewBox="0 0 42 42" class="donut">
              <circle
                v-for="(segment, i) in chartSegments"
                :key="i"
                cx="21" cy="21" r="15.915"
                fill="transparent"
                :stroke="segment.color"
                stroke-width="6"
                :stroke-dasharray="`${segment.percent} ${100 - segment.percent}`"
                :stroke-dashoffset="segment.offset"
              />
            </svg>
            <div class="absolute-center">
              <div class="text-h4 text-weight-bolder">{{ totalPercent }}%</div>
              <div class="text-caption text-grey-7 text-weight-bold">Total</div>
            </div>
          </div>
          <div class="text-h6 text-weight-bolder q-mt-lg">Chart Course Tersedia</div>
        </div>
      </div>
    </q-card>
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
    cancel: { label: 'Batal', flat: true }
  }).onOk(async () => {
    try {
      await api.delete(`/language-types/${lang._id}`)
      $q.notify({ type: 'positive', message: 'Kategori bahasa berhasil dihapus.' })
      await fetchData()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Gagal menghapus kategori bahasa.'
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
    Indonesian: 'https://flagcdn.com/id.svg'
  }
  return flags[name] || 'https://flagcdn.com/un.svg'
}

const fetchData = async () => {
  try {
    // Bahasa
    const langRes = await api.get('/language-types')
    const langData = langRes.data || {}
    const langs = Array.isArray(langData.languagetypes) ? langData.languagetypes : (langData.data || [])

    // Packages untuk hitung course per bahasa
    const pkgRes = await api.get('/packages')
    const pkgData = pkgRes.data || {}
    const packages = Array.isArray(pkgData.packages) ? pkgData.packages : (pkgData.data || [])
    totalCourses.value = packages.length

    languageDetails.value = langs.map((lang) => {
      const langId = lang._id
      const courseCount = packages.filter((p) => {
        const pLang = p.languageType
        const pLangId = typeof pLang === 'object' && pLang !== null ? (pLang._id || pLang.id) : pLang
        return String(pLangId) === String(langId)
      }).length

      return {
        _id: langId,
        name: lang.name,
        description: lang.description,
        iconUrl: lang.iconUrl || lang.icon_url || '',
        courseCount
      }
    })
  } catch (error) {
    console.error('[ADMIN KATEGORI] Gagal memuat data', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat data kategori bahasa.'
    })
  }
}

const chartSegments = computed(() => {
  if (languageDetails.value.length === 0) {
    return [{ percent: 100, offset: 25, color: '#e0e0e0' }]
  }

  const total = totalCourses.value || languageDetails.value.reduce((acc, l) => acc + l.courseCount, 0) || 1
  const colors = ['#2196F3', '#81C784', '#FFB74D', '#F48FB1', '#FFCC80']
  let currentOffset = 25
  const segments = []

  languageDetails.value.forEach((lang, i) => {
    const percent = total > 0 ? (lang.courseCount / total) * 100 : 0
    segments.push({
      percent: parseFloat(percent.toFixed(1)),
      offset: currentOffset,
      color: colors[i % colors.length]
    })
    currentOffset -= percent
  })

  return segments
})

const totalPercent = computed(() => {
  return languageDetails.value.length > 0 ? 100 : 0
})

onMounted(fetchData)
</script>

<style scoped>
.rounded-borders-lg { border-radius: 24px; }
.donut { transform: rotate(-90deg); }
</style>

