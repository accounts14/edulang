<template>
  <section class="mentor-section">
    <div class="container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <div class="section-header">
            <div class="hashtag-label q-mb-md">Berbagi Skill, Bangun Dampak Untukmu</div>
            <h2 class="section-title text-weight-bold q-mb-sm">Jadilah Mentor di Edulang</h2>
            <h3 class="section-subtitle text-weight-bold q-mb-md">
              Bantu Peserta Melangkah ke Masa Depan Nyata
            </h3>
            <p class="mentor-desc q-mb-xl">
              Berkontribusi dalam sistem pembelajaran bahasa berbasis tujuan, sambil membangun
              portofolio profesional yang berkelanjutan.
            </p>

            <div class="benefit-list q-gutter-y-md q-mb-xl">
              <div v-for="(benefit, idx) in benefits" :key="idx" class="benefit-item">
                <q-icon name="check_circle" color="orange-7" size="20px" class="q-mr-md" />
                <span class="text-benefit">{{ benefit }}</span>
              </div>
            </div>

            <div class="action-area flex q-gutter-md">
              <q-btn
                unelevated
                no-caps
                label="Daftar sebagai mentor"
                icon-right="arrow_forward"
                class="btn-register-mentor"
                :to="{ name: 'ContactPage' }"
              />
              <q-btn outline no-caps label="Pelajari peran mentor" class="btn-learn-more" />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center relative-position">
          <div class="mentor-viz-container">
            <div class="viz-background">
              <img
                src="~assets/landing/character-hero.png"
                class="mentor-full-img"
                alt="Mentor Illustration"
              />

              <div class="floating-mentor-card">
                <div class="row items-center no-wrap q-mb-sm">
                  <q-avatar size="40px" class="q-mr-sm">
                    <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                  </q-avatar>
                  <div class="profile-info">
                    <div class="m-name">Mina Karin</div>
                    <q-badge color="blue" label="Mentor" class="m-badge" />
                  </div>
                </div>
                <div class="m-specialty q-mb-sm">
                  Mentor Bahasa Jepang – Jalur Akademik & Profesional
                </div>
                <p class="m-quote q-mb-sm">
                  mentor berpengalaman dalam membimbing peserta mencapai kompetensi bahasa Jepang
                  untuk kebutuhan studi dan dunia kerja.
                </p>
                <div class="m-rating flex items-center">
                  <q-icon v-for="n in 5" :key="n" name="star" color="orange-5" size="16px" />
                  <span class="q-ml-xs text-grey-7">(1,000)</span>
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
const benefits = [
  'Membangun kredibilitas sebagai mentor profesional',
  'Mendapatkan penghasilan dari sistem pembelajaran terstruktur',
  'Terhubung dengan ekosistem edukasi dan jalur global',
  'Berpeluang terlibat dalam kolaborasi edukasi jangka panjang',
  'Akses ke sistem, data progres peserta, dan peluang lanjutan',
]
</script>

<style scoped>
.mentor-section {
  padding: 100px 0;
  background: #ffffff;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Kiri: Typography & Content */
.hashtag-label {
  color: #a08149;
  font-weight: 600;
  font-size: 0.85rem;
  background: #fff7e6;
  display: inline-block;
  padding: 6px 16px;
  border-radius: 50px;
}

.section-title {
  color: #002d72;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.2;
}

.section-subtitle {
  color: #0089ff;
  font-size: 1.5rem;
  line-height: 1.3;
}

.mentor-desc {
  color: #64748b;
  font-size: 1.1rem;
  max-width: 540px;
}
.benefit-item {
  display: grid;
  grid-template-columns: 24px 1fr; /* Kolom 1 untuk ikon (24px), kolom 2 untuk teks */
  gap: 12px;
  align-items: start; /* Mengunci semua elemen di atas */
  margin-bottom: 16px;
  text-align: left;
}

.benefit-item .q-icon {
  margin-top: 2px; /* Penyesuaian mikro agar sejajar baris pertama */
  display: block;
}

.text-benefit {
  color: #1e293b;
  font-size: 1rem;
  line-height: 1.5; /* Memberi ruang agar teks 2 baris terlihat rapi */
  display: block;
}

/* Kiri: Buttons */
.btn-register-mentor {
  background: #0056b3;
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
}

.btn-learn-more {
  color: #0089ff;
  border: 1px solid #0089ff;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
}

/* Kanan: Visual & Floating Card */
.mentor-viz-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
}

