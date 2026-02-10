<!-- Tentang Edulang - Platform Pendidikan Bahasa Terlengkap -->
<template>
  <section class="tentang-section container">
    <div class="row items-center q-col-gutter-xl">
      <div class="col-12 col-lg-5">
        <h2 class="section-title text-weight-bold q-mb-md">Tentang Edulang</h2>
        <h3 class="subtitle text-weight-bold q-mb-md">Platform Pendidikan Bahasa Terlengkap</h3>
        <p class="section-desc">
          Edulang adalah platform pendidikan bahasa yang membantu siapa saja belajar dengan mudah,
          cepat, dan terjangkau. Dilengkapi AI Speaking Partner, mentor marketplace, dan pathway
          untuk kerja maupun kuliah luar negeri.
        </p>
      </div>
      <div class="col-12 col-lg-7">
        <div class="row q-col-gutter-md">
          <div v-for="(item, i) in items" :key="i" class="col-12 col-sm-6">
            <q-card flat bordered class="feature-card q-pa-lg rounded-borders">
              <div class="feature-icon q-mb-md">
                <q-icon :name="item.icon" size="32px" color="primary" />
              </div>
              <div class="feature-title text-weight-bold q-mb-sm">{{ item.title }}</div>
              <p class="feature-desc">{{ item.desc }}</p>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    icon: 'route',
    title: 'Pembelajaran Terarah',
    desc: 'Kurikulum yang dirancang khusus untuk mencapai tujuan belajar kamu dengan efektif.',
  },
  {
    icon: 'school',
    title: 'Mentor Berpengalaman',
    desc: 'Belajar langsung dari native speaker dan mentor profesional bersertifikat.',
  },
  {
    icon: 'auto_awesome',
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
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.section-title {
  color: var(--edulang-yellow, #ffc42c);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.subtitle {
  color: var(--edulang-navy, #003387);
  font-size: clamp(1.5rem, 3vw, 1.75rem);
}

.section-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.9;
  font-size: 1rem;
  line-height: 1.7;
}

.feature-card {
  height: 100%;
  border-color: #e2e8f0 !important;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(0, 137, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-title {
  color: var(--edulang-navy, #003387);
  font-size: 1.1rem;
}

.feature-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.85;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.rounded-borders {
  border-radius: 16px;
}
</style>
