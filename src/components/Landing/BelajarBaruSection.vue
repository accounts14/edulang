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
                class="feature-item row no-wrap items-start"
              >
                <q-icon name="check_circle" color="blue" size="24px" class="q-mr-md q-mt-xs" />
                <div class="text-feature text-weight-medium col">
                  {{ feat }}
                </div>
              </div>
            </div>

            <div class="action-area q-mt-xl flex q-gutter-md">
              <q-btn
                unelevated
                no-caps
                label="Apply Now"
                icon-right="arrow_forward"
                class="btn-apply"
                :to="{ name: 'AlurBelajarRoadmap' }"
              />
              <q-btn
                outline
                no-caps
                label="How it Works"
                class="btn-how"
                :to="{ name: 'AlurBelajarRoadmap' }"
              />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center relative-position">
          <div class="circle-container">
            <div class="circle-bg">
              <img
                src="~assets/landing/character-hero.png"
                class="woman-img"
                alt="Mentor Edulang"
              />
            </div>

            <div class="floating-cert cert-jlpt">
              <div class="cert-pill">
                <img
                  class="cert-logo"
                  src="https://easc.osu.edu/sites/default/files/jlpt-logo6-%20web.png"
                  alt="JLPT"
                />
                <div class="cert-text">
                  <div class="c-title">JLPT</div>
                  <div class="c-sub">International Certification</div>
                </div>
              </div>
            </div>

            <div class="floating-cert cert-ielts">
              <div class="cert-pill">
                <img
                  class="cert-logo"
                  src="https://cdn.brandfetch.io/idYQtq3VI6/w/800/h/800/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1735325202999"
                  alt="IELTS"
                />
                <div class="cert-text">
                  <div class="c-title">IELTS</div>
                  <div class="c-sub">International Certification</div>
                </div>
              </div>
            </div>

            <div class="floating-cert cert-hsk">
              <div class="cert-pill">
                <img
                  class="cert-logo"
                  src="https://www.goopenchinese.com/wp-content/uploads/2020/01/HSK-logo-1024x666.jpg"
                  alt="HSK"
                />
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
.feature-item {
  width: 100%;
  max-width: 500px;
}

.text-feature {
  color: #1e293b;
  font-size: 1.1rem;
  line-height: 1.4;
}

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
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.woman-img {
  height: 100%;
  width: auto;
  object-fit: contain;
  transform: translate(0, 0);
}

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

/* Logo pakai image */
.cert-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: contain;
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
  top: 8%;
  right: -5%;
  animation-delay: 0s;
}
.cert-ielts {
  top: 70%;
  left: -15%;
  animation-delay: 1s;
}
.cert-hsk {
  bottom: 20%;
  right: -10%;
  animation-delay: 2s;
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
  .cert-jlpt {
    top: 5%;
    right: -2%;
  }
  .cert-ielts {
    top: 75%;
    left: -10%;
  }
  .cert-hsk {
    bottom: 10%;
    right: -5%;
  }
}

/* ========================================
   🎯 MOBILE (<768px) - BUBBLE KECIL & HANYA JUDUL
   ======================================== */
@media (max-width: 767px) {
  .belajar-baru-section {
    padding: 60px 0;
  }

  .container {
    padding: 0 16px;
  }

  .col-12.col-md-6:nth-child(1) {
    order: 2;
    width: 100%;
    max-width: 100%;
    text-align: center;
  }

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
    height: 100%;
  }

  .action-area {
    flex-direction: column;
    align-items: center;
  }

  .btn-apply,
  .btn-how {
    width: 100%;
    max-width: 280px;
  }

  /* 🎯 BUBBLE KECIL - HANYA JUDUL */
  .cert-pill {
    padding: 6px 10px 6px 6px;
    border-radius: 8px;
    gap: 8px;
  }

  .cert-logo {
    width: 28px;
    height: 28px;
    border-radius: 6px;
  }

  .c-title {
    font-size: 11px;
  }

  /* Sembunyikan "International Certification" */
  .c-sub {
    display: none;
  }

  .cert-jlpt {
    top: 5%;
    right: -5%;
  }
  .cert-ielts {
    top: 65%;
    left: -8%;
  }
  .cert-hsk {
    bottom: 15%;
    right: -8%;
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    margin: 0 auto;
    width: fit-content;
  }

  .text-feature {
    font-size: 1rem;
    text-align: left;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 24px;
    max-width: 100%;
  }

  .belajar-baru-section {
    padding: 80px 0;
  }

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

  .feature-list {
    max-width: 400px;
  }

  .action-area {
    justify-content: flex-start;
  }

  .btn-apply,
  .btn-how {
    padding: 14px 28px;
  }
}

@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .belajar-baru-section {
    padding: 70px 0;
  }

  .circle-container {
    width: 360px;
    height: 360px;
  }
}

@media (min-width: 1024px) and (max-width: 1365px) {
  .container {
    max-width: 100%;
    padding: 0 32px;
  }
}

@media (min-width: 1366px) {
  .container {
    max-width: 1400px;
    padding: 0 48px;
  }
}
</style>
