<template>
  <section class="untuk-siapa-section">
    <div class="container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-7">
          <div class="section-header q-mb-xl">
            <div class="badge-custom q-mb-md">Edulang untuk Siapa?</div>
            <h2 class="section-title text-weight-bold no-margin">
              Untuk Semua yang Ingin <br />
              <span class="text-blue-gradient">Berkembang</span>
            </h2>
            <p class="section-desc q-mt-lg">
              Apapun tujuanmu — studi, kerja, atau pengembangan diri — Edulang siap membantu
              mencapai impianmu dengan pembelajaran yang personal dan terarah.
            </p>
          </div>

          <div class="row q-col-gutter-md">
            <div v-for="(item, i) in items" :key="i" class="col-12 col-sm-6">
              <q-card flat bordered class="use-case-card rounded-borders">
                <q-card-section horizontal class="items-center q-pa-md">
                  <div class="use-case-icon-wrap q-mr-md" :class="item.bgColor">
                    <q-icon :name="item.icon" size="22px" :color="item.iconColor" />
                  </div>
                  <div>
                    <div class="use-case-title text-weight-bold">
                      {{ item.title }}
                    </div>
                    <p class="use-case-desc q-mt-xs">{{ item.desc }}</p>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5 flex flex-center relative-position">
          <div class="glow-bg"></div>

          <div class="bubble-grid">
            <div class="bubble-item animate-float-slow">
              <div class="inner-box shadow-custom">
                <q-icon
                  name="school"
                  color="blue-6"
                  size="24px"
                  class="bg-blue-1 q-pa-sm rounded-borders"
                />
                <span class="q-mt-sm text-label">Pelajar</span>
              </div>
            </div>
            <div class="bubble-item animate-float-fast">
              <div class="inner-box shadow-custom">
                <q-icon
                  name="work_outline"
                  color="indigo-9"
                  size="24px"
                  class="bg-indigo-1 q-pa-sm rounded-borders"
                />
                <span class="q-mt-sm text-label">Profesional</span>
              </div>
            </div>
            <div class="bubble-item animate-float-fast">
              <div class="inner-box shadow-custom">
                <q-icon
                  name="person_outline"
                  color="orange-8"
                  size="24px"
                  class="bg-orange-1 q-pa-sm rounded-borders"
                />
                <span class="q-mt-sm text-label">Job</span>
              </div>
            </div>
            <div class="bubble-item animate-float-slow">
              <div class="inner-box shadow-custom">
                <q-icon
                  name="flight_takeoff"
                  color="blue-7"
                  size="24px"
                  class="bg-blue-1 q-pa-sm rounded-borders"
                />
                <span class="q-mt-sm text-label">Calon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Menambahkan properti warna agar icon di kiri sesuai dengan gambar (biru muda, indigo, dll)
const items = [
  {
    icon: 'school',
    title: 'Pelajar & Mahasiswa',
    desc: 'Persiapan TOEFL, IELTS, dan bahasa lainnya untuk studi lanjut.',
    bgColor: 'bg-blue-1',
    iconColor: 'blue-6',
  },
  {
    icon: 'work_outline',
    title: 'Profesional',
    desc: 'Tingkatkan skill bahasa untuk karir internasional.',
    bgColor: 'bg-indigo-1',
    iconColor: 'indigo-9',
  },
  {
    icon: 'person_search',
    title: 'Job Seeker',
    desc: 'Persiapan kerja di perusahaan multinasional atau luar negeri.',
    bgColor: 'bg-orange-1',
    iconColor: 'orange-8',
  },
  {
    icon: 'emoji_events',
    title: 'Calon Penerima Beasiswa',
    desc: 'Bimbingan lengkap untuk mendapatkan beasiswa impian.',
    bgColor: 'bg-blue-1',
    iconColor: 'blue-7',
  },
]
</script>

