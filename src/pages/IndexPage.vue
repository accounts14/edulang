<!-- src/pages/IndexPage.vue - Landing Page -->
<template>
  <q-page class="landing-page bg-white">
    <div ref="sectionsWrapper" class="landing-sections">
      <section class="landing-section reveal-section" data-reveal>
        <HeroSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <LearningMethodSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <LearningPathSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <CertificationSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <FastTrackSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <AlumniNetworkSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <SolutionsSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <TestimonialSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <MentorSection />
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeroSection from 'components/Landing/HeroSection.vue'
import LearningMethodSection from 'components/Landing/LearningMethodSection.vue'
import LearningPathSection from 'components/Landing/LearningPathSection.vue'
import CertificationSection from 'components/Landing/CertificationSection.vue'
import FastTrackSection from 'components/Landing/FastTrackSection.vue'
import AlumniNetworkSection from 'components/Landing/AlumniNetworkSection.vue'
import SolutionsSection from 'components/Landing/SolutionsSection.vue'
import TestimonialSection from 'components/Landing/TestimonialSection.vue'
import MentorSection from 'components/Landing/MentorSection.vue'

const sectionsWrapper = ref(null)

onMounted(() => {
  const sections = sectionsWrapper.value?.querySelectorAll('[data-reveal]')
  if (!sections?.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    { rootMargin: '-40px 0px -60px 0px', threshold: 0.1 }
  )

  sections.forEach((el) => observer.observe(el))
})
</script>

<style scoped>
.landing-page {
  font-family: 'Poppins', sans-serif;
}

.landing-sections {
  max-width: 100%;
}

/* Jarak antar section konsisten */
.landing-section {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.landing-section:first-child {
  padding-top: 1.5rem;
}

@media (min-width: 1024px) {
  .landing-section {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
  .landing-section:first-child {
    padding-top: 2rem;
  }
}

/* Animasi masuk section */
.reveal-section {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal-section.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Shared untuk child components */
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

.method-card {
  transition: transform 0.3s ease;
  border: 1px solid #e8eef5;
}

.method-card:hover {
  transform: translateY(-6px);
}

.white-transparent {
  background-color: rgba(255, 255, 255, 0.15);
}

.text-body2 {
  font-size: 0.9375rem;
}

.rounded-borders-16 {
  border-radius: 16px;
}

.rounded-borders-16-top {
  border-radius: 16px 16px 0 0;
}

h2 {
  line-height: 1.25;
}
</style>