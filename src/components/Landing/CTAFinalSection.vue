<!-- CTA Final - Mulai Perjalanan Bahasamu Hari Ini! -->
<template>
  <section class="cta-final-section">
    <div class="container">
      <div class="cta-card">
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
</style>
