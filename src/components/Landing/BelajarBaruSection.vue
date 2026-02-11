<template>
  <section class="belajar-baru-section">
    <div class="container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <div class="section-header">
            <div class="hashtag-label q-mb-md">#BelajarBarumuDimulai</div>
            <h2 class="section-title text-weight-bold q-mb-md">
              Solusi Tepat Belajar <br />
              <span class="text-primary">Bahasa</span>
            </h2>
            <p class="section-desc q-mb-xl">
              Kuasai bahasa, buka pintu karier lebih lebar dengan bimbingan intensif.
            </p>

            <div class="feature-list q-gutter-y-md">
              <div
                v-for="(feat, idx) in features"
                :key="idx"
                class="feature-item flex items-center"
              >
                <q-icon name="check_circle" color="blue" size="24px" class="q-mr-md" />
                <span class="text-feature text-weight-medium">{{ feat }}</span>
              </div>
            </div>

            <div class="action-area q-mt-xl flex q-gutter-md">
              <q-btn
                unelevated
                no-caps
                label="Apply Now"
                icon-right="arrow_forward"
                class="btn-apply"
              />
              <q-btn outline no-caps label="How it Works" class="btn-how" />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center relative-position">
          <div class="circle-container">
            <div class="circle-bg">
              <img
                src="~assets/landing/character-mentor.png"
                class="woman-img"
                alt="Mentor Edulang"
              />
            </div>

            <div class="floating-cert cert-jlpt">
              <div class="cert-pill">
                <div class="cert-logo bg-navy">JLPT</div>
                <div class="cert-text">
                  <div class="c-title">JLPT</div>
                  <div class="c-sub">International Certification</div>
                </div>
              </div>
            </div>

            <div class="floating-cert cert-ielts">
              <div class="cert-pill">
                <div class="cert-logo bg-blue">IELTS</div>
                <div class="cert-text">
                  <div class="c-title">IELTS</div>
                  <div class="c-sub">International Certification</div>
                </div>
              </div>
            </div>

            <div class="floating-cert cert-hsk">
              <div class="cert-pill">
                <div class="cert-logo bg-amber">HSK</div>
                <div class="cert-text">
                  <div class="c-title">HSK</div>
                  <div class="c-sub">International Certification</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  'Bimbingan Langsung dari Ahlinya',
  'Akses Materi Terupdate Selamanya',
  'Kurikulum dinamis yang terus berkembang',
]
</script>

<style scoped>
.belajar-baru-section {
  padding: 100px 0;
  background: #f8fafc;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hashtag-label {
  color: #0089ff;
  font-weight: 700;
  font-size: 0.9rem;
  background: rgba(0, 137, 255, 0.1);
  display: inline-block;
  padding: 4px 12px;
  border-radius: 50px;
}

.section-title {
  color: #002d72;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -1px;
}

.section-desc {
  color: #64748b;
  font-size: 1.15rem;
  max-width: 450px;
}

.btn-apply {
  background: #0056b3;
  color: white;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
}

.btn-how {
  color: #0089ff;
  border: 1px solid #0089ff;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
}

/* MODIFIKASI WRAPPER LINGKARAN */
.circle-container {
  position: relative;
  width: 450px;
  height: 450px;
}

.circle-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0089ff 0%, #7dc4ff 100%);
  border-radius: 50%;
  position: relative;
  overflow: hidden; /* Ini yang memotong bagian bawah gambar mengikuti lingkaran */
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.woman-img {
  height: 100%; /* Ukuran tetap mengikuti tinggi lingkaran */
  width: auto;
  z-index: 2;
  object-fit: contain;
  /* Jika ingin kepala sedikit keluar, gunakan transform & scale, 
     tapi untuk potongan bersih sesuai gambar, 100% adalah yang paling aman */
  transform: translateY(10%);
}

/* Floating Card Styling (Tetap sama, pastikan z-index tinggi) */
.floating-cert {
  position: absolute;
  z-index: 10;
  animation: float 4s ease-in-out infinite;
}

.cert-pill {
  background: white;
  padding: 8px 16px 8px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  gap: 12px;
}

.cert-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 10px;
}

.c-title {
  font-weight: 700;
  font-size: 12px;
  color: #1e293b;
  line-height: 1;
}
.c-sub {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 2px;
}

.cert-jlpt {
  top: 10%;
  right: -5%;
  animation-delay: 0s;
}
.cert-ielts {
  top: 40%;
  left: -15%;
  animation-delay: 1s;
}
.cert-hsk {
  bottom: 20%;
  right: -10%;
  animation-delay: 2s;
}

.bg-navy {
  background-color: #002d72;
}
.bg-blue {
  background-color: #0089ff;
}
.bg-amber {
  background-color: #ffb100;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 1023px) {
  .circle-container {
    width: 320px;
    height: 320px;
    margin-top: 50px;
  }
  .section-header {
    text-align: center;
  }
  .action-area {
    justify-content: center;
  }
}

/* ========================================
   🎯 MOBILE (<768px) - FULL RESPONSIVE
   ======================================== */
@media (max-width: 767px) {
  .belajar-baru-section {
    padding: 60px 0;
  }

  .container {
    padding: 0 16px;
  }

  /* Content full width + centered */
  .col-12.col-md-6:nth-child(1) {
    order: 2;
    width: 100%;
    max-width: 100%;
    text-align: center;
  }

  /* Circle image dibawah */
  .col-12.col-md-6:nth-child(2) {
    order: 1;
    width: 100%;
    max-width: 100%;
    margin-bottom: 2.5rem;
  }

  .section-title {
    font-size: 2.1rem;
    line-height: 1.2;
  }

  .section-desc {
    font-size: 1rem;
    text-align: center;
    max-width: none;
  }

  .circle-container {
    width: 280px;
    height: 280px;
    margin: 0 auto;
  }

  .circle-bg {
    width: 100%;
    height: 100%;
  }

  .woman-img {
    height: 95%;
  }

  /* Buttons stack vertical */
  .action-area {
    flex-direction: column;
    align-items: center;
  }

  .btn-apply,
  .btn-how {
    width: 100%;
    max-width: 280px;
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

  .belajar-baru-section {
    padding: 80px 0;
  }

  /* iPad: 50/50 split */
  .col-12.col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .section-title {
    font-size: 2.8rem;
    line-height: 1.15;
  }

  .section-desc {
    font-size: 1.1rem;
  }

  .circle-container {
    width: 380px;
    height: 380px;
  }

  /* Feature list: 1 kolom iPad */
  .feature-list {
    max-width: 400px;
  }

  /* Buttons horizontal iPad */
  .action-area {
    justify-content: flex-start;
  }

  .btn-apply,
  .btn-how {
    padding: 14px 28px;
  }
}

/* ========================================
   ✅ IPAD PORTRAIT (768x1024) FIX
   ======================================== */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .belajar-baru-section {
    padding: 70px 0;
  }

  .circle-container {
    width: 360px;
    height: 360px;
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
