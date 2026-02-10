<!-- #BelajarBarumuDimulai - Solusi Tepat Belajar Bahasa (LP2 concept, sebelum Testimoni) -->
<template>
  <section class="belajar-baru-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <q-chip class="hashtag-chip text-weight-bold" label="#BelajarBarumuDimulai" />
        <h2 class="section-title text-weight-bold q-mt-md q-mb-sm">Solusi Tepat Belajar Bahasa</h2>
        <p class="section-desc">
          Persiapan sertifikasi internasional dengan kurikulum terarah dan mentor berpengalaman.
        </p>
      </div>
      <div class="cert-grid">
        <div v-for="(cert, i) in certs" :key="i" class="cert-card">
          <q-card flat bordered class="cert-card-inner q-pa-lg rounded-borders">
            <div class="cert-icon-wrap">
              <span class="cert-emoji">{{ cert.emoji }}</span>
            </div>
            <div class="cert-name text-weight-bold">{{ cert.name }}</div>
            <div class="cert-desc">{{ cert.desc }}</div>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const certs = [
  { name: 'JLPT', desc: 'Japanese Language Proficiency Test', emoji: '🇯🇵' },
  { name: 'HSK', desc: 'Hanyu Shuiping Kaoshi (Mandarin)', emoji: '🇨🇳' },
  { name: 'IELTS', desc: 'International English Language Testing', emoji: '🇬🇧' },
]
</script>

<style scoped>
.belajar-baru-section {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.hashtag-chip {
  background: rgba(0, 137, 255, 0.12) !important;
  color: var(--edulang-blue, #0089ff) !important;
  font-size: 0.9375rem;
}

.section-title {
  color: var(--edulang-navy, #003387);
  font-size: clamp(1.5rem, 3vw, 1.75rem);
}

.section-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.85;
  font-size: 1rem;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.cert-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
}

.cert-card {
  flex: 1 1 180px;
  min-width: 160px;
  max-width: 240px;
}

.cert-card-inner {
  height: 100%;
  border-color: #e2e8f0 !important;
  text-align: center;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.cert-card-inner:hover {
  box-shadow: 0 8px 24px rgba(0, 51, 135, 0.12);
  transform: translateY(-2px);
}

.cert-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(0, 137, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.cert-emoji {
  font-size: 2rem;
}

.cert-name {
  color: var(--edulang-navy, #003387);
  font-size: 1.25rem;
}

.cert-desc {
  color: var(--edulang-black, #2d2d2d);
  font-size: 0.875rem;
  opacity: 0.85;
  margin-top: 4px;
}

.rounded-borders {
  border-radius: 16px;
}
</style>
