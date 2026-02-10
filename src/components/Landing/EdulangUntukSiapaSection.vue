<!-- Edulang Untuk Siapa? - Cocok untuk Semua Kalangan -->
<template>
  <section class="untuk-siapa-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <h2 class="section-title text-weight-bold q-mb-sm">Edulang Untuk Siapa?</h2>
        <h3 class="section-subtitle text-weight-bold">Cocok untuk Semua Kalangan</h3>
        <p class="section-desc q-mt-md">
          Tidak peduli latar belakang atau tujuanmu, Edulang siap membantu kamu menguasai bahasa
          baru.
        </p>
      </div>
      <div class="row q-col-gutter-lg">
        <div v-for="(item, i) in items" :key="i" class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="use-case-card q-pa-lg text-center rounded-borders">
            <q-icon :name="item.icon" size="40px" color="primary" class="q-mb-md" />
            <p class="use-case-desc">{{ item.desc }}</p>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    icon: 'school',
    desc: 'Persiapan kuliah ke luar negeri atau menambah skill bahasa asing.',
  },
  {
    icon: 'trending_up',
    desc: 'Tingkatkan karir dengan kemampuan bahasa asing untuk bisnis internasional.',
  },
  {
    icon: 'flight',
    desc: 'Persiapan traveling dan komunikasi dengan native speaker.',
  },
  {
    icon: 'menu_book',
    desc: 'Untuk kamu yang ingin mempelajari budaya melalui bahasanya.',
  },
]
</script>

<style scoped>
.untuk-siapa-section {
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
  font-size: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.use-case-card {
  height: 100%;
  border-color: #e2e8f0 !important;
}

.use-case-desc {
  color: var(--edulang-black, #2d2d2d);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
}

.rounded-borders {
  border-radius: 16px;
}
</style>
