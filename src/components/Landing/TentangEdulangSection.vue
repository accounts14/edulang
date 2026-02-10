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

        <div class="col-12 col-md-7">
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
    icon: 'track_changes', // Target/Route icon
    title: 'Pembelajaran Terarah',
    desc: 'Kurikulum yang dirancang khusus untuk mencapai tujuan belajar kamu dengan efektif.',
  },
  {
    icon: 'groups', // Mentor icon
    title: 'Mentor Berpengalaman',
    desc: 'Belajar langsung dari native speaker dan mentor profesional bersertifikat.',
  },
  {
    icon: 'lightbulb', // Innovative icon
    title: 'Metode Inovatif',
    desc: 'Kombinasi video pembelajaran, AI Speaking Partner, dan praktik langsung.',
  },
  {
    icon: 'public', // Global icon
    title: 'Peluang Global',
    desc: 'Pathway untuk kerja dan kuliah di luar negeri dengan bimbingan penuh.',
  },
]
</script>

<style scoped>
.tentang-section {
  padding: 80px 0;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Badge Style */
.badge-custom {
  display: inline-block;
  padding: 6px 18px;
  background-color: #fff8e6;
  color: #8a6d3b;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
}

/* Title & Text */
.main-title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  color: #1a1a1a;
}

.section-desc {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 600px;
}

/* Image & Decoration */
.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bg-decoration {
  position: absolute;
  width: 110%;
  height: 90%;
  background: #f0f7ff;
  border-radius: 40px;
  z-index: -1;
  transform: rotate(-2deg);
}

.character-img {
  width: 100%;
  max-width: 450px;
}

/* Feature Cards */
.feature-card {
  border-radius: 20px;
  border: 1px solid #edf2f7 !important;
  height: 100%;
  transition: transform 0.3s ease;
}

.icon-box {
  width: 48px;
  height: 48px;
  background-color: #0056b3; /* Biru sesuai logo */
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-title {
  font-size: 1.15rem;
  color: #1a1a1a;
}

.feature-desc {
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Responsive adjustment */
@media (max-width: 1023px) {
  .main-title {
    text-align: center;
  }
  .section-desc {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  .badge-custom {
    display: table;
    margin: 0 auto 16px auto;
  }
  .bg-decoration {
    width: 80%;
  }
}
</style>
