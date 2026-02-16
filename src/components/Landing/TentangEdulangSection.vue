<template>
  <section class="tentang-section">
    <div class="container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-5">
          <div class="image-wrapper relative-position">
            <div class="bg-decoration"></div>
            <q-img src="~assets/landing/character-mentor.png" class="character-img" fit="contain" />
          </div>
        </div>

        <div class="col-12 col-md-7 content-column">
          <div class="content-header q-mb-xl">
            <div class="badge-custom q-mb-md">Tentang Edulang</div>
            <h2 class="main-title no-margin text-weight-bold">
              Platform Pendidikan <br />
              Bahasa <span class="text-primary">Terlengkap</span>
            </h2>
            <p class="section-desc q-mt-lg">
              Edulang adalah platform pendidikan bahasa yang membantu siapa saja belajar dengan
              mudah, cepat, dan terjangkau. Dilengkapi AI Speaking Partner, mentor marketplace, dan
              pathway untuk kerja maupun kuliah luar negeri.
            </p>
          </div>

          <div class="row q-col-gutter-lg">
            <div v-for="(item, i) in items" :key="i" class="col-12 col-sm-6">
              <q-card flat bordered class="feature-card">
                <q-card-section class="q-pa-lg">
                  <div class="icon-box q-mb-md">
                    <q-icon :name="item.icon" size="24px" color="white" />
                  </div>
                  <div class="feature-title text-weight-bold q-mb-sm">
                    {{ item.title }}
                  </div>
                  <div class="feature-desc">
                    {{ item.desc }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    icon: 'track_changes',
    title: 'Pembelajaran Terarah',
    desc: 'Kurikulum yang dirancang khusus untuk mencapai tujuan belajar kamu dengan efektif.',
  },
  {
    icon: 'groups',
    title: 'Mentor Berpengalaman',
    desc: 'Belajar langsung dari native speaker dan mentor profesional bersertifikat.',
  },
  {
    icon: 'lightbulb',
    title: 'Metode Inovatif',
    desc: 'Kombinasi video pembelajaran, AI Speaking Partner, dan praktik langsung.',
  },
  {
    icon: 'public',
    title: 'Peluang Global',
    desc: 'Pathway untuk kerja dan kuliah di luar negeri dengan bimbingan penuh.',
  },
]
</script>

<style scoped>
.tentang-section {
  padding: 80px 0;
  overflow: visible;
  position: relative;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* BAGIAN YANG DIUBAH: Menambahkan jarak antara kiri dan kanan */
.content-column {
  padding-left: 80px !important; /* Menjauhkan teks dari gambar */
}

/* Badge Style */
.badge-custom {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #fff8e6 0%, #fff2cc 100%);
  color: #d97706;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(255, 196, 44, 0.2);
  border: 1px solid rgba(217, 119, 6, 0.2);
}

/* Title & Text */
.main-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  line-height: 1.15;
  color: #1a1a1a;
  margin: 0;
}

.main-title .text-primary {
  background: linear-gradient(135deg, #0056b3 0%, #0089ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-desc {
  color: #4a5568;
  font-size: 1.125rem;
  line-height: 1.7;
  max-width: 580px;
  opacity: 0.95;
}

/* Image & Decoration */
.image-wrapper {
  position: relative;
  height: 100%;
  min-height: 680px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
}

.relative-position {
  position: relative;
}

.bg-decoration {
  position: absolute;
  top: 8px;
  left: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  background: linear-gradient(145deg, #f0f7ff 0%, #e6f3ff 100%);
  border-radius: 48px;
  z-index: -1;
  box-shadow:
    0 20px 40px rgba(0, 86, 179, 0.15),
    inset 0 2px 8px rgba(255, 255, 255, 0.8);
  transform: rotate(-1.5deg);
}

.character-img {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 580px;
  height: 950px;
  max-width: none;
  z-index: 1;
  filter: drop-shadow(0 40px 85px rgba(0, 86, 179, 0.4));
}

/* Feature Cards */
.feature-card {
  border-radius: 24px;
  border: 2px solid #edf2f7 !important;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 3;
}

.feature-card:hover {
  border-color: #0056b3 !important;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 86, 179, 0.15);
}

.icon-box {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #0056b3 0%, #0089ff 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 86, 179, 0.3);
}

.feature-title {
  font-size: 1.25rem;
  color: #1a1a1a;
  line-height: 1.3;
}

.feature-desc {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 4px;
}

.content-header {
  margin-bottom: 2.5rem !important;
}

.q-pa-lg {
  padding: 2rem !important;
}

/* Responsivitas Mobile: Kembalikan padding ke normal agar tidak mencong */
/* ============================================================
   FIX RESPONSIVE: Karakter menempel ke garis bawah kotak
   ============================================================ */
@media (max-width: 991px) {
  .content-column {
    padding-left: 12px !important;
  }

  .image-wrapper {
    min-height: 420px;
    margin-bottom: 2rem;
    /* Pastikan kaki yang meluber ke bawah terpotong rapi sesuai radius kotak */
    overflow: hidden;
    border-radius: 48px;
  }

  .character-img {
    /* RESET koordinat top, gunakan bottom agar menempel di garis bawah */
    top: auto !important;
    bottom: 0 !important;
    left: 50%;
    transform: translateX(-50%);

    /* Ukuran tetap proporsional */
    width: 100%;
    height: auto;
    min-height: 100%;
    object-fit: cover;
    object-position: top center;
  }

  .bg-decoration {
    /* Kotak tetap mengikuti ukuran wrapper */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: none; /* Opsional: kotak lurus agar kaki lebih rata */
  }

  .main-title,
  .section-desc {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  .badge-custom {
    display: table;
    margin: 0 auto 20px auto;
  }
}

@media (max-width: 767px) {
  .image-wrapper {
    min-height: 380px; /* Sedikit lebih pendek di HP kecil */
  }
  .character-img {
    /* RESET koordinat top, gunakan bottom agar menempel di garis bawah */
    top: auto !important;
    bottom: 0 !important;
    left: 50%;
    transform: translateX(-50%);

    /* Ukuran tetap proporsional */
    width: 100%;
    height: auto;
    min-height: 50%;
    object-fit: cover;
    object-position: top center;
  }
}

/* IPAD */
@media (min-width: 768px) and (max-width: 1023px) {
  .content-column {
    padding-left: 30px !important; /* Jarak lebih kecil untuk iPad agar muat */
  }
  .col-12.col-md-5 {
    flex: 0 0 40%;
    max-width: 40%;
  }
  .col-12.col-md-7 {
    flex: 0 0 60%;
    max-width: 60%;
  }
  .character-img {
    /* RESET koordinat top, gunakan bottom agar menempel di garis bawah */
    top: auto !important;
    bottom: 0 !important;
    left: 50%;
    transform: translateX(-50%);

    /* Ukuran tetap proporsional */
    width: 100%;
    height: auto;
    min-height: 100%;
    object-fit: cover;
    object-position: top center;
  }
}
</style>
