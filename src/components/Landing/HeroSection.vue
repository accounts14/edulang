<!-- Hero - Unlock the World with Education (edulang-speak-the-world) -->
<template>
  <section class="hero-section">
    <div class="container hero-inner">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-lg-6">
          <div class="hero-badge q-mb-md">Platform Belajar Bahasa #1 di Indonesia</div>
          <h1 class="hero-title text-weight-bold q-mb-md">
            Unlock the World<br />
            <span class="text-edulang-blue">with Education</span>
          </h1>
          <p class="hero-desc q-mb-lg">
            Belajar bahasa asing dengan mudah, cepat, dan terjangkau bersama mentor profesional
            melalui video pembelajaran interaktif.
          </p>
          <div class="hero-cta q-gutter-md">
            <q-btn
              unelevated
              no-caps
              class="btn-primary q-px-xl q-py-md"
              label="Mulai Belajar Gratis"
              icon-right="arrow_forward"
              :to="{ name: 'BerlanggananPage' }"
            />
            <q-btn
              outline
              no-caps
              class="btn-outline q-px-xl q-py-md"
              label="Lihat Demo"
              :to="{ name: 'AlurBelajarPage' }"
            />
          </div>
          <div class="hero-stats row q-mt-xl q-gutter-xl">
            <div class="stat-item">
              <div class="stat-value text-weight-bold">10,000+</div>
              <div class="stat-label text-grey-7">Siswa Aktif</div>
            </div>
            <div class="stat-item">
              <div class="stat-value text-weight-bold">8</div>
              <div class="stat-label text-grey-7">Bahasa Tersedia</div>
            </div>
            <div class="stat-item">
              <div class="stat-value text-weight-bold">4.9</div>
              <div class="stat-label text-grey-7">Rating Pengguna</div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-6 flex flex-center q-mt-lg q-mt-none">
          <div class="hero-lang-grid">
            <div class="lang-chip">🇯🇵 日本語</div>
            <div class="lang-chip">🇰🇷 한국어</div>
            <div class="lang-chip">🇩🇪 Deutsch</div>
            <div class="lang-chip">🇨🇳 中文</div>
            <div class="lang-chip">🇸🇦 Bahasa Arab</div>
            <div class="lang-chip">🇩🇪 Bahasa Jerman</div>
            <div class="lang-chip">🇺🇸 Bahasa Inggris</div>
            <div class="lang-chip">🇯🇵 Bahasa Jepang</div>
          </div>
          <p class="text-caption text-grey-7 q-mt-md">Tersedia dalam berbagai bahasa populer</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.hero-section {
  padding-top: 2rem;
  padding-bottom: 3rem;
  min-height: 85vh;
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.hero-badge {
  display: inline-block;
  background: rgba(0, 137, 255, 0.1);
  color: var(--edulang-blue, #0089ff);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.hero-title {
  color: var(--edulang-navy, #003387);
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.2;
}

.text-edulang-blue {
  color: var(--edulang-blue, #0089ff);
}

.hero-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.9;
  font-size: 1.1rem;
  line-height: 1.7;
}

.btn-primary {
  background: var(--edulang-blue, #0089ff) !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
}

.btn-outline {
  border: 2px solid var(--edulang-navy, #003387) !important;
  color: var(--edulang-navy, #003387) !important;
  border-radius: 8px;
  font-weight: 600;
}

.hero-stats .stat-value {
  font-size: 1.5rem;
  color: var(--edulang-navy, #003387);
}

.hero-stats .stat-label {
  font-size: 0.875rem;
}

.hero-lang-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-width: 320px;
}

.lang-chip {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 500;
  color: var(--edulang-black, #2d2d2d);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

@media (min-width: 768px) {
  .hero-lang-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
