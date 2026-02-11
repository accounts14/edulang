<template>
  <section class="cta-final-section">
    <div class="container">
      <div class="cta-card overflow-hidden">
        <div class="row items-center full-height">
          <div class="col-12 col-md-7 cta-content-wrapper">
            <h2 class="cta-title text-weight-bold q-mb-md">Mulai Perjalanan Bahasamu Hari Ini!</h2>
            <p class="cta-desc q-mb-xl">
              Bergabung dengan 10,000+ siswa yang telah merasakan kemudahan belajar bahasa bersama
              Edulang.
            </p>

            <div class="cta-benefits-grid q-mb-xl">
              <div class="benefit-item">
                <q-icon name="check_circle_outline" size="20px" class="q-mr-sm" />
                <span>Akses ke semua video pembelajaran</span>
              </div>
              <div class="benefit-item">
                <q-icon name="check_circle_outline" size="20px" class="q-mr-sm" />
                <span>Mentor berpengalaman & bersertifikat</span>
              </div>
              <div class="benefit-item">
                <q-icon name="check_circle_outline" size="20px" class="q-mr-sm" />
                <span>Sertifikat resmi</span>
              </div>
              <div class="benefit-item">
                <q-icon name="check_circle_outline" size="20px" class="q-mr-sm" />
                <span>Konsultasi dengan mentor</span>
              </div>
            </div>

            <div class="cta-actions flex q-gutter-md">
              <q-btn
                unelevated
                no-caps
                class="btn-cta-yellow q-px-xl q-py-md"
                label="Daftar Gratis Sekarang"
                icon-right="arrow_forward"
              />
              <q-btn outline no-caps class="btn-cta-outline q-px-xl q-py-md" label="Hubungi Kami" />
            </div>
          </div>

          <div class="col-12 col-md-5 relative-position cta-image-container">
            <!-- Floating elements -->
            <div class="floating-star star-1"></div>
            <div class="floating-star star-2"></div>
            <div class="floating-sparkle sparkle-1"></div>
            <div class="floating-sparkle sparkle-2"></div>
            <q-img
              src="~assets/landing/character-testimonial.png"
              class="cta-character-img"
              fit="contain"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-final-section {
  padding: 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.cta-card {
  background: linear-gradient(90deg, #0046ad 0%, #007bff 100%);
  border-radius: 30px;
  min-height: 500px;
  color: white;
  position: relative;
  overflow: visible;
}

.cta-content-wrapper {
  padding: 60px;
  z-index: 2;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.2;
}

.cta-desc {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 500px;
}

.cta-benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.benefit-item {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.benefit-item .q-icon {
  color: #ffcc00;
}

.btn-cta-yellow {
  background: #ffc107 !important;
  color: #1e293b !important;
  font-weight: 700;
  border-radius: 12px;
}

.btn-cta-outline {
  color: white !important;
  border: 2px solid white !important;
  font-weight: 700;
  border-radius: 12px;
}

.cta-image-container {
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
}

.cta-character-img {
  width: 220%;
  max-width: 900px;
  height: auto;
  z-index: 3;
  /* ✅ TURUN LAGI - lebih ke bawah */
  transform: translateY(30px) scale(1.15);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}

/* Floating elements */
.floating-star {
  position: absolute;
  background: #ffd700;
  border-radius: 50%;
  z-index: 2;
}

.star-1 {
  width: 12px;
  height: 12px;
  top: 15%;
  right: 10%;
  animation: float 3s ease-in-out infinite;
}

.star-2 {
  width: 8px;
  height: 8px;
  top: 25%;
  left: 15%;
  animation: float 4s ease-in-out infinite reverse;
}

.floating-sparkle {
  position: absolute;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
  border-radius: 50%;
  z-index: 2;
}

.sparkle-1 {
  width: 20px;
  height: 20px;
  top: 35%;
  right: 20%;
  animation: sparkle 2.5s ease-in-out infinite;
}

.sparkle-2 {
  width: 16px;
  height: 16px;
  top: 50%;
  left: 25%;
  animation: sparkle 3s ease-in-out infinite 0.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}

/* Responsif */
@media (max-width: 1023px) {
  .cta-content-wrapper {
    padding: 40px;
    text-align: center;
  }
  .cta-desc {
    margin-left: auto;
    margin-right: auto;
  }
  .cta-benefits-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }
  .cta-actions {
    justify-content: center;
  }
  .cta-card {
    min-height: 550px;
  }
  .cta-image-container {
    min-height: 400px;
    margin-top: 30px;
  }
  .cta-character-img {
    width: 140%;
    max-width: 500px;
    transform: translateY(20px) scale(1.1);
  }
}

@media (max-width: 768px) {
  .cta-character-img {
    width: 120%;
    max-width: 380px;
    transform: translateY(15px) scale(1.1);
  }
  .floating-star,
  .floating-sparkle {
    display: none;
  }
}

/* ========================================
   🎯 MOBILE (<768px) - FULL RESPONSIVE
   ======================================== */
@media (max-width: 767px) {
  .cta-final-section {
    padding: 50px 0;
  }

  .container {
    padding: 0 16px;
  }

  /* Single column stacked */
  .cta-content-wrapper {
    order: 2;
    width: 100%;
    padding: 2rem 1.5rem !important;
    text-align: center;
  }

  .cta-image-container {
    order: 1;
    width: 100%;
    min-height: 300px;
    margin-bottom: 2rem;
  }

  .cta-title {
    font-size: 1.8rem;
    line-height: 1.25;
  }

  .cta-desc {
    font-size: 1rem;
    max-width: none;
  }

  .cta-benefits-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 320px;
    margin: 0 auto 1.5rem;
  }

  .benefit-item {
    justify-content: center;
    font-size: 0.9rem;
  }

  /* Buttons stack vertical */
  .cta-actions {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .btn-cta-yellow,
  .btn-cta-outline {
    width: 100%;
    max-width: 300px;
  }

  .cta-card {
    min-height: 650px;
    border-radius: 20px;
  }

  .cta-character-img {
    width: 100%;
    max-width: 320px;
    transform: translateY(10px) scale(1);
  }
}

/* ========================================
   ✅ IPAD (768px-1023px) - PERFECT SPLIT
   ======================================== */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 24px;
    max-width: 100%;
  }

  .cta-final-section {
    padding: 55px 0;
  }

  /* iPad: 60% content | 40% image */
  .col-12.col-md-7 {
    flex: 0 0 60%;
    max-width: 60%;
  }

  .col-12.col-md-5 {
    flex: 0 0 40%;
    max-width: 40%;
  }

  .cta-content-wrapper {
    padding: 2.5rem !important;
  }

  .cta-title {
    font-size: 2.3rem;
  }

  .cta-benefits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .cta-card {
    min-height: 550px;
    border-radius: 24px;
  }

  .cta-character-img {
    width: 160%;
    max-width: 600px;
    transform: translateY(25px) scale(1.1);
  }
}

/* ========================================
   ✅ IPAD PORTRAIT (768x1024) FIX
   ======================================== */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .cta-final-section {
    padding: 50px 0;
  }

  .cta-card {
    min-height: 520px;
  }
}

/* ========================================
   ✅ DESKTOP SMALL (1024px-1365px)
   ======================================== */
@media (min-width: 1024px) and (max-width: 1365px) {
  .container {
    max-width: 100%;
    padding: 0 32px;
  }
}

/* ========================================
   ✅ DESKTOP LARGE (≥1366px)
   ======================================== */
@media (min-width: 1366px) {
  .container {
    max-width: 1400px;
    padding: 0 48px;
  }
}
</style>
