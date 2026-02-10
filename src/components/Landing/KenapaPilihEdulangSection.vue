<template>
  <section class="kenapa-section">
    <div class="container">
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
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  background: rgba(255, 255, 255, 0.08) !important;
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
</style>
