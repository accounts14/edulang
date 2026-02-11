<template>
  <section class="program-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <div class="badge-program q-mb-md">Program Edulang</div>
        <h2 class="section-title text-weight-bold no-margin">
          Pilih Bahasa yang Ingin <span class="text-primary">Kamu Kuasai</span>
        </h2>
        <p class="section-desc q-mt-md">
          8 bahasa populer tersedia dengan kurikulum lengkap dari level pemula hingga mahir.
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div
          v-for="lang in displayedLanguages"
          :key="lang.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card
            flat
            bordered
            class="lang-card rounded-card cursor-pointer overflow-hidden"
            @click="goToBerlangganan(lang)"
          >
            <div class="lang-card-header flex flex-center" :style="{ backgroundColor: lang.color }">
              <div style="font-size: 3.5rem">{{ lang.flag }}</div>
            </div>

            <q-card-section class="q-pa-md">
              <div class="lang-name text-weight-bold q-mb-xs">{{ lang.name }}</div>
              <div class="lang-level-badge q-mb-md">Pemula - Menengah - Lanjutan</div>

              <div class="lang-stats-grid">
                <div class="stat-box">
                  <q-icon name="group" size="14px" color="blue-7" />
                  <span>{{ lang.students.toLocaleString() }}+</span>
                  <div class="stat-label">Siswa</div>
                </div>
                <div class="stat-box">
                  <q-icon name="star_outline" size="14px" color="orange-7" />
                  <span>{{ lang.rating }}</span>
                  <div class="stat-label">Rating</div>
                </div>
                <div class="stat-box">
                  <q-icon name="menu_book" size="14px" color="blue-5" />
                  <span>{{ lang.videos }}+</span>
                  <div class="stat-label">Video</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const defaultLanguages = [
  {
    flag: '🇸🇦',
    name: 'Bahasa Arab',
    students: 2500,
    rating: 4.9,
    videos: 120,
    color: '#10a37f',
    path: '/berlangganan',
  },
  {
    flag: '🇩🇪',
    name: 'Bahasa Jerman',
    students: 1800,
    rating: 4.8,
    videos: 100,
    color: '#f59e0b',
    path: '/berlangganan',
  },
  {
    flag: '🇺🇸',
    name: 'Bahasa Inggris',
    students: 5000,
    rating: 4.9,
    videos: 150,
    color: '#4f46e5',
    path: '/berlangganan',
  },
  {
    flag: '🇬🇧',
    name: 'Bahasa Inggris (British)',
    students: 1500,
    rating: 4.8,
    videos: 90,
    color: '#ef4444',
    path: '/berlangganan',
  },
  {
    flag: '🇯🇵',
    name: 'Bahasa Jepang',
    students: 3200,
    rating: 4.9,
    videos: 130,
    color: '#f43f5e',
    path: '/berlangganan',
  },
  {
    flag: '🇰🇷',
    name: 'Bahasa Korea',
    students: 4100,
    rating: 4.9,
    videos: 140,
    color: '#3b82f6',
    path: '/berlangganan',
  },
  {
    flag: '🇨🇳',
    name: 'Mandarin',
    students: 2800,
    rating: 4.8,
    videos: 125,
    color: '#ea580c',
    path: '/berlangganan',
  },
  {
    flag: '🇹🇼',
    name: 'Mandarin (Taiwan)',
    students: 900,
    rating: 4.7,
    videos: 80,
    color: '#0ea5e9',
    path: '/berlangganan',
  },
]

const displayedLanguages = computed(() => {
  return defaultLanguages.map((l, i) => ({ id: i, ...l }))
})

const goToBerlangganan = (lang) => {
  // Ganti console.log dengan navigasi router
  router.push({
    path: '/berlangganan',
    query: {
      language: lang.name, // ← Opsional: kirim nama bahasa sebagai query param
    },
  })
}
</script>

<style scoped>
.program-section {
  padding: 80px 0;
  background: #ffffff;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.badge-program {
  display: inline-block;
  padding: 6px 18px;
  background-color: #f0f7ff;
  color: #0089ff;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
}
.section-title {
  color: #002d72;
  font-size: clamp(2rem, 4vw, 2.5rem);
}
.section-desc {
  color: #64748b;
  font-size: 1.1rem;
}
.rounded-card {
  border-radius: 16px;
  border: 1px solid #eef2f6 !important;
}
.lang-card {
  transition: all 0.3s ease;
}
.lang-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 45, 114, 0.08);
}
.lang-card-header {
  height: 100px;
}
.lang-name {
  color: #1e293b;
  font-size: 1.05rem;
}
.lang-level-badge {
  color: #3b82f6;
  background: #eff6ff;
  display: inline-block;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}
.lang-stats-grid {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
}
.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat-box span {
  font-weight: 700;
  font-size: 0.85rem;
  color: #1e293b;
}
.stat-label {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ========================================
   🎯 MOBILE (<768px) - 1 KOLOM
   ======================================== */
@media (max-width: 767px) {
  .program-section {
    padding: 60px 0;
  }

  .container {
    padding: 0 16px;
  }

  .section-title {
    font-size: 1.9rem;
    line-height: 1.25;
  }

  .section-desc {
    font-size: 1rem;
    padding: 0 8px;
  }

  /* Cards: 1 kolom full-width mobile */
  .col-12.col-sm-6.col-md-4.col-lg-3 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .lang-card-header {
    height: 120px;
  }

  .lang-name {
    font-size: 1.1rem;
  }
}

/* ========================================
   ✅ IPAD (768px-1023px) - 2 KOLOM
   ======================================== */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 24px;
    max-width: 100%;
  }

  .program-section {
    padding: 70px 0;
  }

  .section-title {
    font-size: 2.2rem;
  }

  /* Cards: 2 kolom iPad */
  .col-12.col-sm-6.col-md-4.col-lg-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .lang-card-header {
    height: 110px;
  }

  .lang-name {
    font-size: 1rem;
  }

  .stat-box span {
    font-size: 0.8rem;
  }
}

/* ========================================
   ✅ IPAD PORTRAIT (768x1024) FIX
   ======================================== */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .program-section {
    padding: 65px 0;
  }

  .col-12.col-sm-6.col-md-4.col-lg-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* ========================================
   ✅ DESKTOP SMALL (1024px-1365px) - 3 KOLOM
   ======================================== */
@media (min-width: 1024px) and (max-width: 1365px) {
  .container {
    max-width: 100%;
    padding: 0 32px;
  }

  /* 3 kolom desktop small */
  .col-12.col-sm-6.col-md-4.col-lg-3 {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }
}

/* ========================================
   ✅ DESKTOP LARGE (≥1366px) - 4 KOLOM
   ======================================== */
@media (min-width: 1366px) {
  .container {
    max-width: 1400px;
    padding: 0 48px;
  }
}
</style>
