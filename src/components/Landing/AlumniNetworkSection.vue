<!-- src/components/landing/AlumniNetworkSection.vue -->
<template>
  <section class="alumni-section text-white">
    <div class="row">
      <div class="col-12 col-md-5 relative-position">
        <q-img src="~assets/lulus.png" class="full-height fit alumni-img" />
      </div>
      <div class="col-12 col-md-7 alumni-content flex flex-center">
        <div>
          <q-chip class="alumni-chip text-weight-bold q-mb-md" label="Testimoni Alumni" />
          <h2 class="alumni-title text-weight-bold q-mb-md">
            Melangkah Lebih Jauh Bersama Jaringan Alumni Kami
          </h2>
          <p class="alumni-desc q-mb-lg">
            Akses eksklusif ke jaringan profesional dan kesempatan karir global.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.alumni-section {
  background: var(--edulang-navy, #003387);
}

.alumni-img {
  min-height: 380px;
  object-fit: cover;
}

.alumni-content {
  padding: 2.5rem 2rem;
}

@media (min-width: 1024px) {
  .alumni-content {
    padding: 3rem 2.5rem;
  }
}

.alumni-chip {
  background: var(--edulang-yellow, #ffc42c) !important;
  color: var(--edulang-black, #2d2d2d) !important;
}

.alumni-title {
  font-size: clamp(1.35rem, 3vw, 1.5rem);
}

.alumni-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 400;
}
</style>
