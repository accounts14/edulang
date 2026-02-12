<template>
  <section class="penghargaan-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <div class="badge-top-container q-mb-md">
          <span class="badge-top">Penghargaan</span>
        </div>
        <h2 class="section-subtitle text-weight-bold">
          Pencapaian yang <span class="text-navy">Membanggakan</span>
        </h2>
        <p class="section-desc">
          Berbagai penghargaan yang kami terima menjadi bukti komitmen kami dalam memberikan
          pendidikan terbaik.
        </p>
      </div>

      <div class="row q-col-gutter-lg justify-center">
        <div v-for="(award, i) in awards" :key="i" class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered class="award-card q-pa-xl text-center">
            <div class="icon-box-wrapper q-mb-lg">
              <div class="icon-box">
                <q-icon :name="award.icon" size="30px" color="white" />
              </div>
            </div>

            <div class="award-content">
              <h4 class="award-title text-weight-bold q-mb-xs">{{ award.title }}</h4>
              <p class="award-source text-grey-7 q-mb-md">{{ award.source }}</p>
            </div>

            <div class="year-badge-container">
              <div class="year-badge">{{ award.year }}</div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const awards = [
  {
    icon: 'emoji_events',
    title: 'Best EdTech Startup 2024',
    source: 'Indonesia Startup Awards',
    year: '2024',
  },
  {
    icon: 'workspace_premium',
    title: 'Top 10 Language Learning Platform',
    source: 'Asia Pacific Education Awards',
    year: '2024',
  },
  {
    icon: 'military_tech',
    title: 'Most Innovative Learning Solution',
    source: 'Digital Innovation Awards',
    year: '2023',
  },
  {
    icon: 'star_outline',
    title: 'Customer Choice Award',
    source: 'Indonesia Customer Awards',
    year: '2023',
  },
]
</script>

<style scoped>
.penghargaan-section {
  padding: 100px 0;
  background-color: #ffffff;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 1. TOP BADGE */
.badge-top {
  background-color: #fff9e6; /* Warna kuning cream sangat muda */
  color: #8a6d3b; /* Warna cokelat keemasan */
  padding: 6px 20px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
}

/* 2. TYPOGRAPHY */
.section-subtitle {
  color: #1a1a1a;
  font-size: 42px; /* Sesuai ukuran besar di gambar */
  line-height: 1.2;
  margin-top: 0;
  margin-bottom: 12px;
}

.text-navy {
  color: #003387; /* Navy Blue khas Edulang */
}

.section-desc {
  color: #64748b;
  font-size: 18px;
  max-width: 750px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 3. AWARD CARD */
.award-card {
  border-radius: 20px; /* Sudut membulat sedang */
  border: 1.5px solid #f1f5f9 !important; /* Border sangat tipis & terang */
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.02); /* Shadow sangat halus */
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.award-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

/* 4. ICON BOX */
.icon-box {
  width: 60px;
  height: 60px;
  background-color: #0052cc; /* Biru cerah sesuai gambar */
  border-radius: 14px; /* Sudut membulat untuk kotak ikon */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

/* 5. CARD TEXT */
.award-title {
  font-size: 17px;
  color: #1a1a1a;
  line-height: 1.4;
  margin: 0;
}

.award-source {
  font-size: 14px;
  margin: 4px 0 0 0;
}

/* 6. YEAR BADGE */
.year-badge {
  display: inline-block;
  background-color: #fff9e6;
  color: #a6894b;
  padding: 4px 22px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 700;
}

/* RESPONSIVE FIXES */
@media (max-width: 1024px) {
  .section-subtitle {
    font-size: 32px;
  }
  .award-card {
    padding: 30px 15px !important;
  }
}
</style>
