<!-- Kenapa Pilih Edulang? - Nilai Lebih yang Kami Berikan -->
<template>
  <section class="kenapa-section container">
    <div class="text-center section-header q-mb-xl">
      <h2 class="section-title text-weight-bold q-mb-sm">Kenapa Pilih Edulang?</h2>
      <h3 class="section-subtitle text-weight-bold">Nilai Lebih yang Kami Berikan</h3>
      <p class="section-desc q-mt-md">
        Edulang memberikan pengalaman belajar bahasa yang berbeda dan lebih efektif.
      </p>
    </div>
    <div class="row q-col-gutter-lg">
      <div v-for="(item, i) in items" :key="i" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="benefit-card q-pa-lg rounded-borders">
          <div class="benefit-number text-weight-bold">{{ String(i + 1).padStart(2, '0') }}</div>
          <p class="benefit-desc">{{ item }}</p>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  'Akses ribuan video pembelajaran berkualitas tinggi dari mentor profesional.',
  'Belajar langsung dari mentor native speaker dan profesional bersertifikat.',
  'Dapatkan sertifikat yang diakui setelah menyelesaikan program.',
  'Belajar kapan saja dan di mana saja sesuai jadwal kamu.',
  'Investasi pendidikan dengan harga yang ramah di kantong.',
  'Tim support yang siap membantu kapanpun kamu butuhkan.',
]
</script>

<style scoped>
.kenapa-section {
  padding-top: 3rem;
  padding-bottom: 3rem;
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
}

.benefit-card {
  height: 100%;
  border-color: #e2e8f0 !important;
  position: relative;
}

.benefit-number {
  color: var(--edulang-blue, #0089ff);
  font-size: 1.5rem;
  opacity: 0.6;
  margin-bottom: 8px;
}

.benefit-desc {
  color: var(--edulang-black, #2d2d2d);
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
}

.rounded-borders {
  border-radius: 16px;
}
</style>
