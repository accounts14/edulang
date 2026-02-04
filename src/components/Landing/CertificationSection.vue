<!-- src/components/landing/CertificationSection.vue -->
<template>
  <section class="cert-section text-white overflow-hidden">
    <div class="container">
      <div class="text-center q-mb-xl">
        <q-chip
          class="cert-chip text-weight-bold"
          label="Earn Your Language Certificate"
        />
        <h2 class="cert-title text-weight-bold q-mt-md">Sertifikasi Resmi Berstandar Global</h2>
      </div>
    </div>

    <div class="scroll-container">
      <div class="scroll-content-left">
        <div
          v-for="(cert, index) in certifications"
          :key="'top-' + index"
          class="cert-card-wrapper"
        >
          <q-card flat class="row no-wrap items-center q-pa-md cert-card">
            <q-img :src="cert.logo" size="40px" class="q-mr-md cert-logo" fit="contain" />
            <div>
              <div class="text-weight-bolder text-dark text-h6">{{ cert.name }}</div>
              <div class="text-caption text-grey-7">{{ cert.desc }}</div>
            </div>
          </q-card>
        </div>
        <div
          v-for="(cert, index) in certifications"
          :key="'top-dup-' + index"
          class="cert-card-wrapper"
        >
          <q-card flat class="row no-wrap items-center q-pa-md cert-card">
            <q-img :src="cert.logo" size="40px" class="q-mr-md cert-logo" fit="contain" />
            <div>
              <div class="text-weight-bolder text-dark text-h6">{{ cert.name }}</div>
              <div class="text-caption text-grey-7">{{ cert.desc }}</div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <div class="scroll-container q-mt-lg">
      <div class="scroll-content-right">
        <div
          v-for="(cert, index) in certifications.slice().reverse()"
          :key="'bot-' + index"
          class="cert-card-wrapper"
        >
          <q-card flat class="row no-wrap items-center q-pa-md cert-card">
            <q-img :src="cert.logo" size="40px" class="q-mr-md cert-logo" fit="contain" />
            <div>
              <div class="text-weight-bolder text-dark text-h6">{{ cert.name }}</div>
              <div class="text-caption text-grey-7">{{ cert.desc }}</div>
            </div>
          </q-card>
        </div>
        <div
          v-for="(cert, index) in certifications.slice().reverse()"
          :key="'bot-dup-' + index"
          class="cert-card-wrapper"
        >
          <q-card flat class="row no-wrap items-center q-pa-md cert-card">
            <q-img :src="cert.logo" size="40px" class="q-mr-md cert-logo" fit="contain" />
            <div>
              <div class="text-weight-bolder text-dark text-h6">{{ cert.name }}</div>
              <div class="text-caption text-grey-7">{{ cert.desc }}</div>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const certifications = [
  {
    name: 'IELTS',
    desc: 'International Certification',
    logo: 'https://www.liblogo.com/img-logo/ie4461j5da-ielts-logo-jpbt-tech.png',
  },
  {
    name: 'TOEFL',
    desc: 'International Certification',
    logo: 'https://live.staticflickr.com/4642/24612532147_c3b8d93bd2_z.jpg',
  },
  {
    name: 'JLPT',
    desc: 'Language Proficiency Exam',
    logo: 'https://picx.zhimg.com/v2-cc64f379c6cacb6fc5439c18ac3137d6_720w.jpg?source=172ae18b',
  },
  {
    name: 'HSK',
    desc: 'Official Language Test',
    logo: 'https://testingcenter.spbu.ru/images/HSK-logo-centered.png',
  },
  {
    name: 'ALPT',
    desc: 'Arabic Proficiency Test',
    logo: 'https://www.arabacademy.com/wp-content/uploads/2020/10/logo_primary.png',
  },
  {
    name: 'TestDaF',
    desc: 'European Certification',
    logo: 'https://kapitel-zwei.de/wp-content/uploads/2022/02/Kapitel-Zwei-TestDaF-Pruefungszentrum.jpg',
  },
]
</script>

<style scoped>
.scroll-container {
  width: 100%;
  overflow: hidden;
  display: flex;
}

.cert-card-wrapper {
  padding: 0 10px;
  flex: 0 0 auto;
}

.cert-section {
  background: var(--edulang-navy, #003387);
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.cert-chip {
  background: var(--edulang-yellow, #FFC42C) !important;
  color: var(--edulang-black, #2D2D2D) !important;
}

.cert-title {
  font-size: clamp(1.35rem, 3vw, 1.5rem);
}

.cert-card {
  width: 320px;
  min-width: 320px;
  border-radius: 16px;
  color: var(--edulang-black);
  background: white;
}

.cert-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.scroll-content-left {
  display: flex;
  animation: scrollLeft 30s linear infinite;
}

@keyframes scrollLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.scroll-content-right {
  display: flex;
  animation: scrollRight 30s linear infinite;
}

@keyframes scrollRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.scroll-container:hover .scroll-content-left,
.scroll-container:hover .scroll-content-right {
  animation-play-state: paused;
}
</style>