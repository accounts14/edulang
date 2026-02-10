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
          <div class="circle-bg">
            <img
              src="~assets/landing/character-mentor.png"
              class="woman-img"
              alt="Mentor Edulang"
            />

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

/* Typography Sesuai Gambar */
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

.text-feature {
  color: #1e293b;
  font-size: 1rem;
}

/* Buttons Styling */
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

/* Right Side Illustration (Lingkaran & Foto) */
.circle-bg {
  width: 450px;
  height: 450px;
  background: linear-gradient(135deg, #0089ff 0%, #7dc4ff 100%);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.woman-img {
  height: 110%; /* Lebih tinggi dari lingkaran agar keluar sedikit */
  z-index: 2;
  object-fit: contain;
}

/* Floating Card Styling */
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

/* Positioning Floating Cards */
.cert-jlpt {
  top: 10%;
  right: -10%;
  animation-delay: 0s;
}
.cert-ielts {
  top: 35%;
  left: -25%;
  animation-delay: 1s;
}
.cert-hsk {
  bottom: 25%;
  right: -20%;
  animation-delay: 2s;
}

/* Background Colors for Logos */
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
  .circle-bg {
    width: 320px;
    height: 320px;
    margin-top: 50px;
  }
  .section-header {
    text-align: center;
  }
  .section-desc {
    margin: 0 auto 30px;
  }
  .feature-item {
    justify-content: center;
  }
  .action-area {
    justify-content: center;
  }
}
</style>
