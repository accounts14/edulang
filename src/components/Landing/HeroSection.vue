<!-- src/components/landing/HeroSection.vue -->
<template>
  <section class="hero-section container row items-center reverse-wrap-mobile">
    <div class="col-12 col-md-6 q-pr-md-xl">
      <div class="hero-tag text-weight-bold q-mb-sm">#MulaiSekarang</div>
      <h1 class="hero-title text-weight-bold q-mb-md">
        Pimpin Dunia Lewat Bahasa
      </h1>
      <p class="hero-desc q-mb-lg">
        Platform kursus online terintegrasi untuk meningkatkan skill bahasa asing dengan metode
        interaktif.
      </p>
      <div class="q-gutter-md">
        <q-btn unelevated rounded class="btn-primary q-px-lg q-py-sm" label="Mulai Belajar" />
        <q-btn outline rounded class="btn-outline q-px-lg q-py-sm" label="Explore Our Product" />
      </div>
    </div>
    <div class="col-12 col-md-6 text-center">
      <q-img src="~assets/hero-bg.png" class="hero-img" />
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.hero-section {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

@media (min-width: 1024px) {
  .hero-section {
    padding-top: 1.5rem;
    padding-bottom: 3rem;
  }
}

.hero-tag {
  color: var(--edulang-yellow);
  font-size: 0.9375rem;
}

.hero-title {
  color: var(--edulang-black);
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  line-height: 1.2;
}

.hero-desc {
  color: var(--edulang-black);
  opacity: 0.85;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
}

.hero-img {
  max-width: 420px;
}

.btn-primary {
  background: var(--edulang-blue) !important;
  color: white !important;
}

.btn-outline {
  border-color: var(--edulang-navy) !important;
  color: var(--edulang-navy) !important;
}
</style>