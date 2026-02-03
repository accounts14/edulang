<!-- src/components/landing/MentorSection.vue -->
<template>
  <section class="bg-light-blue-1 q-py-xl overflow-hidden">
    <div class="container q-py-lg">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <div class="text-warning text-weight-bold q-mb-sm">Berbagi Skill, Bangun Dampak Untukmu</div>
          <h2 class="text-h4 text-weight-bold text-dark q-mb-md">
            Jadilah Mentor di Edulang <br>
            Bantu Peserta Melangkah ke <br>
            Masa Depan Nyata
          </h2>
          <p class="text-grey-8 q-mb-lg">
            Berkontribusi dalam sistem pembelajaran bahasa berbasis tujuan, sambil membangun peran profesional yang berkelanjutan.
          </p>

          <q-list class="q-mb-xl">
            <q-item v-for="(item, index) in mentorBenefits" :key="index" dense class="q-px-none q-mb-sm">
              <q-item-section avatar size="24px">
                <q-icon name="check_circle" color="primary" />
              </q-item-section>
              <q-item-section class="text-dark text-weight-medium">
                {{ item }}
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-gutter-md">
            <q-btn unelevated rounded color="primary" label="Daftar sebagai mentor" class="q-px-xl" />
            <q-btn outline rounded color="primary" label="Pelajari peran mentor" class="q-px-xl" />
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center relative-position">
          <q-img 
            src="~assets/MENTOR.png" 
            style="max-width: 550px; width: 100%"
            class="drop-shadow"
          />
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
  'Akses ke sistem, data progres peserta, dan peluang lanjutan'
]
</script>

<style scoped>
.bg-light-blue-1 {
  background-color: #f0f7ff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.drop-shadow {
  filter: drop-shadow(0px 10px 30px rgba(0,0,0,0.1));
}
</style>