.viz-background {
  width: 420px;
  height: 380px;
  background-color: #0089ff;
  border-radius: 30px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.mentor-full-img {
  height: 100%;
  z-index: 1;
  object-fit: contain;
}

/* Floating Mentor Card Styling */
/* Floating Mentor Card Styling */
.floating-mentor-card {
  position: absolute;
  /* Mengubah posisi dari 30px menjadi lebih rendah */
  top: 230px;
  /* Menyesuaikan posisi ke kanan agar proporsional */
  right: -100px;
  width: 290px;
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.m-name {
  font-weight: 800;
  color: #1e293b;
  font-size: 0.95rem;
}

.m-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
}

.m-specialty {
  font-weight: 800;
  color: #1e293b;
  font-size: 0.85rem;
  line-height: 1.3;
}

.m-quote {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.5;
}

.m-rating span {
  font-size: 11px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1023px) {
  .mentor-section {
    padding: 60px 0;
  }
  .floating-mentor-card {
    top: 150px;
    right: 10px;
    width: 260px;
    padding: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .viz-background {
    margin-bottom: 40px;
  }
  .viz-background {
    width: 320px;
    height: 280px;
  }
  .section-header {
    text-align: left;
  }
}

/* ========================================
    🎯 MOBILE (<768px) - REVISED VISUAL
   ======================================== */
@media (max-width: 767px) {
  .mentor-section {
    padding: 40px 0;
  }

  /* Urutan: Gambar di atas, Teks di bawah */
  .col-12.col-md-6:nth-child(1) {
    order: 2;
  }
  .col-12.col-md-6:nth-child(2) {
    order: 1;
    display: flex;
    justify-content: center; /* Karakter di tengah */
    margin-bottom: 80px; /* Memberi ruang untuk kartu yang melayang di bawah */
  }

  .section-header {
    text-align: left;
  }

  /* Visual Container di HP */
  .mentor-viz-container {
    max-width: 300px; /* Ukuran lebih kecil agar pas di HP */
  }

  .viz-background {
    width: 260px;
    height: 240px;
    border-radius: 20px;
  }

  /* KUNCI: Posisi Kartu di HP */
  .floating-mentor-card {
    position: absolute; /* Tetap absolut untuk menumpuk */
    top: 160px; /* Turun ke area bawah karakter */
    right: -20px; /* Geser sedikit ke kanan luar background biru */
    left: auto;
    width: 240px; /* Lebar diperkecil agar tidak makan tempat */
    padding: 15px;
    margin-top: 0;
    transform: none;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  /* Penyesuaian teks dalam kartu agar tidak terlalu besar di HP */
  .m-specialty {
    font-size: 0.75rem;
  }
  .m-quote {
    display: none;
  } /* Opsional: Sembunyikan kutipan panjang di HP agar ringkas */

  .action-area {
    flex-direction: column;
    gap: 12px;
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

  .mentor-section {
    padding: 80px 0;
  }

  /* iPad: 50/50 split */
  .col-12.col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .section-title {
    font-size: 2.4rem;
  }

  .section-subtitle {
    font-size: 1.4rem;
  }

  /* Visual iPad optimized */
  .mentor-viz-container {
    max-width: 420px;
  }

  .viz-background {
    width: 360px;
    height: 320px;
  }

  .floating-mentor-card {
    top: 180px;
    right: -60px;
    width: 270px;
  }

  /* Buttons horizontal */
  .action-area {
    justify-content: flex-start;
  }
}

/* ========================================
   ✅ IPAD PORTRAIT (768x1024) FIX
   ======================================== */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .mentor-section {
    padding: 70px 0;
  }

  .viz-background {
    width: 340px;
    height: 300px;
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
