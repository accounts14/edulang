<template>
  <section class="testimonial-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <div class="badge-testi q-mb-md">Testimoni Siswa</div>
        <h2 class="section-title text-weight-bold no-margin">
          Cerita Sukses <span class="text-primary">Siswa Edulang</span>
        </h2>
        <p class="section-desc q-mt-md">
          Ribuan siswa telah mencapai tujuan mereka bersama Edulang. Ini kisah mereka.
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div v-for="(t, i) in testimonials" :key="i" class="col-12 col-md-4">
          <q-card
            flat
            bordered
            class="testimonial-card relative-position rounded-card overflow-visible"
          >
            <div class="quote-icon-wrapper flex flex-center">
              <q-icon name="format_quote" size="24px" color="white" />
            </div>

            <q-card-section class="q-pa-xl">
              <div class="rating-stars q-mb-md">
                <q-icon v-for="n in 5" :key="n" name="star" color="orange-5" size="22px" />
              </div>

              <p class="testimonial-text q-mb-lg">"{{ t.comment }}"</p>

              <div class="q-mb-xl">
                <span class="language-badge">{{ t.course }}</span>
              </div>

              <q-separator color="grey-2" class="q-mb-lg" />

              <div class="row items-center no-wrap">
                <q-avatar size="48px" class="q-mr-md">
                  <img :src="t.image" :alt="t.name" />
                </q-avatar>
                <div>
                  <div class="testimonial-name text-weight-bold">{{ t.name }}</div>
                  <div class="testimonial-role">{{ t.role }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    name: 'Rizky Pratama',
    course: 'Bahasa Korea',
    role: 'Mahasiswa S2 di Korea',
    image: 'https://cdn.quasar.dev/img/avatar2.jpg', // Ganti dengan path lokal Anda
    comment:
      'Berkat Edulang, saya berhasil lulus TOPIK Level 5 dalam waktu 8 bulan. Mentor-mentornya sangat sabar dan metode pembelajaran via videonya sangat efektif!',
  },
  {
    name: 'Siti Nurhaliza',
    course: 'Bahasa Mandarin',
    role: 'Content Creator',
    image: 'https://cdn.quasar.dev/img/avatar3.jpg',
    comment:
      'Materi yang komprehensif di Edulang membantu saya berlatih Mandarin setiap hari. Sekarang saya bisa berkomunikasi dengan klien dari China dengan lancar.',
  },
  {
    name: 'Ahmad Fadli',
    course: 'Bahasa Jerman',
    role: 'Software Engineer di Jerman',
    image: 'https://cdn.quasar.dev/img/avatar4.jpg',
    comment:
      'Program Bahasa Jerman di Edulang sangat komprehensif. Dalam 1 tahun saya bisa mencapai level B2 dan mendapatkan pekerjaan di Berlin!',
  },
]
</script>

<style scoped>
.testimonial-section {
  padding: 80px 0;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Badge Header */
.badge-testi {
  display: inline-block;
  padding: 6px 18px;
  background-color: #fff7ed;
  color: #f59e0b;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
}

.section-title {
  color: #002d72;
  font-size: clamp(2rem, 4vw, 2.5rem);
}

.section-desc {
  color: #64748b;
  font-size: 1.1rem;
}

/* Card Styling */
.rounded-card {
  border-radius: 20px;
  border: 1px solid #f1f5f9 !important;
}

.testimonial-card {
  height: 100%;
  transition: all 0.3s ease;
  background: white;
}

.testimonial-card:hover {
  box-shadow: 0 20px 40px rgba(0, 45, 114, 0.05);
  transform: translateY(-5px);
}

/* Quote Icon position */
.quote-icon-wrapper {
  position: absolute;
  top: -20px;
  left: 30px;
  width: 40px;
  height: 40px;
  background-color: #0089ff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 137, 255, 0.3);
  z-index: 2;
}

.testimonial-text {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  font-style: italic;
}

/* Pill Badge Bahasa */
.language-badge {
  background: #eff6ff;
  color: #3b82f6;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
}

.testimonial-name {
  color: #1e293b;
  font-size: 1rem;
  line-height: 1.2;
}

.testimonial-role {
  color: #94a3b8;
  font-size: 13px;
}

/* Responsive adjustment */
@media (max-width: 1023px) {
  .section-header {
    margin-bottom: 50px;
  }
}
</style>
