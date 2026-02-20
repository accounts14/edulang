<template>
  <div class="story-container">
    <!-- Header -->
    <div class="story-header">
      <h1 class="story-title">The Story Behind Edulang</h1>
      <p class="story-subtitle">
        Perjalanan dari Active Mandarin Indonesia menuju Education & Language Ecosystem berbasis
        teknologi dan Menjadi Edulang
      </p>
      <p class="story-tagline">#UnlockTheWorldWithEducation</p>
    </div>

    <!-- Timeline Navigation -->
    <div class="timeline-nav">
      <button
        v-for="year in years"
        :key="year"
        :class="['year-btn', { active: activeYear === year }]"
        @click="scrollToYear(year)"
      >
        {{ year }}
      </button>
    </div>

    <!-- Main Timeline Container -->
    <div class="timeline-wrapper">
      <div class="timeline-track">
        <!-- Vertical Line -->
        <div class="timeline-line"></div>

        <!-- Timeline Items -->
        <div
          v-for="(item, index) in timelineData"
          :key="item.year"
          :ref="`year-${item.year}`"
          :class="['timeline-item', { active: activeYear === item.year }]"
        >
          <!-- Left Side (Odd years) -->
          <div v-if="index % 2 === 0" class="timeline-content left">
            <div class="content-card">
              <div class="card-image">
                <img :src="item.image" :alt="item.title" />
              </div>
              <div class="year-badge">{{ item.year }}</div>
              <h3 class="content-title">{{ item.title }}</h3>
              <p class="content-text">{{ item.description }}</p>
              <div v-if="item.highlights" class="highlights">
                <span v-for="(highlight, i) in item.highlights" :key="i" class="highlight-tag">
                  {{ highlight }}
                </span>
              </div>
            </div>
          </div>

          <!-- Center Dot -->
          <div class="timeline-dot">
            <div class="dot-inner"></div>
          </div>

          <!-- Right Side (Even years) -->
          <div v-if="index % 2 === 1" class="timeline-content right">
            <div class="content-card">
              <div class="card-image">
                <img :src="item.image" :alt="item.title" />
              </div>
              <div class="year-badge">{{ item.year }}</div>
              <h3 class="content-title">{{ item.title }}</h3>
              <p class="content-text">{{ item.description }}</p>
              <div v-if="item.highlights" class="highlights">
                <span v-for="(highlight, i) in item.highlights" :key="i" class="highlight-tag">
                  {{ highlight }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div v-if="!isAtBottom" class="scroll-indicator">
      <span>Scroll untuk lanjut</span>
      <svg class="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          d="M12 5v14M19 12l-7 7-7-7"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryBehind',
  data() {
    return {
      activeYear: 2019,
      isAtBottom: false,
      timelineData: [
        {
          year: 2019,
          title: 'Sebuah Awal dari Prestasi',
          description:
            'Perjalanan ini dimulai dari kecintaan terhadap bahasa. Keikutsertaan dalam kompetisi bahasa Mandarin tingkat internasional menjadi titik awal lahirnya visi besar: bahwa bahasa membuka akses menuju dunia global. Dari pengalaman inilah tumbuh keyakinan untuk membangun sesuatu yang lebih dari sekadar kelas bahasa.',
          highlights: ['Kompetisi Bahasa Mandarin', 'Visi Global', 'Prestasi Internasional'],
          image:
            'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/3dd57265-b015-4177-a443-89aa6a99ddc3.jpg ',
        },
        {
          year: 2020,
          title: 'Menyadari Pentingnya Integritas',
          description:
            'Interaksi dengan komunitas pelajar Indonesia di Tiongkok membuka realitas tentang berbagai tantangan pendidikan internasional, termasuk praktik agen yang tidak transparan. Di titik ini, lahir satu prinsip utama: Pendidikan harus dibangun dengan kejujuran, tanggung jawab, dan sistem yang jelas.',
          highlights: ['Transparansi', 'Integritas', 'Sistem Jelas'],
          image:
            'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/a010bd52-9aea-4fa2-8ddb-e8bec39fab8c.jpg ',
        },
        {
          year: 2021,
          title: 'Lahirnya Active Mandarin Indonesia',
          description:
            'Pandemi membawa perubahan besar. Dari sebuah kelas daring sederhana, Active Mandarin Indonesia lahir sebagai ruang belajar yang aktif dan bertumbuh. Yang awalnya hanya kelas kecil, berkembang menjadi komunitas dengan kurikulum dan sistem pembelajaran yang lebih terstruktur.',
          highlights: ['Kelas Daring', 'Komunitas', 'Kurikulum Terstruktur'],
          image:
            'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/5a50d0d5-9863-4ae3-ab91-48100c6154fd.jpg ',
        },
        {
          year: 2022,
          title: 'Transformasi Menuju Edutech',
          description:
            'Active Mandarin mulai memasuki ekosistem startup dan mengembangkan sistem pembelajaran berbasis teknologi. Video course, sertifikat digital, dan evaluasi berbasis sistem mulai dirancang. Bahasa tidak lagi hanya diajarkan, tetapi dibangun dalam bentuk platform.',
          highlights: ['Video Course', 'Sertifikat Digital', 'Platform Teknologi'],
          image:
            'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/30ecff1b-1ef5-4993-b7c2-5f87a050fc2c.jpg ',
        },
        {
          year: 2023,
          title: 'Membuka Akses Global',
          description:
            'Fokus mulai diperluas. Kerja sama dengan perusahaan dan beberapa kampus di Tiongkok mulai terjalin. Active Mandarin tidak hanya menjadi tempat belajar bahasa, tetapi juga menjadi penghubung menuju program studi, internship, dan jalur karier internasional. Bahasa menjadi pintu masuk menuju peluang global.',
          highlights: ['Kerja Sama Global', 'Internship', 'Karier Internasional'],
          image:
            'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/a995079f-4d16-4f26-9e22-bce45cebb75e.jpg ',
        },
        {
          year: 2024,
          title: 'Evaluasi, Keberanian, dan Penyederhanaan Arah',
          description:
            'Kepercayaan investor datang sebagai peluang percepatan pertumbuhan. Namun melalui evaluasi internal, diputuskan untuk mengembalikan pendanaan demi memperkuat fondasi dan kesiapan jangka panjang. Eksplorasi brand baru dilakukan melalui Edutive sebagai langkah ekspansi. Dari fase ini lahir satu kesimpulan penting: Pertumbuhan harus terarah, bukan terburu-buru.',
          highlights: ['Evaluasi Strategis', 'Fondasi Kuat', 'Pertumbuhan Terukur'],
          image:
            'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/69947ee4-2bcc-497e-a15f-2224753b72d5.jpeg ',
        },
        {
          year: 2025,
          title: 'Konsolidasi dan Legalitas',
          description:
            'PT Active Edulang Global didirikan sebagai bentuk komitmen terhadap tata kelola yang lebih matang. Kerja sama dengan perusahaan dan kampus di Tiongkok diperkuat. Struktur organisasi dan sistem operasional dibangun lebih solid. Ini adalah fase membangun fondasi yang siap untuk skala lebih besar.',
          highlights: ['PT Active Edulang Global', 'Tata Kelola Matang', 'Fondasi Solid'],
          image:
            'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/03d9982c-6835-4ec7-b12f-15915d152efc.jpeg ',
        },
        {
          year: 2026,
          title: 'Rebranding Menjadi EDULANG',
          description:
            'Seluruh perjalanan disatukan dalam satu identitas baru: EDULANG — Education & Language. Rebranding ini menandai perubahan arah yang lebih luas dan terintegrasi. Edulang berdiri di atas tiga pilar utama: Language Video Course, Study Abroad Ecosystem, dan Global Career Pathway. Dengan integrasi AI dalam sistem pembelajaran, evaluasi, dan sertifikasi, Edulang hadir sebagai ekosistem pendidikan modern yang menghubungkan bahasa, teknologi, dan peluang global.',
          highlights: ['Language Video Course', 'Study Abroad', 'Global Career', 'AI Integration'],
          image:
            'https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/4f7efdd0-1378-4d45-afaf-b49d0a4c443f.png ',
        },
      ],
    }
  },
  computed: {
    years() {
      return this.timelineData.map((item) => item.year)
    },
  },
  methods: {
    scrollToYear(year) {
      this.activeYear = year
      const element = this.$refs[`year-${year}`]
      if (element && element[0]) {
        element[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    },
    handleScroll() {
      // Detect which year is in view
      const items = document.querySelectorAll('.timeline-item')
      let closestYear = this.activeYear
      let closestDistance = Infinity

      items.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const distance = Math.abs(rect.top - window.innerHeight / 2)
        if (distance < closestDistance) {
          closestDistance = distance
          const yearText = item.querySelector('.year-badge')?.textContent
          if (yearText) {
            closestYear = parseInt(yearText)
          }
        }
      })

      this.activeYear = closestYear

      // Check if at bottom
      this.isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.story-container {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
}

/* Header */
.story-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInDown 0.8s ease-out;
}

.story-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  color: #003387;
  margin-bottom: 16px;
  font-family: 'Outfit', sans-serif;
}

.story-subtitle {
  font-size: clamp(16px, 2.2vw, 20px);
  color: #2d2d2d;
  margin-bottom: 8px;
  line-height: 1.6;
}

.story-tagline {
  font-size: 16px;
  color: #0089ff;
  font-weight: 600;
}

/* Timeline Navigation */
.timeline-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 60px;
  padding: 0 10px;
}

