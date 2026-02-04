<!-- src/pages/LandingPage.vue -->
<template>
  <q-page class="bg-white">
    <FastTrackSection />
    <CertificationSection />
    <SolutionsSection />
    <AlumniNetworkSection />
    <MentorSection />
    <TestimonialSection />
  </q-page>
</template>

<script setup>
import CertificationSection from 'components/Landing/CertificationSection.vue'
import FastTrackSection from 'components/Landing/FastTrackSection.vue'
import AlumniNetworkSection from 'components/Landing/AlumniNetworkSection.vue'
import SolutionsSection from 'components/Landing/SolutionsSection.vue'
import TestimonialSection from 'components/Landing/TestimonialSection.vue'
import MentorSection from 'components/Landing/MentorSection.vue'
</script>

<style scoped>
/* Global styles only */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

@media (max-width: 1023px) {
  .reverse-wrap-mobile {
    flex-direction: column-reverse;
  }
}

.bg-primary {
  background-color: #003366 !important;
}

.method-card {
  transition: transform 0.3s ease;
  border: 1px solid #edf2f7;
}

.method-card:hover {
  transform: translateY(-10px);
}

.white-transparent {
  background-color: rgba(255, 255, 255, 0.15);
}

.text-body2 {
  font-size: 0.95rem;
}

.rounded-borders-16 {
  border-radius: 16px;
}

.rounded-borders-16-top {
  border-radius: 16px 16px 0 0;
}

h2 {
  line-height: 1.2;
}
</style>
