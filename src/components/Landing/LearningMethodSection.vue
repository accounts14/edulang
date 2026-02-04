<!-- src/components/landing/LearningMethodSection.vue -->
<template>
  <section class="method-section container">
    <div class="text-center section-header q-mb-xl">
      <h2 class="section-title text-weight-bold q-mb-md">
        Lebih Dari Sekadar Nonton Video
      </h2>
      <p class="section-desc">
        Kami memastikan setiap menit belajar Anda terkonversi menjadi output nyata untuk masa
        depan.
      </p>
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="method-card q-pa-lg full-height rounded-borders-16">
          <q-avatar
            class="q-mb-lg method-icon"
            icon="play_arrow"
            size="48px"
          />
          <div class="card-title text-weight-bold q-mb-sm">Interactive Course</div>
          <p class="card-desc">
            Materi video berkualitas tinggi yang dirancang agar mudah dipahami, dilengkapi quiz
            interaktif di setiap sesi.
          </p>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="method-card method-card-accent q-pa-lg full-height rounded-borders-16">
          <q-avatar
            class="q-mb-lg method-icon accent-icon"
            icon="translate"
            size="48px"
          />
          <div class="card-title-1 text-weight-bold q-mb-sm">Real Assessment</div>
          <p class="card-desc accent-desc">
            Bukan cuma nonton. Ikuti tes simulasi (HSK, TOEFL, JLPT) untuk mengukur kemampuan riil
            kamu sebelum tes asli.
          </p>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="method-card q-pa-lg full-height rounded-borders-16">
          <q-avatar
            class="q-mb-lg method-icon method-icon-yellow"
            icon="flight"
            size="48px"
          />
          <div class="card-title text-weight-bold q-mb-sm">Career & Study Path</div>
          <p class="card-desc">
            Output pembelajaran diarahkan langsung untuk persiapan kerja atau kuliah ke China,
            Jepang, Jerman, dll.
          </p>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.method-section {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

@media (min-width: 1024px) {
  .method-section {
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
  }
}

.section-title {
  color: var(--edulang-navy);
  font-size: clamp(1.35rem, 3vw, 1.5rem);
}

.section-desc {
  color: var(--edulang-black);
  opacity: 0.8;
  font-size: 1rem;
  font-weight: 400;
}

.card-title {
  color: var(--edulang-black);
  font-size: 1.1rem;
}

.card-title-1 {
  color: var(--edulang-white);
  font-size: 1.1rem;
}

.card-desc {
  color: var(--edulang-black);
  opacity: 0.8;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.6;
}

.method-icon {
  background: rgba(0, 137, 255, 0.12) !important;
  color: var(--edulang-blue) !important;
}

.method-icon-yellow {
  background: rgba(255, 196, 44, 0.2) !important;
  color: var(--edulang-yellow) !important;
}

.method-card-accent {
  background: var(--edulang-navy) !important;
}

.accent-icon {
  background: rgba(255, 255, 255, 0.2) !important;
  color: var(--edulang-yellow) !important;
}

.accent-desc {
  color: rgba(255, 255, 255, 0.9) !important;
  opacity: 1;
}
</style>