.year-btn {
  padding: 12px 20px;
  border: 2px solid #0089ff;
  background: white;
  color: #0089ff;
  border-radius: 25px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.year-btn:hover {
  background: #0089ff;
  color: white;
  transform: translateY(-2px);
}

.year-btn.active {
  background: #003387;
  border-color: #003387;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 51, 135, 0.3);
}

/* Timeline Wrapper */
.timeline-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: hidden;
}

.timeline-track {
  position: relative;
  padding: 40px 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #003387 0%, #0089ff 50%, #ffc42c 100%);
  transform: translateX(-50%);
}

/* Timeline Items */
.timeline-item {
  display: flex;
  margin-bottom: 80px;
  opacity: 0.6;
  transition: all 0.4s ease;
}

.timeline-item.active {
  opacity: 1;
}

.timeline-content {
  width: 50%;
  display: flex;
  padding: 0 40px;
}

.timeline-content.left {
  justify-content: flex-end;
}

.timeline-content.right {
  justify-content: flex-start;
  margin-left: 50%;
}

.content-card {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #0089ff;
  max-width: 520px;
  overflow: hidden;
}

.timeline-item.active .content-card {
  box-shadow: 0 8px 24px rgba(0, 51, 135, 0.15);
  transform: translateY(-4px);
  border-left-color: #ffc42c;
}

