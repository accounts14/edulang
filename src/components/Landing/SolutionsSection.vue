<!-- src/components/landing/SolutionsSection.vue -->
<template>
  <section class="container q-py-xl">
    <div class="row items-center q-col-gutter-xl">
      <div class="col-12 col-md-6">
        <div class="text-warning text-weight-bold q-mb-sm">Eksklusif Untukmu</div>
        <h2 class="text-h4 text-weight-bold text-dark q-mb-md">Solusi Tepat Belajar Bahasa</h2>
        <p class="text-grey-7 q-mb-lg">Kuasai bahasa, buka pintu karier lebih lebar</p>

        <q-list class="q-mb-xl">
          <q-item v-for="(benefit, index) in solutions" :key="index" dense class="q-px-none">
            <q-item-section avatar>
              <q-icon name="check_circle" color="primary" />
            </q-item-section>
            <q-item-section class="text-weight-medium text-dark">
              {{ benefit }}
            </q-item-section>
          </q-item>
        </q-list>

        <div class="q-gutter-md">
          <q-btn unelevated rounded color="primary" label="Apply Now" class="q-px-lg" />
          <q-btn outline rounded color="primary" label="How It Works" class="q-px-lg" />
        </div>
      </div>

      <div class="col-12 col-md-6 flex flex-center relative-position">
        <q-img src="~assets/Solusi.png" style="max-width: 500px" />
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