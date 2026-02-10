<!-- CTA Final - Mulai Perjalanan Bahasamu Hari Ini! -->
<template>
  <section class="cta-final-section">
    <div class="container">
      <div class="cta-card relative-position">
        <div class="cta-character">
          <q-img
            src="~assets/landing/character-cta.png"
            class="cta-character-img"
            fit="contain"
          />
        </div>
        <h2 class="cta-title text-weight-bold">Mulai Perjalanan Bahasamu Hari Ini!</h2>
        <p class="cta-desc">
          Bergabung dengan 10,000+ siswa yang telah merasakan kemudahan belajar bahasa bersama
          Edulang.
        </p>
        <div class="cta-benefits row justify-center q-gutter-lg q-mb-xl">
          <span>✓ Akses ke semua video pembelajaran</span>
          <span>✓ Mentor berpengalaman & bersertifikat</span>
          <span>✓ Sertifikat resmi</span>
          <span>✓ Konsultasi dengan mentor</span>
        </div>
        <div class="cta-buttons q-gutter-md">
          <q-btn
            unelevated
            no-caps
            class="btn-primary q-px-xl q-py-md"
            label="Daftar Gratis Sekarang"
            icon-right="arrow_forward"
            :to="{ name: 'BerlanggananPage' }"
          />
          <q-btn
            outline
            no-caps
            class="btn-outline q-px-xl q-py-md"
            label="Hubungi Kami"
            :to="{ name: 'ContactPage' }"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.cta-final-section {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.cta-card {
  background: linear-gradient(135deg, #003387 0%, #0089ff 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  padding-right: 200px;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 0.5rem;
}

.cta-desc {
  font-size: 1rem;
  opacity: 0.95;
  margin-bottom: 1.5rem;
}

.cta-benefits {
  font-size: 0.9375rem;
  opacity: 0.95;
  flex-wrap: wrap;
}

.btn-primary {
  background: white !important;
  color: var(--edulang-navy, #003387) !important;
  border-radius: 8px;
  font-weight: 600;
}

.btn-outline {
  border: 2px solid white !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
}

.cta-character {
  position: absolute;
  right: 1.5rem;
  bottom: 0;
  width: 200px;
  max-height: 240px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 20px 20px 0 0;
  padding: 1rem 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.cta-character-img {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

@media (max-width: 768px) {
  .cta-character {
    display: none;
  }
  .cta-card {
    padding-right: 2rem;
  }
}
</style>
