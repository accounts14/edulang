<template>
  <section class="partnership-section">
    <div class="container">
      <div class="text-center section-header q-mb-xl">
        <div class="badge-partnership q-mb-md">Partnership</div>
        <h2 class="section-subtitle text-weight-bold q-mb-sm">
          Dipercaya oleh Institusi Terkemuka
        </h2>
        <p class="section-desc">
          Edulang bekerjasama dengan berbagai universitas dan perusahaan untuk memberikan pendidikan
          bahasa terbaik.
        </p>
      </div>

      <div class="uni-grid q-mb-xl">
        <div v-for="u in universities" :key="u" class="uni-item">
          {{ u }}
        </div>
      </div>

      <div class="media-section text-center">
        <h4 class="media-title text-weight-bold q-mb-xs">Telah Diliput Oleh</h4>
        <p class="media-subtitle q-mb-lg">Media nasional terpercaya</p>

        <div class="media-grid">
          <div v-for="m in media" :key="m" class="media-item">
            {{ m }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const universities = [
  'Lorem Ipsum',
  'Lorem Ipsum',
  'Lorem Ipsum',
  'Lorem Ipsum',
  'Lorem Ipsum',
  'Lorem Ipsum',
]
const media = [
  'Lorem Ipsum',
  'Lorem Ipsum',
  'Lorem Ipsum',
  'Lorem Ipsum',
  'Lorem Ipsum',
  'Lorem Ipsum',
]
</script>

<style scoped>
.partnership-section {
  padding: 80px 0;
  background-color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Badge Partnership di atas judul */
.badge-partnership {
  display: inline-block;
  background: #eef6ff;
  color: #0089ff;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.section-subtitle {
  color: #1a1a1a;
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  letter-spacing: -0.5px;
}

.section-desc {
  color: #64748b;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Grid Universitas */
.uni-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  justify-content: center;
  max-width: 1000px;
  margin: 40px auto 60px;
}

.uni-item {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  padding: 24px 10px;
  border-radius: 16px;
  font-weight: 800;
  color: #003387; /* Navy Blue */
  font-size: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uni-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  border-color: #e2e8f0;
}

/* Section Media */
.media-section {
  margin-top: 60px;
}

.media-title {
  color: #1a1a1a;
  font-size: 1.25rem;
  letter-spacing: -0.2px;
}

.media-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
}

.media-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
}

.media-item {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  padding: 12px 24px;
  border-radius: 12px;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.media-item:hover {
  background: #f8fafc;
  color: #003387;
}

/* Responsive Tablet/Mobile */
@media (max-width: 768px) {
  .uni-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .uni-item {
    font-size: 1.2rem;
    padding: 16px 5px;
  }
}

@media (max-width: 480px) {
  .uni-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