/* Card Image */
.card-image {
  width: calc(100% + 64px);
  height: 240px;
  margin: -32px -32px 20px -32px;
  overflow: hidden;
  border-radius: 16px 16px 0 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.content-card:hover .card-image img {
  transform: scale(1.05);
}

.year-badge {
  display: inline-block;
  background: #003387;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 16px;
}

.content-title {
  font-size: 22px;
  font-weight: 700;
  color: #003387;
  margin-bottom: 16px;
  line-height: 1.4;
}

.content-text {
  font-size: 16px;
  color: #2d2d2d;
  line-height: 1.7;
  margin-bottom: 20px;
}

.highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.highlight-tag {
  display: inline-block;
  background: #f0f4ff;
  color: #0089ff;
  padding: 8px 14px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
}

.timeline-item.active .highlight-tag {
  background: #fff3cd;
  color: #ffc42c;
}

/* Timeline Dot */
.timeline-dot {
  position: absolute;
  left: 50%;
  top: 40px;
  width: 24px;
  height: 24px;
  background: white;
  border: 4px solid #0089ff;
  border-radius: 50%;
  transform: translateX(-50%);
  z-index: 10;
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-dot {
  width: 32px;
  height: 32px;
  border-color: #ffc42c;
  top: 36px;
  box-shadow: 0 0 0 10px rgba(255, 196, 44, 0.2);
}

.dot-inner {
  width: 100%;
  height: 100%;
  background: #0089ff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.timeline-item.active .dot-inner {
  background: #ffc42c;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

/* Scroll Indicator */
.scroll-indicator {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #0089ff;
  font-size: 14px;
  font-weight: 600;
  animation: bounce 2s infinite;
  z-index: 100;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
  animation: slideDown 1.5s infinite;
}

@keyframes bounce {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes slideDown {
  0% {
    transform: translateY(-8px);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(8px);
    opacity: 0;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tablet Responsive */
@media (max-width: 768px) {
  .story-container {
    padding: 30px 16px;
  }

  .story-header {
    margin-bottom: 40px;
  }

  .story-title {
    font-size: 32px;
  }

  .timeline-nav {
    gap: 8px;
    margin-bottom: 40px;
  }

  .year-btn {
    padding: 10px 14px;
    font-size: 13px;
  }

  .timeline-track {
    padding: 30px 0;
  }

  .timeline-line {
    left: 30px;
  }

  .timeline-item {
    margin-bottom: 50px;
  }

  .timeline-content {
    width: 100%;
    padding: 0 0 0 80px;
  }

  .timeline-content.left,
  .timeline-content.right {
    justify-content: flex-start;
    margin-left: 0;
  }

  .content-card {
    max-width: 100%;
    padding: 24px;
  }

  .card-image {
    width: calc(100% + 48px);
    height: 200px;
    margin: -24px -24px 16px -24px;
  }

  .timeline-dot {
    left: 30px;
    top: 20px;
  }

  .timeline-item.active .timeline-dot {
    top: 16px;
  }

  .content-title {
    font-size: 18px;
  }

  .content-text {
    font-size: 14px;
  }
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .story-container {
    padding: 20px 12px;
  }

  .story-header {
    margin-bottom: 30px;
  }

  .story-title {
    font-size: 26px;
  }

  .story-subtitle {
    font-size: 14px;
  }

  .timeline-nav {
    gap: 6px;
    margin-bottom: 30px;
  }

  .year-btn {
    padding: 8px 12px;
    font-size: 12px;
  }

  .timeline-track {
    padding: 20px 0;
  }

  .timeline-line {
    left: 20px;
  }

  .timeline-item {
    margin-bottom: 40px;
  }

  .timeline-content {
    padding: 0 0 0 60px;
  }

  .content-card {
    padding: 20px;
    border-radius: 12px;
  }

  .card-image {
    width: calc(100% + 40px);
    height: 160px;
    margin: -20px -20px 14px -20px;
    border-radius: 12px 12px 0 0;
  }

  .year-badge {
    font-size: 12px;
    padding: 6px 10px;
  }

  .content-title {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .content-text {
    font-size: 13px;
    margin-bottom: 14px;
  }

  .highlight-tag {
    font-size: 11px;
    padding: 5px 10px;
  }

  .timeline-dot {
    left: 20px;
    width: 18px;
    height: 18px;
    border-width: 3px;
    top: 16px;
  }

  .timeline-item.active .timeline-dot {
    width: 24px;
    height: 24px;
    top: 13px;
  }

  .scroll-indicator {
    bottom: 30px;
    font-size: 12px;
  }

  .scroll-arrow {
    width: 20px;
    height: 20px;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .story-title {
    font-size: 22px;
  }

  .story-subtitle {
    font-size: 13px;
  }

  .timeline-line {
    left: 16px;
  }

  .timeline-content {
    padding: 0 0 0 50px;
  }

  .timeline-dot {
    left: 16px;
  }

  .content-card {
    padding: 16px;
  }

  .card-image {
    width: calc(100% + 32px);
    height: 140px;
    margin: -16px -16px 12px -16px;
  }

  .content-title {
    font-size: 15px;
  }

  .content-text {
    font-size: 12px;
  }
}
</style>
