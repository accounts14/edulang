<!-- src/components/landing/HeroSection.vue -->
<template>
  <section class="container q-py-xl row items-center reverse-wrap-mobile">
    <div class="col-12 col-md-6 q-pr-md-xl">
      <div class="text-warning text-weight-bold q-mb-sm">#MulaiSekarang</div>
      <h1 class="text-h3 text-weight-bold text-dark q-mb-md" style="line-height: 1.2">
        Pimpin Dunia Lewat Bahasa
      </h1>
      <p class="text-grey-7 text-body1 q-mb-lg">
        Platform kursus online terintegrasi untuk meningkatkan skill bahasa asing dengan metode
        interaktif.
      </p>
      <div class="q-gutter-md">
        <q-btn unelevated rounded color="primary" label="Mulai Belajar" class="q-px-lg q-py-sm" />
        <q-btn
          outline
          rounded
          color="primary"
          label="Explore Our Product"
          class="q-px-lg q-py-sm"
        />
      </div>
    </div>
    <div class="col-12 col-md-6 text-center">
      <q-img src="~assets/hero-bg.png" style="max-width: 450px" />
    </div>
  </section>
</template>

<script setup></script>