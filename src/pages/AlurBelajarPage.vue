<template>
  <q-page class="alur-page bg-accent">
    <section class="method-section container">
      <!-- Header sama seperti LearningMethodSection -->
      <div class="text-center section-header q-mb-xl">
        <h2 class="section-title text-weight-bold q-mb-md">#{{ $t('alurBelajar.headline') }}</h2>
        <p class="section-desc">
          {{ $t('alurBelajar.subheadline') }}
        </p>
      </div>

      <!-- Search Bar -->
      <div class="row justify-center q-mb-xl">
        <div class="col-12" style="max-width: 640px">
          <div class="row no-wrap q-gutter-sm items-center">
            <q-input
              v-model="searchQuery"
              filled
              :placeholder="$t('alurBelajar.searchPlaceholder')"
              bg-color="white"
              rounded
              dense
              class="alur-search-input"
              @keyup.enter="onSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="grey-6" />
              </template>
            </q-input>
            <q-btn
              unelevated
              color="warning"
              text-color="dark"
              :label="$t('alurBelajar.searchButton')"
              class="text-weight-bold rounded-borders q-px-lg alur-search-btn"
              rounded
              @click="onSearch"
            />
          </div>
        </div>
      </div>

      <!-- Cards: struktur sama seperti LearningMethodSection (Profesional & Pendidikan) -->
      <div class="row q-col-gutter-lg justify-center">
        <div class="col-12 col-md-4">
          <q-card
            flat
            class="method-card method-card-accent q-pa-lg full-height rounded-borders-16 cursor-pointer"
            @click="selectPath('profesional')"
          >
            <q-avatar class="q-mb-lg method-icon accent-icon" icon="play_arrow" size="48px" />
            <div class="card-title-1 text-weight-bold q-mb-sm">
              {{ $t('alurBelajar.profesionalTitle') }}
            </div>
            <p class="card-desc accent-desc">
              {{ $t('alurBelajar.profesionalDesc') }}
            </p>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card
            flat
            class="method-card method-card-cream q-pa-lg full-height rounded-borders-16 cursor-pointer"
            @click="selectPath('pendidikan')"
          >
            <q-avatar class="q-mb-lg method-icon method-icon-yellow" icon="add" size="48px" />
            <div class="card-title text-weight-bold q-mb-sm">
              {{ $t('alurBelajar.pendidikanTitle') }}
            </div>
            <p class="card-desc card-desc-dark">
              {{ $t('alurBelajar.pendidikanDesc') }}
            </p>
          </q-card>
        </div>
      </div>
    </section>
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
  // Pindah page sesuai pilihan alur belajar
  router.push({
    name: 'AlurBelajarRoadmap',
    query: { mode: type },
  })
}
</script>

<style scoped>
/* Sama seperti LearningMethodSection */
.alur-page {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

@media (min-width: 1024px) {
  .alur-page {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

.method-section {
  padding-top: 0;
  padding-bottom: 0;
}

.section-title {
  color: var(--edulang-navy, #003387);
  font-size: clamp(1.35rem, 3vw, 1.5rem);
}

.section-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.8;
  font-size: 1rem;
  font-weight: 400;
}

.card-title {
  color: var(--edulang-black, #2d2d2d);
  font-size: 1.1rem;
}

.card-title-1 {
  color: var(--edulang-white, #fff);
  font-size: 1.1rem;
}

.card-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.8;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.6;
}

.card-desc-dark {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.85;
}

.method-icon {
  background: rgba(0, 137, 255, 0.12) !important;
  color: var(--edulang-blue, #0089ff) !important;
}

.method-icon-yellow {
  background: rgba(255, 196, 44, 0.2) !important;
  color: var(--edulang-yellow, #ffc42c) !important;
}

.method-card-accent {
  background: var(--edulang-navy, #003387) !important;
}

.accent-icon {
  background: rgba(255, 255, 255, 0.2) !important;
  color: var(--edulang-yellow, #ffc42c) !important;
}

.accent-desc {
  color: rgba(255, 255, 255, 0.9) !important;
  opacity: 1;
}

/* Kartu kuning/cream seperti di gambar (Pendidikan) */
.method-card-cream {
  background: #fff8e1 !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.method-card {
  transition: transform 0.3s ease;
  border: 1px solid #e8eef5;
}

.method-card-accent,
.method-card-cream {
  border: none;
}

.method-card:hover {
  transform: translateY(-6px);
}

.rounded-borders-16 {
  border-radius: 16px;
}

.alur-search-input {
  flex: 1;
  min-width: 0;
}

.alur-search-btn {
  border-radius: 8px;
  flex-shrink: 0;
}
</style>
