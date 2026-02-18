<template>
  <div class="wa-widget-container">
    <transition name="fade">
      <button v-if="!open" class="wa-fab-mini" @click="open = true" aria-label="Chat WhatsApp">
        <q-icon name="fab fa-whatsapp" size="22px" />
        <div class="notification-dot"></div>
      </button>
    </transition>

    <transition name="toast">
      <div v-if="open" class="wa-notification-card shadow-10">
        <div class="row no-wrap items-center q-pa-sm">
          <div class="relative-position">
            <q-avatar size="40px" class="bg-grey-2">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <div class="status-indicator"></div>
          </div>

          <div class="q-ml-sm col">
            <div class="row items-center justify-between">
              <span class="text-weight-bold text-navy">Edulang Admin</span>
              <q-btn icon="close" flat round dense size="xs" color="grey-6" @click="open = false" />
            </div>
            <p class="msg-preview q-ma-none text-grey-8">Halo! Ada yang bisa kami bantu?</p>
            <q-btn
              label="Balas di WhatsApp"
              color="positive"
              flat
              no-caps
              dense
              class="q-mt-xs text-caption text-weight-bold"
              icon="fab fa-whatsapp"
              @click="goToContact"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const open = ref(false)

setTimeout(() => {
  open.value = true
}, 5000)

function goToContact() {
  window.open('https://wa.me/6282279506450', '_blank')
}
</script>

<style scoped>
.wa-widget-container {
  position: fixed;
  right: 16px;
  bottom: 24px;
  z-index: 9999;
  pointer-events: none;
}

.wa-widget-container * {
  pointer-events: auto;
}

/* FAB Kecil */
.wa-fab-mini {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #25d366;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #ff5252;
  border: 2px solid white;
  border-radius: 50%;
}

/* Card ala Notifikasi */
.wa-notification-card {
  width: 300px;
  background: white;
  border-radius: 14px;
  border-left: 4px solid #25d366;
  padding: 6px;
  overflow: hidden;
}

.text-navy {
  color: #003387;
  font-size: 0.85rem;
}

.msg-preview {
  font-size: 0.8rem;
  line-height: 1.3;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
}

/* Animasi */
.toast-enter-active {
  animation: slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-leave-active {
  animation: slide-in 0.25s reverse ease-in;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ✅ Mobile responsive - Perbaikan di sini */
@media (max-width: 400px) {
  .wa-widget-container {
    right: 12px;
    bottom: 16px;
  }

  .wa-notification-card {
    width: 260px; /* Lebih kecil */
    border-radius: 12px;
    padding: 4px;
  }

  .wa-fab-mini {
    width: 48px;
    height: 48px;
  }
}
</style>
