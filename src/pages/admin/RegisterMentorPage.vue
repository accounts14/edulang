<template>
  <q-page class="auth-page-container flex flex-center">
    <q-btn flat round dense icon="arrow_back" class="auth-back-btn shadow-sm" @click="goBack">
      <q-tooltip class="bg-edulang-navy">Kembali ke Dashboard</q-tooltip>
    </q-btn>

    <div class="auth-card-wrapper q-pa-md">
      <transition name="auth-fade" mode="out-in">
        <div v-if="!isRegisterSuccess" key="form" class="auth-card glass-effect q-pa-xl">
          <div class="column items-center q-mb-xl text-center">
            <div class="logo-container q-mb-lg shadow-brand">
              <img src="~assets/LogoWhite.png" alt="Edulang" class="logo-img" />
            </div>

            <h1 class="text-h4 text-weight-bolder text-edulang-navy font-outfit q-ma-none">
              Daftar <span class="text-edulang-blue">Mentor</span>
            </h1>
            <p class="text-subtitle1 text-grey-7 q-mt-sm">
              Bergabunglah bersama komunitas pendamping pendidikan terbaik.
            </p>
          </div>

          <q-form @submit="handleRegister" class="q-gutter-y-lg">
            <div class="field-container">
              <label class="input-label">Nama Lengkap Mentor</label>
              <q-input
                v-model="form.name"
                placeholder="Contoh: Budi Santoso, M.Pd"
                outlined
                rounded
                dense
                bg-color="white"
                class="edulang-input"
                :rules="[
                  (v) => !!v || 'Nama wajib diisi',
                  (v) => v.length >= 3 || 'Minimal 3 karakter',
                ]"
              >
                <template #prepend>
                  <q-icon name="person" color="edulang-blue" size="20px" />
                </template>
              </q-input>
            </div>

            <div class="field-container">
              <label class="input-label">Email Resmi Mentor</label>
              <q-input
                v-model="form.email"
                type="email"
                placeholder="mentor@edulang.id"
                outlined
                rounded
                dense
                bg-color="white"
                class="edulang-input"
                :rules="[
                  (v) => !!v || 'Email wajib diisi',
                  (v) => /.+@.+\..+/.test(v) || 'Email tidak valid',
                ]"
              >
                <template #prepend>
                  <q-icon name="alternate_email" color="edulang-blue" size="20px" />
                </template>
              </q-input>
            </div>

            <div class="field-container">
              <label class="input-label">Keamanan Akun (Password)</label>
              <q-input
                v-model="form.password"
                :type="isPwd ? 'password' : 'text'"
                placeholder="Minimal 6 karakter unik"
                outlined
                rounded
                dense
                bg-color="white"
                class="edulang-input"
                :rules="[
                  (v) => !!v || 'Password wajib diisi',
                  (v) => v.length >= 6 || 'Minimal 6 karakter',
                ]"
              >
                <template #prepend>
                  <q-icon name="lock" color="edulang-blue" size="20px" />
                </template>
                <template #append>
                  <q-btn
                    flat
                    round
                    dense
                    :icon="isPwd ? 'visibility_off' : 'visibility'"
                    color="grey-6"
                    size="sm"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>

            <q-btn
              type="submit"
              label="Daftar Sekarang"
              class="auth-main-btn full-width q-py-md text-weight-bolder"
              :loading="loading"
              unelevated
              rounded
            />
          </q-form>
        </div>

        <div
          v-else
          key="success"
          class="auth-card glass-effect q-pa-xl flex flex-center column text-center"
        >
          <div class="success-animation-box q-mb-xl">
            <div class="success-circle">
              <q-icon name="check" color="white" size="64px" />
            </div>
            <div class="confetti-placeholder"></div>
          </div>

          <h2 class="text-h3 text-weight-bolder text-edulang-navy font-outfit q-ma-none">
            Selamat!
          </h2>
          <p class="text-subtitle1 text-grey-7 q-mt-md">
            Akun mentor untuk <b>{{ form.email }}</b> berhasil didaftarkan. Admin akan meninjau
            profil Anda segera.
          </p>

          <q-btn
            unelevated
            rounded
            class="auth-main-btn full-width q-py-md q-mt-xl text-weight-bold"
            label="Lihat Daftar Mentor"
            icon-right="chevron_right"
            @click="goBackSuccess"
          />
        </div>
      </transition>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const isPwd = ref(true)
const loading = ref(false)
const isRegisterSuccess = ref(false)
const form = ref({
  name: '',
  email: '',
  password: '',
})

const goBack = () => router.push('/admin/dashboard')
const goBackSuccess = () => router.push('/admin/mentor')

const handleRegister = async () => {
  loading.value = true
  try {
    await api.post('/mentors', form.value)
    $q.notify({
      type: 'positive',
      icon: 'check_circle',
      message: 'Registrasi Berhasil! Selamat datang di Edulang.',
      position: 'top',
    })
    isRegisterSuccess.value = true
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || 'Gagal mendaftar, email mungkin sudah digunakan.'
    $q.notify({
      type: 'negative',
      message: errorMessage,
      icon: 'error_outline',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Edulang Official Palette */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-navy {
  background-color: #003387;
}
.bg-edulang-blue {
  background-color: #0089ff;
}

/* Container & Layout */
.auth-page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  background-attachment: fixed;
}

.auth-card-wrapper {
  width: 100%;
  max-width: 500px;
}

.auth-card {
  border-radius: 32px;
  box-shadow: 0 20px 50px rgba(0, 51, 135, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.glass-effect {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* Header & Components */
.auth-back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  background: white;
  color: #003387;
  transition: all 0.3s ease;
}

.auth-back-btn:hover {
  background: #003387;
  color: white;
}

.logo-container {
  width: 84px;
  height: 84px;
  background: #003387;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Form Elements */
.input-label {
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  color: #003387;
  margin-bottom: 6px;
  margin-left: 12px;
}

.edulang-input :deep(.q-field__control) {
  transition: all 0.3s ease;
  border-radius: 16px !important;
}

.edulang-input :deep(.q-field__control):hover {
  border-color: #0089ff;
}

.auth-main-btn {
  background: #003387 !important;
  color: white !important;
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.auth-main-btn:hover {
  background: #0089ff !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 137, 255, 0.3);
}

/* Success State Styles */
.success-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 10px 25px rgba(0, 200, 83, 0.3);
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Transitions */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.auth-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.auth-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/* Mobile Responsiveness */
@media (max-width: 600px) {
  .auth-card {
    padding: 32px 24px !important;
    border-radius: 0;
    height: 100vh;
    max-width: none;
  }
  .auth-page-container {
    background: white;
  }
  .logo-container {
    width: 64px;
    height: 64px;
  }
  .text-h4 {
    font-size: 1.75rem;
  }
}
</style>
