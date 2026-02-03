<!-- src/components/landing/TestimonialSection.vue -->
<template>
  <section class="bg-primary text-white q-py-xl overflow-hidden" style="min-height: 600px; display: flex; align-items: center;">
    <div class="container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-5">
          <div class="text-warning text-weight-bold q-mb-sm">
            500k Orang Sudah Melaju. Kamu Kapan?
          </div>
          <h2 class="text-h3 text-weight-bold q-mb-md" style="line-height: 1.2">
            Temukan Standar Baru dalam Berkarier
          </h2>
          <p class="text-white opacity-80 q-mb-xl text-body1">
            Bergabunglah dengan ekosistem belajar yang menjembatani ambisi Anda menuju karier di kancah global.
          </p>
          <div class="q-gutter-md">
            <q-btn unelevated rounded color="warning" text-color="dark" label="Alur Belajar" class="q-px-xl q-py-md text-weight-bold" />
            <q-btn outline rounded color="white" label="Update Student" class="q-px-xl q-py-md text-weight-bold" />
          </div>
        </div>

        <div class="col-12 col-md-7">
          <div class="testimonial-grid-wrapper">
            <div class="marquee-column">
              <div class="marquee-vertical down">
                <div v-for="n in 2" :key="'group1-'+n" class="marquee-content">
                  <q-card v-for="(testi, i) in testimonials.slice(0, 3)" :key="i" class="q-mb-lg testimonial-card">
                    <q-card-section class="q-pa-lg">
                      <div class="row items-center no-wrap q-mb-md">
                        <q-avatar size="45px" class="q-mr-md">
                          <img :src="testi.avatar" />
                        </q-avatar>
                        <div class="column">
                          <span class="text-weight-bold text-dark text-subtitle1">{{ testi.name }}</span>
                          <q-badge color="blue-1" text-color="primary" class="q-py-xs q-px-sm text-weight-bold">
                            {{ testi.course }}
                          </q-badge>
                        </div>
                      </div>
                      <div class="text-weight-bold text-dark q-mb-xs">{{ testi.title }}</div>
                      <div class="text-body2 text-grey-8 line-height-1-5">{{ testi.comment }}</div>
                      <q-rating :model-value="5" readonly size="16px" color="orange" class="q-mt-md" />
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>

            <div class="marquee-column">
              <div class="marquee-vertical up">
                <div v-for="n in 2" :key="'group2-'+n" class="marquee-content">
                  <q-card v-for="(testi, i) in testimonials.slice(3, 6)" :key="i" class="q-mb-lg testimonial-card">
                    <q-card-section class="q-pa-lg">
                      <div class="row items-center no-wrap q-mb-md">
                        <q-avatar size="45px" class="q-mr-md">
                          <img :src="testi.avatar" />
                        </q-avatar>
                        <div class="column">
                          <span class="text-weight-bold text-dark text-subtitle1">{{ testi.name }}</span>
                          <q-badge color="blue-1" text-color="primary" class="q-py-xs q-px-sm text-weight-bold">
                            {{ testi.course }}
                          </q-badge>
                        </div>
                      </div>
                      <div class="text-weight-bold text-dark q-mb-xs">{{ testi.title }}</div>
                      <div class="text-body2 text-grey-8 line-height-1-5">{{ testi.comment }}</div>
                      <q-rating :model-value="5" readonly size="16px" color="orange" class="q-mt-md" />
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  { name: 'Satrial lip', course: 'Japan Course', title: 'Comprehensive Materials', comment: 'Active Mandarin Indonesia provides a premium learning experience with advanced audio-visual support.', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
  { name: 'Susanty', course: 'Chinese Course', title: 'Easy to understand', comment: 'Great learning experience with patient teachers, starting from the basics!', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
  { name: 'Asyrofuddin', course: 'English Course', title: 'High Quality Tutors', comment: 'I am very satisfied learning here because the tutors are friendly and communicative.', avatar: 'https://cdn.quasar.dev/img/avatar3.jpg' },
  { name: 'Rina Wijaya', course: 'Germany Course', title: 'Best Experience', comment: 'Kurikulumnya sangat dinamis dan selalu update dengan kebutuhan industri.', avatar: 'https://cdn.quasar.dev/img/avatar4.jpg' },
  { name: 'Budi Santoso', course: 'TOEFL Prep', title: 'Highly Recommended', comment: 'Materi pembelajarannya terstruktur dan sangat membantu persiapan tes saya.', avatar: 'https://cdn.quasar.dev/img/avatar5.jpg' },
  { name: 'Lia Amina', course: 'IELTS Prep', title: 'Excellent Support', comment: 'Dukungan mentor sangat luar biasa dalam membimbing setiap progres saya.', avatar: 'https://cdn.quasar.dev/img/avatar6.jpg' }
]
</script>

<style scoped>
.bg-primary {
  background-color: #003366 !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.testimonial-grid-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  height: 600px;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
}

.marquee-column {
  position: relative;
  height: 100%;
}

.marquee-vertical {
  display: flex;
  flex-direction: column;
}

.marquee-content {
  flex-shrink: 0;
}

.down {
  animation: scrollDown 30s linear infinite;
}

.up {
  animation: scrollUp 30s linear infinite;
}

@keyframes scrollDown {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}

@keyframes scrollUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

.testimonial-card {
  border-radius: 16px;
  background: white;
  border: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}

.line-height-1-5 {
  line-height: 1.5;
}

.opacity-80 {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .testimonial-grid-wrapper {
    grid-template-columns: 1fr;
    height: 400px;
  }
}
</style>