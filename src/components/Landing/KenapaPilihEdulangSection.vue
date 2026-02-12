<template>
  <section class="kenapa-section relative-position overflow-hidden">
    <div class="bg-grid-overlay"></div>

    <div class="container relative-position">
      <div class="text-center section-header q-mb-xl">
        <div class="badge-header q-mb-md">Kenapa Edulang?</div>
        <h2 class="section-title text-weight-bold q-mb-md">Alasan Memilih Edulang</h2>
        <p class="section-desc">
          Kami berkomitmen memberikan pengalaman belajar terbaik dengan berbagai keunggulan.
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div v-for="(item, i) in items" :key="i" class="col-12 col-sm-6 col-md-4">
          <q-card flat class="benefit-card q-pa-xl">
            <div class="icon-wrap q-mb-lg">
              <q-icon :name="item.icon" size="24px" color="dark" />
            </div>
            <div class="benefit-title text-weight-bold q-mb-md">{{ item.title }}</div>
            <p class="benefit-desc">{{ item.desc }}</p>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    icon: 'bolt',
    title: 'Pembelajaran Cepat',
    desc: 'Metode yang terbukti efektif dengan AI dan kurikulum terstruktur.',
  },
  {
    icon: 'verified_user',
    title: 'Mentor Berkualitas',
    desc: 'Semua mentor telah melalui proses seleksi dan verifikasi ketat.',
  },
  {
    icon: 'favorite_border',
    title: 'Harga Terjangkau',
    desc: 'Akses pendidikan berkualitas dengan harga yang ramah di kantong.',
  },
  {
    icon: 'bookmark_border',
    title: 'Materi Terupdate',
    desc: 'Kurikulum yang selalu diperbarui mengikuti standar kompetensi global.',
  },
  {
    icon: 'schedule',
    title: 'Waktu Fleksibel',
    desc: 'Atur jadwal belajarmu sendiri kapan saja dan di mana saja.',
  },
  {
    icon: 'check_circle_outline',
    title: 'Hasil Terjamin',
    desc: 'Sertifikat resmi dan peningkatan kemampuan yang nyata terukur.',
  },
]
</script>

<style scoped>
/* Latar Belakang Biru Tua Pekat sesuai Gambar */
.kenapa-section {
  padding: 100px 0;
  background-color: #003387; /* Deep Navy Blue */
  color: #ffffff;
  position: relative;
}

/* KODE TAMBAHAN: Garis Kotak-Kotak (Grid) 
  Menggunakan linear-gradient untuk membuat pattern garis vertikal & horizontal
*/
.bg-grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Membuat garis kotak dengan transparansi tipis agar tidak mengganggu konten */
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px; /* Ukuran kotak */
  pointer-events: none; /* Agar tidak menghalangi klik pada card */
  z-index: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 1; /* Pastikan konten di atas grid */
}

/* Badge Kecil di Atas Judul */
.badge-header {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 6px 20px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
}

.section-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Kartu Transparan (Glassmorphism Effect) */
.benefit-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.05) !important;
  /* Glassmorphism diperkuat agar garis background terlihat di belakangnya */
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-8px);
}

/* Lingkaran Ikon Kuning Cerah */
.icon-wrap {
  width: 48px;
  height: 48px;
  background-color: #ffc107; /* Edulang Yellow */
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-title {
  font-size: 1.25rem;
  color: #ffffff;
}

.benefit-desc {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 600px) {
  .kenapa-section {
    padding: 60px 0;
  }
}

/* ========================================
   🎯 MOBILE (<768px) - 2 KOLOM
   ======================================== */
@media (max-width: 767px) {
  .kenapa-section {
    padding: 60px 0;
  }

  .container {
    padding: 0 16px;
  }

  .section-title {
    font-size: 2rem;
    line-height: 1.25;
  }

  .section-desc {
    font-size: 1rem;
    padding: 0 8px;
  }

  /* Cards: 2 kolom mobile */
  .col-12.col-sm-6.col-md-4 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .benefit-card {
    padding: 1.25rem !important;
  }

  .icon-wrap {
    width: 40px;
    height: 40px;
  }

  .benefit-title {
    font-size: 1.1rem;
  }

  .benefit-desc {
    font-size: 0.875rem;
  }
}

/* ========================================
   ✅ IPAD (768px-1023px) - 3 KOLOM
   ======================================== */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    padding: 0 24px;
    max-width: 100%;
  }

  .kenapa-section {
    padding: 80px 0;
  }

  .section-title {
    font-size: 2.6rem;
  }

  .section-desc {
    font-size: 1.05rem;
  }

  /* Cards: 3 kolom iPad */
  .col-12.col-sm-6.col-md-4 {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }

  .benefit-card {
    padding: 1.5rem !important;
  }

  .benefit-title {
    font-size: 1.2rem;
  }
}

/* ========================================
   ✅ IPAD PORTRAIT (768x1024) FIX
   ======================================== */
@media (min-width: 768px) and (max-height: 1024px) and (orientation: portrait) {
  .kenapa-section {
    padding: 70px 0;
  }

  .benefit-card {
    padding: 1.25rem !important;
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

/* ========================================
   ✅ DARK MODE & HOVER FIXES
   ======================================== */
@media (prefers-color-scheme: dark) {
  .benefit-card {
    border-color: rgba(255, 255, 255, 0.15) !important;
  }
}
</style>
