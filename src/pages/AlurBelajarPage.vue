<template>
  <q-page class="alur-page bg-edulang-white flex flex-center relative-position overflow-hidden">
    <div class="bg-circle bg-circle-1"></div>
    <div class="bg-circle bg-circle-2"></div>

    <div class="content-wrapper full-width">
      <section class="method-section q-py-lg-xl q-py-md">
        <div class="text-center q-mb-xl q-px-md">
          <q-badge outline color="edulang-blue" class="q-pa-sm q-mb-md text-weight-bold rounded-8">
            EDULANG PATHWAY
          </q-badge>
          <h2 class="responsive-h2 text-weight-bolder text-edulang-navy q-mt-none q-mb-sm">
            #{{ $t('alurBelajar.headline') }}
          </h2>
          <p class="section-desc text-body1 text-grey-7 q-mx-auto" style="max-width: 600px">
            {{ $t('alurBelajar.subheadline') }}
          </p>
        </div>

        <div class="row justify-center q-mb-xl q-px-md">
          <div class="col-12 col-sm-10 col-md-8 col-lg-6">
            <q-input
              v-model="searchQuery"
              filled
              bg-color="white"
              class="search-premium shadow-soft"
              :placeholder="$t('alurBelajar.searchPlaceholder')"
              @keyup.enter="onSearch"
            >
              <template v-slot:prepend>
                <q-icon name="explore" color="edulang-blue" />
              </template>
              <template v-slot:append>
                <q-btn
                  unelevated
                  color="edulang-blue"
                  class="rounded-12 q-px-lg gt-xs text-weight-bold"
                  :label="$t('alurBelajar.searchButton')"
                  @click="onSearch"
                />
              </template>
            </q-input>
            <q-btn
              unelevated
              color="edulang-blue"
              class="full-width q-mt-md rounded-12 lt-sm q-py-md text-weight-bold"
              :label="$t('alurBelajar.searchButton')"
              @click="onSearch"
            />
          </div>
        </div>

        <div class="row q-col-gutter-lg-xl q-col-gutter-md justify-center items-stretch q-px-md">
          <div class="col-12 col-sm-10 col-md-6 col-lg-5 flex">
            <q-card
              flat
              class="path-card card-dark text-white cursor-pointer relative-position overflow-hidden full-width"
              @click="selectPath('profesional')"
            >
              <div class="card-pattern"></div>
              <div class="q-pa-lg-xl q-pa-md relative-position column justify-between full-height">
                <div>
                  <div class="row items-center justify-between q-mb-lg-xl q-mb-md">
                    <div class="icon-sphere bg-edulang-yellow shadow-2">
                      <q-icon name="rocket_launch" color="white" size="32px" />
                    </div>
                    <q-icon name="arrow_outward" size="32px" class="text-white-20 gt-xs" />
                  </div>

                  <div class="responsive-h4 text-weight-bolder q-mb-md">
                    {{ $t('alurBelajar.profesionalTitle') }}
                  </div>
                  <p class="text-body1 text-white-70 q-mb-lg-xl">
                    {{ $t('alurBelajar.profesionalDesc') }}
                  </p>
                </div>

                <q-btn
                  flat
                  no-caps
                  class="bg-white-10 rounded-12 q-px-md self-start border-white-10"
                  label="Mulai Karir Global"
                  icon-right="chevron_right"
                />
              </div>
            </q-card>
          </div>

          <div class="col-12 col-sm-10 col-md-6 col-lg-5 flex">
            <q-card
              flat
              class="path-card card-light cursor-pointer relative-position overflow-hidden full-width"
              @click="selectPath('pendidikan')"
            >
              <div class="q-pa-lg-xl q-pa-md relative-position column justify-between full-height">
                <div>
                  <div class="row items-center justify-between q-mb-lg-xl q-mb-md">
                    <div class="icon-sphere bg-edulang-blue shadow-2">
                      <q-icon name="auto_stories" color="white" size="32px" />
                    </div>
                    <q-icon name="arrow_outward" size="32px" class="text-grey-3 gt-xs" />
                  </div>

                  <div class="responsive-h4 text-weight-bolder text-edulang-navy q-mb-md">
                    {{ $t('alurBelajar.pendidikanTitle') }}
                  </div>
                  <p class="text-body1 text-grey-8 q-mb-lg-xl">
                    {{ $t('alurBelajar.pendidikanDesc') }}
                  </p>
                </div>

                <q-btn
                  flat
                  no-caps
                  class="bg-edulang-blue-10 text-edulang-blue rounded-12 q-px-md self-start border-blue-10"
                  label="Lihat Jalur Studi"
                  icon-right="chevron_right"
                />
              </div>
            </q-card>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

function onSearch() {
  if (searchQuery.value.trim()) {
    console.log('Search roadmap:', searchQuery.value)
  }
}

function selectPath(type) {
  router.push({
    name: 'AlurBelajarRoadmap',
    query: { mode: type },
  })
}
</script>

<style scoped>
/* KONFIGURASI UTAMA CENTERED LAYOUT */
.alur-page {
  min-height: 100vh;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px; /* Batas lebar maksimal konten */
  margin: 0 auto; /* Paksa ke tengah horizontal */
  padding: 0 20px; /* Padding agar tidak mepet layar di tablet */
  position: relative;
}

