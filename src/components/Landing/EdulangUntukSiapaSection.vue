<!-- Edulang Untuk Siapa? - Konsep LP2 (friendly, horizontal cards) -->
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
      <div class="use-case-row">
        <div v-for="(item, i) in items" :key="i" class="use-case-card-wrap">
          <q-card flat bordered class="use-case-card q-pa-lg rounded-borders">
            <div class="use-case-icon-wrap">
              <q-icon :name="item.icon" size="36px" color="primary" />
            </div>
            <div class="use-case-title text-weight-bold q-mb-sm">{{ item.title }}</div>
            <p class="use-case-desc">{{ item.desc }}</p>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  { icon: 'school', title: 'Pelajar & Mahasiswa', desc: 'Persiapan kuliah ke luar negeri atau menambah skill bahasa asing.' },
  { icon: 'work', title: 'Profesional', desc: 'Tingkatkan karir dengan kemampuan bahasa asing untuk bisnis internasional.' },
  { icon: 'person_search', title: 'Job Seeker', desc: 'Raih peluang kerja global dengan kemampuan bahasa yang mumpuni.' },
  { icon: 'emoji_events', title: 'Calon Penerima Beasiswa', desc: 'Siapkan JLPT, HSK, IELTS untuk beasiswa impianmu.' },
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

.use-case-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
}

.use-case-card-wrap {
  flex: 1 1 220px;
  min-width: 200px;
  max-width: 280px;
}

.use-case-card {
  height: 100%;
  border-color: #e2e8f0 !important;
  text-align: center;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.use-case-card:hover {
  box-shadow: 0 8px 24px rgba(0, 51, 135, 0.1);
  transform: translateY(-2px);
}

.use-case-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(0, 137, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.use-case-title {
  color: var(--edulang-navy, #003387);
  font-size: 1rem;
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
