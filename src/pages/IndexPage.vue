<!-- Landing Page - struktur edulang-speak-the-world.vercel.app -->
<template>
  <q-page class="landing-page bg-accent">
    <div ref="sectionsWrapper" class="landing-sections">
      <section class="landing-section reveal-section" data-reveal>
        <HeroSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <TentangEdulangSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <EdulangUntukSiapaSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <KenapaPilihEdulangSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <ProgramEdulangSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <BelajarBaruSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <TestimonialSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <MentorSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <PartnershipSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <PenghargaanSection />
      </section>
      <section class="landing-section reveal-section" data-reveal>
        <CTAFinalSection />
      </section>
    </div>

    <WhatsappConsultWidget />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeroSection from 'components/Landing/HeroSection.vue'
import TentangEdulangSection from 'components/Landing/TentangEdulangSection.vue'
import EdulangUntukSiapaSection from 'components/Landing/EdulangUntukSiapaSection.vue'
import KenapaPilihEdulangSection from 'components/Landing/KenapaPilihEdulangSection.vue'
import ProgramEdulangSection from 'components/Landing/ProgramEdulangSection.vue'
import BelajarBaruSection from 'components/Landing/BelajarBaruSection.vue'
import TestimonialSection from 'components/Landing/TestimonialSection.vue'
import MentorSection from 'components/Landing/MentorSection.vue'
import PartnershipSection from 'components/Landing/PartnershipSection.vue'
import PenghargaanSection from 'components/Landing/PenghargaanSection.vue'
import CTAFinalSection from 'components/Landing/CTAFinalSection.vue'
import WhatsappConsultWidget from 'components/Common/WhatsappConsultWidget.vue'

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
    { rootMargin: '-40px 0px -60px 0px', threshold: 0.1 },
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

.landing-section {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
}

.landing-section:first-child {
  padding-top: 1rem;
}

/* Kurangi jarak Hero – Tentang Edulang (feedback) */
.landing-section:nth-child(2) {
  padding-top: 1rem;
}

@media (min-width: 1024px) {
  .landing-section {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
  .landing-section:first-child {
    padding-top: 1.5rem;
  }
  .landing-section:nth-child(2) {
    padding-top: 0.5rem;
  }
}

.reveal-section {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
}

.reveal-section.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
