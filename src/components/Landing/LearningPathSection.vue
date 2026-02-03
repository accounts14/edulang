<!-- src/components/landing/LearningPathSection.vue -->
<template>
  <section class="container q-py-xl">
    <div class="q-mb-xl">
      <div class="text-warning text-weight-bold">Panduan Belajar Bahasa</div>
      <h2 class="text-h4 text-weight-bold text-dark q-mt-xs">Langkah Belajar Kamu</h2>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-6 col-md-3" v-for="(step, index) in learningSteps" :key="index">
        <q-card flat class="step-card q-pa-md rounded-borders-16 shadow-1 relative-position">
          <div class="row items-center no-wrap">
            <q-img src="~assets/step-icon.png" style="width: 60px; height: 60px" />
            <div class="q-ml-md">
              <div class="text-subtitle1 text-weight-bold text-primary">{{ step.title }}</div>
              <div class="text-caption text-grey-7">{{ step.desc }}</div>
            </div>
            <q-space />
            <q-icon name="chevron_right" color="grey-5" size="sm" />
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