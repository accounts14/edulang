<template>
  <div class="wa-widget">
    <!-- Floating WhatsApp Button -->
    <transition name="fade">
      <button
        v-if="!open"
        class="wa-fab"
        type="button"
        aria-label="Konsultasi Kelas via WhatsApp"
        @click="open = true"
      >
        <q-icon name="fab fa-whatsapp" class="q-mr-xs" />
        <span>Konsultasi</span>
      </button>
    </transition>

    <!-- Popup Chat -->
    <transition name="slide-up">
      <div v-if="open" class="wa-popup shadow-4">
        <div class="wa-popup-header row items-center q-pa-md">
          <q-avatar size="32px" class="q-mr-sm">
            <img src="~assets/favicon-128x128.png" alt="Edulang" />
          </q-avatar>
          <div>
            <div class="text-subtitle2 text-weight-bold">Edulang Admin</div>
            <div class="text-caption text-grey-6">Online</div>
          </div>
          <q-space />
          <q-btn dense flat round icon="close" size="sm" @click="open = false" />
        </div>

        <div class="wa-popup-body q-pa-md">
          <div class="wa-bubble">
            <div class="text-caption text-grey-8 q-mb-xs">Edulang Admin</div>
            <div class="wa-bubble-content">
              Do you need assistance? We're happy to help you today!
            </div>
            <div class="text-right text-caption text-grey-5 q-mt-xs">09:19</div>
          </div>
        </div>

        <div class="wa-popup-footer q-pa-md">
          <q-btn
            class="full-width text-weight-bold"
            color="positive"
            text-color="white"
            no-caps
            label="Konsultasi"
            @click="goToContact"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const open = ref(false)
const router = useRouter()

function goToContact() {
  router.push({ name: 'ContactPage' })
}
</script>

<style scoped>
.wa-widget {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2100;
}

.wa-fab {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background-color: #25d366;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.wa-popup {
  width: 320px;
  border-radius: 18px;
  background: #ffffff;
  overflow: hidden;
}

.wa-popup-header {
  background: #f5f7fb;
}

.wa-bubble {
  max-width: 100%;
}

.wa-bubble-content {
  background: #ffffff;
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
  font-size: 13px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
