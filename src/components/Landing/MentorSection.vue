<template>
  <section class="mentor-section">
    <div class="container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <div class="section-header">
            <div class="hashtag-label q-mb-md">Berbagi Skill, Bangun Dampak Untukmu</div>
            <h2 class="section-title text-weight-bold q-mb-sm">Jadilah Mentor di Edulang</h2>
            <h3 class="section-subtitle text-weight-bold q-mb-md">
              Bantu Peserta Melangkah ke Masa Depan Nyata
            </h3>
            <p class="mentor-desc q-mb-xl">
              Berkontribusi dalam sistem pembelajaran bahasa berbasis tujuan, sambil membangun
              portofolio profesional yang berkelanjutan.
            </p>

            <div class="benefit-list q-gutter-y-md q-mb-xl">
              <div
                v-for="(benefit, idx) in benefits"
                :key="idx"
                class="benefit-item flex items-center"
              >
                <q-icon name="check_circle" color="orange-7" size="20px" class="q-mr-md" />
                <span class="text-benefit">{{ benefit }}</span>
              </div>
            </div>

            <div class="action-area flex q-gutter-md">
              <q-btn
                unelevated
                no-caps
                label="Daftar sebagai mentor"
                icon-right="arrow_forward"
                class="btn-register-mentor"
              />
              <q-btn outline no-caps label="Pelajari peran mentor" class="btn-learn-more" />
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center relative-position">
          <div class="mentor-viz-container">
            <div class="viz-background">
              <img
                src="~assets/landing/character-hero.png"
                class="mentor-full-img"
                alt="Mentor Illustration"
              />

              <div class="floating-mentor-card">
                <div class="row items-center no-wrap q-mb-sm">
                  <q-avatar size="40px" class="q-mr-sm">
                    <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                  </q-avatar>
                  <div class="profile-info">
                    <div class="m-name">Mina Karin</div>
                    <q-badge color="blue" label="Mentor" class="m-badge" />
                  </div>
                </div>
                <div class="m-specialty q-mb-sm">
                  Mentor Bahasa Jepang – Jalur Akademik & Profesional
                </div>
                <p class="m-quote q-mb-sm">
                  mentor berpengalaman dalam membimbing peserta mencapai kompetensi bahasa Jepang
                  untuk kebutuhan studi dan dunia kerja.
                </p>
                <div class="m-rating flex items-center">
                  <q-icon v-for="n in 5" :key="n" name="star" color="orange-5" size="16px" />
                  <span class="q-ml-xs text-grey-7">(1,000)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const benefits = [
  'Membangun kredibilitas sebagai mentor profesional',
  'Mendapatkan penghasilan dari sistem pembelajaran terstruktur',
  'Terhubung dengan ekosistem edukasi dan jalur global',
  'Berpeluang terlibat dalam kolaborasi edukasi jangka panjang',
  'Akses ke sistem, data progres peserta, dan peluang lanjutan',
]
</script>

<style scoped>
.mentor-section {
  padding: 100px 0;
  background: #ffffff;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Kiri: Typography & Content */
.hashtag-label {
  color: #a08149;
  font-weight: 600;
  font-size: 0.85rem;
  background: #fff7e6;
  display: inline-block;
  padding: 6px 16px;
  border-radius: 50px;
}

.section-title {
  color: #002d72;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.2;
}

.section-subtitle {
  color: #0089ff;
  font-size: 1.5rem;
  line-height: 1.3;
}

.mentor-desc {
  color: #64748b;
  font-size: 1.1rem;
  max-width: 540px;
}

.text-benefit {
  color: #1e293b;
  font-size: 1rem;
}

/* Kiri: Buttons */
.btn-register-mentor {
  background: #0056b3;
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
}

.btn-learn-more {
  color: #0089ff;
  border: 1px solid #0089ff;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
}

/* Kanan: Visual & Floating Card */
.mentor-viz-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: center;
}

.viz-background {
  width: 420px;
  height: 380px;
  background-color: #0089ff;
  border-radius: 30px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.mentor-full-img {
  height: 100%;
  z-index: 1;
  object-fit: contain;
}

/* Floating Mentor Card Styling */
/* Floating Mentor Card Styling */
.floating-mentor-card {
  position: absolute;
  /* Mengubah posisi dari 30px menjadi lebih rendah */
  top: 230px;
  /* Menyesuaikan posisi ke kanan agar proporsional */
  right: -100px;
  width: 290px;
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.m-name {
  font-weight: 800;
  color: #1e293b;
  font-size: 0.95rem;
}

.m-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
}

.m-specialty {
  font-weight: 800;
  color: #1e293b;
  font-size: 0.85rem;
  line-height: 1.3;
}

.m-quote {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.5;
}

.m-rating span {
  font-size: 11px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1023px) {
  .mentor-section {
    padding: 60px 0;
  }
  .floating-mentor-card {
    top: 150px;
    right: 10px;
    width: 260px;
    padding: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .viz-background {
    margin-bottom: 40px;
  }
  .viz-background {
    width: 320px;
    height: 280px;
  }
  .section-header {
    text-align: left;
  }
}
</style>