<style scoped>
.untuk-siapa-section {
  padding: 100px 0;
  background: #ffffff; /* Sesuai gambar: latar belakang putih bersih */
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Badge Style - Menggunakan warna Krem Emas sesuai gambar */
.badge-custom {
  display: inline-block;
  padding: 6px 16px;
  background-color: #fdf4db; /* Warna krem gambar */
  color: #8a6d3b;
  border-radius: 50px;
  font-weight: 600;
  font-size: 13px;
}

/* Warna Judul Navy Edulang */
.section-title {
  color: #002d72; /* Navy pekat sesuai gambar */
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  line-height: 1.1;
  letter-spacing: -1px;
}

/* Gradient pada kata "Berkembang" */
.text-blue-gradient {
  background: linear-gradient(90deg, #0052cc 0%, #00a3ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.section-desc {
  color: #5e6c84; /* Abu-abu kalem sesuai gambar */
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 580px;
}

/* Card Styling - Border tipis abu-abu kebiruan */
.use-case-card {
  border: 1px solid #eef2f6 !important;
  background: #ffffff;
  height: 100%;
  transition: all 0.3s ease;
}

.use-case-card:hover {
  border-color: #0052cc !important;
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 45, 114, 0.05);
}

.use-case-icon-wrap {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.use-case-title {
  color: #172b4d;
  font-size: 0.95rem;
  letter-spacing: -0.2px;
}

.use-case-desc {
  color: #6b778c;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
}

/* Area Bubble Animasi */
.bubble-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  z-index: 2;
}

.inner-box {
  background: white;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
}

.shadow-custom {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
}

.text-label {
  font-size: 13px;
  font-weight: 700;
  color: #172b4d;
}

/* Cahaya Biru di Belakang Bubble */
.glow-bg {
  position: absolute;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(0, 163, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
  z-index: 1;
}

/* Floating Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float-slow {
  animation: float 6s ease-in-out infinite;
}

.animate-float-fast {
  animation: float 4.5s ease-in-out infinite;
  animation-delay: 1s;
}

.rounded-borders {
  border-radius: 16px;
}

@media (max-width: 1023px) {
  .section-header {
    text-align: center;
  }
  .section-desc {
    margin: 20px auto;
  }
  .badge-custom {
    display: table;
    margin: 0 auto 16px;
  }
  .bubble-grid {
    margin-top: 60px;
  }
}

/* ========================================
   🎯 MOBILE (<768px) - FULL RESPONSIVE
   ======================================== */
@media (max-width: 767px) {
  .untuk-siapa-section {
    padding: 60px 0;
  }

  .container {
    padding: 0 16px;
  }

  /* Content full width + centered */
  .col-12.col-md-7 {
    order: 2;
    width: 100%;
    max-width: 100%;
  }

  /* Image/bubble area dibawah */
  .col-12.col-md-5 {
    order: 1;
    width: 100%;
    max-width: 100%;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 2rem;
    text-align: center;
  }

  .section-desc {
    font-size: 1rem;
    text-align: center;
    margin: 0 auto 2rem;
  }

  /* Cards: 1 kolom full */
  .row.q-col-gutter-md > .col-12.col-sm-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  /* Bubble: lebih compact */
  .bubble-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    justify-content: center;
    max-width: 280px;
    margin: 0 auto;
  }

  .inner-box {
    width: 90px;
    height: 90px;
    padding: 14px;
  }

  .glow-bg {
    width: 280px;
    height: 280px;
  }
}

/* ========================================
   ✅ IPAD (768px-1023px) - BARU
   ======================================== */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 24px;
    max-width: 100%;
  }

  .untuk-siapa-section {
    padding: 80px 0;
  }

  /* iPad: 55% content | 45% bubble */
  .col-12.col-md-7 {
    flex: 0 0 55%;
    max-width: 55%;
  }

  .col-12.col-md-5 {
    flex: 0 0 45%;
    max-width: 45%;
  }

  .section-title {
    font-size: 2.6rem;
    line-height: 1.12;
  }

  .section-desc {
    font-size: 1.05rem;
    max-width: 500px;
  }

  /* Cards: 1 kolom iPad */
  .row.q-col-gutter-md > .col-12.col-sm-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  /* Bubble iPad optimized */
  .bubble-grid {
    gap: 20px;
  }

  .inner-box {
    width: 110px;
    height: 110px;
  }

  .glow-bg {
    width: 380px;
    height: 380px;
  }
}

/* ========================================
   ✅ IPAD PORTRAIT (768x1024) FIX
   ======================================== */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .untuk-siapa-section {
    padding: 70px 0;
  }

  .bubble-grid {
    gap: 18px;
  }

  .inner-box {
    width: 100px;
    height: 100px;
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

  .glow-bg {
    width: 420px;
    height: 420px;
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
