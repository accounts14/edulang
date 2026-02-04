<!-- src/components/landing/SolutionsSection.vue -->
<template>
  <section class="solutions-section container">
    <div class="row items-center q-col-gutter-xl">
      <div class="col-12 col-md-6">
        <div class="solutions-tag text-weight-bold q-mb-sm">Eksklusif Untukmu</div>
        <h2 class="solutions-title text-weight-bold q-mb-md">Solusi Tepat Belajar Bahasa</h2>
        <p class="solutions-desc q-mb-lg">Kuasai bahasa, buka pintu karier lebih lebar</p>

        <q-list class="q-mb-xl">
          <q-item v-for="(benefit, index) in solutions" :key="index" dense class="q-px-none">
            <q-item-section avatar>
              <q-icon name="check_circle" class="check-icon" />
            </q-item-section>
            <q-item-section class="solutions-item text-weight-medium">
              {{ benefit }}
            </q-item-section>
          </q-item>
        </q-list>

        <div class="q-gutter-md">
          <q-btn unelevated rounded class="btn-primary q-px-lg" label="Apply Now" />
          <q-btn outline rounded class="btn-outline q-px-lg" label="How It Works" />
        </div>
      </div>

      <div class="col-12 col-md-6 flex flex-center relative-position">
        <q-img src="~assets/Solusi.png" class="solutions-img" />
      </div>
    </div>
  </section>
</template>

<script setup>
const solutions = [
  'Bimbingan Langsung dari Ahlinya',
  'Akses Materi Terupdate Selamanya',
  'Kurikulum dinamis yang terus berkembang',
]
</script>

<style scoped>
.solutions-section {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

@media (min-width: 1024px) {
  .solutions-section {
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
  }
}

.solutions-tag {
  color: var(--edulang-yellow);
  font-size: 0.9375rem;
}

.solutions-title {
  color: var(--edulang-black);
  font-size: clamp(1.35rem, 3vw, 1.5rem);
}

.solutions-desc {
  color: var(--edulang-black);
  opacity: 0.8;
  font-size: 1rem;
  font-weight: 400;
}

.solutions-item {
  color: var(--edulang-black);
  font-size: 1rem;
}

.check-icon {
  color: var(--edulang-blue) !important;
}

.btn-primary {
  background: var(--edulang-blue) !important;
  color: white !important;
}

.btn-outline {
  border-color: var(--edulang-navy) !important;
  color: var(--edulang-navy) !important;
}

.solutions-img {
  max-width: 480px;
}
</style>