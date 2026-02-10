<!-- Penghargaan - Pencapaian yang Membanggakan -->
<template>
  <section class="penghargaan-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <h2 class="section-title text-weight-bold">Penghargaan</h2>
        <h3 class="section-subtitle text-weight-bold">Pencapaian yang Membanggakan</h3>
        <p class="section-desc q-mt-sm">
          Berbagai penghargaan yang kami terima menjadi bukti komitmen kami dalam memberikan
          pendidikan terbaik.
        </p>
      </div>
      <div class="row q-col-gutter-lg">
        <div v-for="(award, i) in awards" :key="i" class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="award-card q-pa-lg text-center rounded-borders">
            <div class="award-title text-weight-bold q-mb-sm">{{ award.title }}</div>
            <div class="award-source text-caption text-grey-7">{{ award.source }}</div>
            <div class="award-year text-weight-bold q-mt-sm">{{ award.year }}</div>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const awards = [
  {
    title: 'Best EdTech Startup 2024',
    source: 'Indonesia Startup Awards',
    year: '2024',
  },
  {
    title: 'Top 10 Language Learning Platform',
    source: 'Asia Pacific Education Awards',
    year: '2024',
  },
  {
    title: 'Most Innovative Learning Solution',
    source: 'Digital Innovation Awards',
    year: '2023',
  },
  {
    title: 'Customer Choice Award',
    source: 'Indonesia Customer Awards',
    year: '2023',
  },
]
</script>

<style scoped>
.penghargaan-section {
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

.award-card {
  height: 100%;
  border-color: #e2e8f0 !important;
}

.award-title {
  color: var(--edulang-navy, #003387);
  font-size: 1rem;
}

.award-year {
  color: var(--edulang-blue, #0089ff);
  font-size: 0.875rem;
}

.rounded-borders {
  border-radius: 16px;
}
</style>
