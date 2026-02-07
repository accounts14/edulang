<!-- src/components/landing/MentorSection.vue -->
<template>
  <section class="mentor-section overflow-hidden">
    <div class="container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <div class="mentor-tag text-weight-bold q-mb-sm">
            Berbagi Skill, Bangun Dampak Untukmu
          </div>
          <h2 class="mentor-title text-weight-bold q-mb-md">
            Jadilah Mentor di Edulang <br />
            Bantu Peserta Melangkah ke <br />
            Masa Depan Nyata
          </h2>
          <p class="mentor-desc q-mb-lg">
            Berkontribusi dalam sistem pembelajaran bahasa berbasis tujuan, sambil membangun peran
            profesional yang berkelanjutan.
          </p>

          <q-list class="q-mb-xl">
            <q-item
              v-for="(item, index) in mentorBenefits"
              :key="index"
              dense
              class="q-px-none q-mb-sm"
            >
              <q-item-section avatar size="24px">
                <q-icon name="check_circle" class="mentor-check" />
              </q-item-section>
              <q-item-section class="mentor-item text-weight-medium">
                {{ item }}
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-gutter-md">
            <q-btn unelevated rounded class="btn-primary q-px-xl" label="Daftar sebagai mentor" />
            <q-btn outline rounded class="btn-outline q-px-xl" label="Pelajari peran mentor" />
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center relative-position">
          <q-img src="~assets/MENTOR.png" class="mentor-img" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const mentorBenefits = [
  'Membangun kredibilitas sebagai mentor profesional',
  'Mendapatkan penghasilan dari sistem pembelajaran terstruktur',
  'Terhubung dengan ekosistem edukasi dan jalur global',
  'Berpeluang terlibat dalam kolaborasi edukasi jangka panjang',
  'Akses ke sistem, data progres peserta, dan peluang lanjutan',
]
</script>

<style scoped>
.mentor-section {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.mentor-tag {
  color: var(--edulang-yellow);
  font-size: 0.9375rem;
}

.mentor-title {
  color: var(--edulang-black);
  font-size: clamp(1.35rem, 3vw, 1.5rem);
}

.mentor-desc {
  color: var(--edulang-black);
  opacity: 0.85;
  font-size: 1rem;
  font-weight: 400;
}

.mentor-item {
  color: var(--edulang-black);
  font-size: 0.9375rem;
}

.mentor-check {
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

.mentor-img {
  max-width: 520px;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
