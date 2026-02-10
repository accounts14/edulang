<!-- Bergabung Sebagai Mentor - Bagikan Ilmu Bahasamu & Raih Penghasilan -->
<template>
  <section class="mentor-section">
    <div class="container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <h2 class="section-title text-weight-bold q-mb-md">Bergabung Sebagai Mentor</h2>
          <h3 class="section-subtitle text-weight-bold">Bagikan Ilmu Bahasamu & Raih Penghasilan</h3>
          <p class="mentor-desc q-mb-lg">
            Jadilah bagian dari komunitas mentor Edulang. Buat konten video pembelajaran dan bantu
            ribuan siswa menguasai bahasa baru.
          </p>
          <div class="mentor-benefits row q-col-gutter-md q-mb-xl">
            <div class="col-6">
              <div class="benefit-item">
                <q-icon name="payments" size="24px" color="primary" />
                <span>Penghasilan Kompetitif</span>
              </div>
            </div>
            <div class="col-6">
              <div class="benefit-item">
                <q-icon name="groups" size="24px" color="primary" />
                <span>Jangkau Ribuan Siswa</span>
              </div>
            </div>
            <div class="col-6">
              <div class="benefit-item">
                <q-icon name="schedule" size="24px" color="primary" />
                <span>Waktu Fleksibel</span>
              </div>
            </div>
          </div>
          <q-btn
            unelevated
            no-caps
            class="btn-primary q-px-xl q-py-md"
            label="Daftar Jadi Mentor"
            icon-right="arrow_forward"
            :to="{ path: '/mentor/dashboard' }"
          />
        </div>
        <div class="col-12 col-md-6 flex flex-center">
          <q-img src="~assets/MENTOR.png" class="mentor-img" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.mentor-section {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.section-title {
  color: var(--edulang-yellow, #ffc42c);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-subtitle {
  color: var(--edulang-navy, #003387);
  font-size: clamp(1.5rem, 3vw, 1.75rem);
}

.mentor-desc {
  color: var(--edulang-black, #2d2d2d);
  opacity: 0.9;
  font-size: 1rem;
  line-height: 1.7;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--edulang-black, #2d2d2d);
}

.btn-primary {
  background: var(--edulang-blue, #0089ff) !important;
  color: white !important;
  border-radius: 8px;
  font-weight: 600;
}

.mentor-img {
  max-width: 480px;
  width: 100%;
}
</style>
