<template>
  <div class="error-container">
    <div class="background-3d">
      <div class="glass-orb orb-1"></div>
      <div class="glass-orb orb-2"></div>
    </div>

    <div class="content-wrapper">
      <div class="brand-badge">
        <span class="star-accent">★</span>
        <span class="brand-text">EDULANG</span>
      </div>

      <div class="hero-section">
        <div class="number-3d-wrapper">
          <h1 class="number-3d">404</h1>
          <div class="number-shadow"></div>
        </div>

        <div class="text-group">
          <h2 class="title">Lost in Exploration</h2>
          <p class="subtitle">
            Halaman yang kamu cari tidak ditemukan dalam kurikulum kami.<br />
            Mari kembali ke jalur untuk meraih masa depanmu.
          </p>
        </div>
      </div>

      <div class="action-group">
        <q-btn to="/" label="Kembali ke Beranda" class="btn-main" unelevated no-caps />
        <q-btn to="/berlangganan" label="Jelajahi Program" class="btn-outline" outline no-caps />
      </div>

      <div class="footer-tagline">#UnlockTheWorldWithEducation</div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;700;800&display=swap');

.error-container {
  min-height: 100vh;
  background: #f5f7fa; /* Edulang White/Greyish for Classy look */
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.content-wrapper {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

/* Minimalist Logo Section */
.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border-radius: 100px;
  box-shadow: 0 4px 15px rgba(0, 51, 135, 0.05);
  margin-bottom: 3rem;
}

.star-accent {
  color: #ffc42c; /* Edulang Yellow */
  font-size: 1.2rem;
}

.brand-text {
  font-weight: 800;
  letter-spacing: 2px;
  color: #003387; /* Edulang Navy */
  font-size: 0.85rem;
}

/* 3D Typography */
.number-3d-wrapper {
  position: relative;
  perspective: 1000px;
  margin-bottom: 1rem;
}

.number-3d {
  font-size: clamp(8rem, 15vw, 12rem);
  font-weight: 800;
  margin: 0;
  color: #003387;
  transform: rotateX(10deg) rotateY(-5deg);
  text-shadow:
    1px 1px 0px #002663,
    2px 2px 0px #002663,
    3px 3px 0px #002663,
    10px 20px 30px rgba(0, 51, 135, 0.2);
  animation: floating 4s ease-in-out infinite;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 1rem;
}

.subtitle {
  color: #666;
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 3rem;
}

/* Buttons Styling */
.action-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-main {
  background: #003387 !important;
  color: white !important;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 51, 135, 0.2);
}

.btn-outline {
  border: 1.5px solid #003387 !important;
  color: #003387 !important;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
}

/* Subtle 3D Elements */
.glass-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: rgba(0, 137, 255, 0.1); /* Edulang Blue */
  top: -100px;
  right: -100px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: rgba(255, 196, 44, 0.1); /* Edulang Yellow */
  bottom: -50px;
  left: -50px;
}

.footer-tagline {
  margin-top: 4rem;
  font-size: 0.8rem;
  color: #999;
  letter-spacing: 1px;
}

@keyframes floating {
  0%,
  100% {
    transform: rotateX(10deg) rotateY(-5deg) translateY(0);
  }
  50% {
    transform: rotateX(15deg) rotateY(5deg) translateY(-15px);
  }
}

@media (max-width: 600px) {
  .action-group {
    flex-direction: column;
    padding: 0 20px;
  }
  .number-3d {
    font-size: 8rem;
  }
}
</style>