/* Colors & Branding */
.bg-edulang-white {
  background-color: #f5f7fa;
}
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.text-white-70 {
  color: rgba(255, 255, 255, 0.7);
}
.text-white-20 {
  color: rgba(255, 255, 255, 0.2);
}
.bg-white-10 {
  background: rgba(255, 255, 255, 0.1);
}
.bg-edulang-blue-10 {
  background: rgba(0, 137, 255, 0.1);
}
.bg-edulang-yellow {
  background: #ffc42c;
}
.bg-edulang-blue {
  background: #0089ff;
}

/* Background Decoration */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.3;
}
.bg-circle-1 {
  width: 400px;
  height: 400px;
  background: #0089ff;
  top: -100px;
  right: -50px;
}
.bg-circle-2 {
  width: 350px;
  height: 350px;
  background: #ffc42c;
  bottom: -50px;
  left: -50px;
}

/* Search Bar Premium */
.search-premium :deep(.q-field__control) {
  border-radius: 20px !important;
  height: 70px;
  padding: 0 12px 0 24px;
  border: 1px solid rgba(0, 51, 135, 0.1);
}
.rounded-12 {
  border-radius: 12px;
}

/* Path Cards */
.path-card {
  border-radius: 40px;
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.card-dark {
  background: linear-gradient(145deg, #003387 0%, #001a45 100%);
}

.card-light {
  background: white;
}

.card-pattern {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: radial-gradient(
    circle at 2px 2px,
    rgba(255, 255, 255, 0.05) 1px,
    transparent 0
  );
  background-size: 24px 24px;
}

.icon-sphere {
  width: 70px;
  height: 70px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.path-card:hover {
  transform: translateY(-12px) scale(1.01);
  box-shadow: 0 30px 60px rgba(0, 51, 135, 0.15) !important;
}

.card-light:hover {
  border-color: #0089ff;
}

/* Responsivitas */
@media (max-width: 1024px) {
  .text-h2 {
    font-size: 3rem;
  }
}

@media (max-width: 600px) {
  .text-h2 {
    font-size: 2.2rem;
  }
  .path-card {
    border-radius: 30px;
  }
  .q-pa-xl {
    padding: 1.5rem !important;
  }
  .search-premium :deep(.q-field__control) {
    height: 60px;
  }
}

/* ========================================
   🎯 MOBILE (<768px) - FULL RESPONSIVE
   ======================================== */
@media (max-width: 767px) {
  .alur-page {
    padding: 2rem 0;
  }

  .content-wrapper {
    padding: 0 16px;
    max-width: 100%;
  }

  .method-section {
    padding: 2rem 0 !important;
  }

  /* Headline responsive */
  .text-h2 {
    font-size: 2rem !important;
    line-height: 1.25;
  }

  .section-desc {
    font-size: 1rem;
    padding: 0 8px;
  }

  /* Search bar full width mobile */
  .col-12.col-sm-10.col-md-8 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .search-premium :deep(.q-field__control) {
    height: 56px !important;
  }

  /* Cards: Full width stacked */
  .col-12.col-md-6.col-lg-5 {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 1.5rem;
  }

  /* Card content compact mobile */
  .q-pa-xl {
    padding: 1.5rem !important;
  }

  .icon-sphere {
    width: 56px;
    height: 56px;
  }

  .text-h4 {
    font-size: 1.5rem !important;
  }
}

/* ========================================
   ✅ IPAD (768px-1023px) - 50/50 SPLIT
   ======================================== */
@media (min-width: 768px) and (max-width: 1023px) {
  .content-wrapper {
    padding: 0 24px;
    max-width: 100%;
  }

  .method-section {
    padding: 3rem 0 !important;
  }

  .text-h2 {
    font-size: 2.8rem !important;
  }

  /* Search bar: 80% width iPad */
  .col-12.col-sm-10.col-md-8 {
    flex: 0 0 80%;
    max-width: 80%;
  }

  /* Cards: 50/50 iPad */
  .col-12.col-md-6.col-lg-5 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .search-premium :deep(.q-field__control) {
    height: 64px !important;
  }

  .q-pa-xl {
    padding: 2rem !important;
  }
}

/* ========================================
   ✅ IPAD PORTRAIT (768x1024) FIX
   ======================================== */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .method-section {
    padding: 2.5rem 0 !important;
  }

  .text-h2 {
    font-size: 2.5rem !important;
  }
}

/* ========================================
   ✅ DESKTOP SMALL (1024px-1365px)
   ======================================== */
@media (min-width: 1024px) and (max-width: 1365px) {
  .content-wrapper {
    max-width: 100%;
    padding: 0 32px;
  }
}

/* ========================================
   ✅ DESKTOP LARGE (≥1366px)
   ======================================== */
@media (min-width: 1366px) {
  .content-wrapper {
    max-width: 1400px;
    padding: 0 48px;
  }
}

/* ========================================
   ✅ BACKGROUND CIRCLES RESPONSIVE
   ======================================== */
@media (max-width: 1023px) {
  .bg-circle-1 {
    width: 300px;
    height: 300px;
    top: -80px;
    right: -30px;
  }

  .bg-circle-2 {
    width: 250px;
    height: 250px;
    bottom: -30px;
    left: -30px;
  }
}

@media (max-width: 767px) {
  .bg-circle-1 {
    width: 200px;
    height: 200px;
    top: -50px;
    right: -20px;
  }

  .bg-circle-2 {
    width: 180px;
    height: 180px;
    bottom: -20px;
    left: -20px;
  }
}
</style>
