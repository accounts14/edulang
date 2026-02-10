<!-- Testimoni Siswa - Cerita Sukses Siswa Edulang (edulang-speak-the-world) -->
<template>
  <section class="testimonial-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <h2 class="section-title text-weight-bold">Testimoni Siswa</h2>
        <h3 class="section-subtitle text-weight-bold">Cerita Sukses Siswa Edulang</h3>
        <p class="section-desc q-mt-sm">
          Ribuan siswa telah mencapai tujuan mereka bersama Edulang. Ini kisah mereka.
        </p>
      </div>
      <div class="row q-col-gutter-lg">
        <div v-for="(t, i) in testimonials" :key="i" class="col-12 col-md-4">
          <q-card flat bordered class="testimonial-card q-pa-lg rounded-borders">
            <q-icon name="format_quote" size="40px" color="grey-4" class="q-mb-md" />
            <p class="testimonial-text q-mb-lg">"{{ t.comment }}"</p>
            <div class="testimonial-badge text-caption text-primary text-weight-bold q-mb-sm">
              {{ t.course }}
            </div>
            <div class="testimonial-name text-weight-bold">{{ t.name }}</div>
            <div class="testimonial-role text-caption text-grey-7">{{ t.role }}</div>
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
    comment:
      'Berkat Edulang, saya berhasil lulus TOPIK Level 5 dalam waktu 8 bulan. Mentor-mentornya sangat sabar dan metode pembelajaran via videonya sangat efektif!',
  },
  {
    name: 'Siti Nurhaliza',
    course: 'Bahasa Mandarin',
    role: 'Content Creator',
    comment:
      'AI Speaking Partner di Edulang membantu saya berlatih Mandarin setiap hari. Sekarang saya bisa berkomunikasi dengan klien dari China dengan lancar.',
  },
  {
    name: 'Ahmad Fadli',
    course: 'Bahasa Jerman',
    role: 'Software Engineer di Jerman',
    comment:
      'Program Bahasa Jerman di Edulang sangat komprehensif. Dalam 1 tahun saya bisa mencapai level B2 dan mendapatkan pekerjaan di Berlin!',
  },
]
</script>

<style scoped>
.testimonial-section {
  padding-top: 3rem;
  padding-bottom: 3rem;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.section-title {
  color: var(--edulang-navy, #003387);
  font-size: clamp(1.5rem, 3vw, 1.75rem);
}

.section-subtitle {
  color: var(--edulang-black, #2d2d2d);
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
}

.section-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.85;
}

.testimonial-card {
  height: 100%;
  border-color: #e2e8f0 !important;
}

.testimonial-text {
  color: var(--edulang-black, #2d2d2d);
  font-size: 0.9375rem;
  line-height: 1.7;
  margin: 0;
}

.testimonial-name {
  color: var(--edulang-navy, #003387);
  font-size: 1rem;
}

.rounded-borders {
  border-radius: 16px;
}
</style>
