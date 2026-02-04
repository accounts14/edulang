<!-- src/components/landing/LearningPathSection.vue -->
<template>
  <section class="path-section container">
    <div class="section-header q-mb-xl">
      <div class="path-tag text-weight-bold">Panduan Belajar Bahasa</div>
      <h2 class="path-title text-weight-bold q-mt-xs">Langkah Belajar Kamu</h2>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3" v-for="(step, index) in learningSteps" :key="index">
        <q-card flat class="step-card q-pa-md rounded-borders-16 relative-position">
          <div class="row items-center no-wrap">
            <q-img src="~assets/step-icon.png" class="step-icon" />
            <div class="q-ml-md">
              <div class="step-label text-weight-bold">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
            <q-space />
            <q-icon name="chevron_right" class="step-arrow" size="sm" />
          </div>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup>
const learningSteps = [
  { title: 'Learn Basics', desc: 'fondasi, awal belajar' },
  { title: 'Learn Basics', desc: 'fondasi, awal belajar' },
  { title: 'Learn Basics', desc: 'fondasi, awal belajar' },
  { title: 'Learn Basics', desc: 'fondasi, awal belajar' },
]
</script>

<style scoped>
.path-section {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.path-tag {
  color: var(--edulang-yellow);
  font-size: 0.9375rem;
}

.path-title {
  color: var(--edulang-black);
  font-size: clamp(1.35rem, 3vw, 1.5rem);
}

.step-card {
  background: var(--edulang-white);
  border: 1px solid rgba(0, 51, 135, 0.08);
}

.step-icon {
  width: 52px;
  height: 52px;
}

.step-label {
  color: var(--edulang-navy);
  font-size: 1rem;
}

.step-desc {
  color: var(--edulang-black);
  opacity: 0.75;
  font-size: 0.8125rem;
  font-weight: 400;
}

.step-arrow {
  color: rgba(45, 45, 45, 0.4);
}
</style>