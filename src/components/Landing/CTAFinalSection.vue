<template>
  <section class="cta-final-section">
    <div class="container">
      <div class="cta-card overflow-hidden">
        <div class="row items-center full-height">
          <div class="col-12 col-md-7 cta-content-wrapper">
            <h2 class="cta-title text-weight-bold q-mb-md">Mulai Perjalanan Bahasamu Hari Ini!</h2>
            <p class="cta-desc q-mb-lg">
              Bergabung dengan 10,000+ siswa yang telah merasakan kemudahan belajar bahasa bersama
              Edulang.
            </p>

            <div class="cta-benefits-grid q-mb-xl">
              <div class="benefit-item">
                <q-icon name="check_circle_outline" size="18px" class="benefit-icon" />
                <div class="benefit-text">Akses ke semua video pembelajaran</div>
              </div>
              <div class="benefit-item">
                <q-icon name="check_circle_outline" size="18px" class="benefit-icon" />
                <div class="benefit-text">Mentor berpengalaman & bersertifikat</div>
              </div>
              <div class="benefit-item">
                <q-icon name="check_circle_outline" size="18px" class="benefit-icon" />
                <div class="benefit-text">Sertifikat resmi</div>
              </div>
              <div class="benefit-item">
                <q-icon name="check_circle_outline" size="18px" class="benefit-icon" />
                <div class="benefit-text">Konsultasi dengan mentor</div>
              </div>
            </div>

            <div class="cta-actions row q-gutter-md">
              <q-btn
                unelevated
                no-caps
                class="btn-cta-yellow col-12 col-sm-auto q-px-xl q-py-md"
                label="Daftar Gratis Sekarang"
                icon-right="arrow_forward"
                :to="{ name: 'login' }"
              />
              <q-btn
                outline
                no-caps
                class="btn-cta-outline col-12 col-sm-auto q-px-xl q-py-md"
                label="Hubungi Kami"
                :to="{ name: 'ContactPage' }"
              />
            </div>
          </div>

          <div class="col-12 col-md-5 relative-position cta-image-container">
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
  gap: 16px 32px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  text-align: left;
}

.benefit-icon {
  color: #ffcc00;
  flex-shrink: 0;
  margin-top: 3px;
  margin-right: 12px;
}

.benefit-text {
  font-size: 0.95rem;
  line-height: 1.4;
  flex: 1;
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
  min-height: 450px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.cta-character-img {
  width: 100%;
  max-width: 500px;
  transform: translateY(40px) scale(1.1);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
}

/* --- RESPONSIVE MOBILE FIX (HP) --- */
@media (max-width: 767px) {
  .cta-final-section {
    padding: 40px 0;
  }

  .cta-content-wrapper {
    padding: 30px 20px !important;
    text-align: left !important;
    order: 2;
  }

  .cta-image-container {
    order: 1;
    min-height: 220px;
    margin-bottom: 0;
  }

  /* Ukuran Judul Lebih Kecil di HP */
  .cta-title {
    font-size: 1.5rem; /* Lebih ringkas */
    line-height: 1.3;
  }

  /* Ukuran Deskripsi Lebih Kecil di HP */
  .cta-desc {
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  /* Grid List di HP */
  .cta-benefits-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 30px !important;
  }

  /* Teks Benefit Lebih Kecil di HP */
  .benefit-text {
    font-size: 0.85rem;
  }

  .benefit-icon {
    margin-top: 1px; /* Penyesuaian alignment ikon */
  }

  /* Tombol di HP */
  .cta-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .btn-cta-yellow,
  .btn-cta-outline {
    width: 100%;
    font-size: 0.9rem; /* Teks tombol sedikit lebih kecil */
    padding: 12px !important;
    margin-left: 0 !important;
  }

  .cta-character-img {
    max-width: 280px;
    transform: translateY(15px) scale(1);
  }
}

/* --- TABLET/IPAD --- */
@media (min-width: 768px) and (max-width: 1023px) {
  .cta-title {
    font-size: 2rem;
  }
  .cta-benefits-grid {
    grid-template-columns: 1fr;
  }
}

/* Animations */
.floating-star,
.floating-sparkle {
  position: absolute;
  z-index: 1;
}
.star-1 {
  width: 12px;
  height: 12px;
  background: #ffd700;
  border-radius: 50%;
  top: 15%;
  right: 10%;
  animation: float 3s infinite;
}
.star-2 {
  width: 8px;
  height: 8px;
  background: #ffd700;
  border-radius: 50%;
  top: 25%;
  left: 10%;
  animation: float 4s infinite reverse;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}
</style>
