<!-- Program Edulang - Pilih Bahasa yang Ingin Kamu Kuasai -->
<template>
  <section class="program-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <h2 class="section-title text-weight-bold">Program Edulang</h2>
        <h3 class="section-subtitle text-weight-bold">Pilih Bahasa yang Ingin Kamu Kuasai</h3>
        <p class="section-desc q-mt-sm">
          8 bahasa populer tersedia dengan kurikulum lengkap dari level pemula hingga mahir.
        </p>
      </div>

      <div v-if="loading" class="row q-col-gutter-md">
        <div v-for="n in 4" :key="n" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card flat bordered class="rounded-borders">
            <q-skeleton height="180px" square />
          </q-card>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div
          v-for="lang in displayedLanguages"
          :key="lang.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card
            flat
            bordered
            class="lang-card rounded-borders cursor-pointer"
            @click="goToBerlangganan(lang)"
          >
            <q-card-section class="text-center q-pa-lg">
              <div class="lang-flag q-mb-md">{{ lang.flag }}</div>
              <div class="lang-name text-weight-bold q-mb-sm">{{ lang.name }}</div>
              <div class="lang-level text-caption text-grey-7 q-mb-md">
                Pemula - Menengah - Lanjutan
              </div>
              <div class="lang-stats row justify-center q-gutter-md">
                <span>{{ lang.students }}+ Siswa</span>
                <span>{{ lang.rating }} Rating</span>
                <span>{{ lang.videos }}+ Video</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="text-center q-mt-xl">
        <q-btn
          unelevated
          no-caps
          class="btn-primary q-px-xl"
          label="Lihat Semua Program"
          :to="{ name: 'BerlanggananPage' }"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const languages = ref([])
const loading = ref(true)

const defaultLanguages = [
  { flag: '🇸🇦', name: 'Bahasa Arab', students: 2500, rating: 4.9, videos: 120 },
  { flag: '🇩🇪', name: 'Bahasa Jerman', students: 1800, rating: 4.8, videos: 100 },
  { flag: '🇺🇸', name: 'Bahasa Inggris', students: 5000, rating: 4.9, videos: 150 },
  { flag: '🇬🇧', name: 'Bahasa Inggris (British)', students: 1500, rating: 4.8, videos: 90 },
  { flag: '🇯🇵', name: 'Bahasa Jepang', students: 3200, rating: 4.9, videos: 130 },
  { flag: '🇰🇷', name: 'Bahasa Korea', students: 4100, rating: 4.9, videos: 140 },
  { flag: '🇨🇳', name: 'Mandarin', students: 2800, rating: 4.8, videos: 125 },
  { flag: '🇹🇼', name: 'Mandarin (Taiwan)', students: 900, rating: 4.7, videos: 80 },
]

const displayedLanguages = computed(() => {
  if (languages.value.length >= 8) {
    return languages.value.slice(0, 8).map((l, i) => ({
      id: l._id || l.id || i,
      flag: l.flag || defaultLanguages[i]?.flag || '🌐',
      name: l.name || l.label || 'Bahasa',
      students: l.students ?? defaultLanguages[i]?.students ?? 1000,
      rating: l.rating ?? defaultLanguages[i]?.rating ?? 4.8,
      videos: l.videos ?? defaultLanguages[i]?.videos ?? 100,
    }))
  }
  return defaultLanguages.map((l, i) => ({
    id: i,
    ...l,
  }))
})

const goToBerlangganan = (lang) => {
  router.push({
    path: '/berlangganan',
    query: { languageId: lang.id, languageName: lang.name },
  })
}

onMounted(async () => {
  try {
    const res = await api.get('/language-types')
    const data = res.data || {}
    const list = Array.isArray(data.languagetypes) ? data.languagetypes : data.data || []
    languages.value = list
  } catch {
    languages.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.program-section {
  padding-top: 3rem;
  padding-bottom: 3rem;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.section-title {
  color: var(--edulang-navy, #003387);
  font-size: clamp(1.5rem, 3vw, 1.75rem);
}

.section-subtitle {
  color: var(--edulang-black, #2d2d2d);
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
}

.section-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.85;
}

.lang-card {
  border-color: #e2e8f0 !important;
  transition: transform 0.2s, box-shadow 0.2s;
}

.lang-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 51, 135, 0.12);
}

.lang-flag {
  font-size: 3rem;
}

.lang-name {
  color: var(--edulang-navy, #003387);
  font-size: 1.1rem;
}

.lang-stats {
  font-size: 0.75rem;
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.8;
}

.btn-primary {
  background: var(--edulang-blue, #0089ff) !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
}

.rounded-borders {
  border-radius: 16px;
}
</style>
