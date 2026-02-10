<!-- Partnership - Dipercaya oleh Institusi Terkemuka -->
<template>
  <section class="partnership-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <h2 class="section-title text-weight-bold">Partnership</h2>
        <h3 class="section-subtitle text-weight-bold">Dipercaya oleh Institusi Terkemuka</h3>
        <p class="section-desc q-mt-sm">
          Edulang bekerjasama dengan berbagai universitas dan perusahaan untuk memberikan pendidikan
          bahasa terbaik.
        </p>
      </div>
      <div class="uni-grid q-mb-xl">
        <div v-for="u in universities" :key="u" class="uni-item">{{ u }}</div>
      </div>
      <div class="media-section">
        <h4 class="media-title text-weight-bold q-mb-md">Telah Diliput Oleh</h4>
        <p class="media-subtitle text-grey-7 q-mb-lg">Media nasional terpercaya</p>
        <div class="media-grid">
          <div v-for="m in media" :key="m" class="media-item">{{ m }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const universities = ['UI', 'UGM', 'ITB', 'UNAIR', 'UB', 'UNDIP']
const media = ['Kompas', 'Detik', 'CNN Indonesia', 'Tempo', 'Liputan 6', 'Metro TV']
</script>

<style scoped>
.partnership-section {
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
}

.uni-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.uni-item {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 700;
  color: var(--edulang-navy, #003387);
  font-size: 1.25rem;
}

.media-section {
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.media-title {
  color: var(--edulang-black, #2d2d2d);
  font-size: 1.25rem;
}

.media-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.media-item {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.8;
  font-weight: 500;
}
</style>
