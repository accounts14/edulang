<template>
  <q-page class="window-height">
    <!-- Full Form Centered - NO IMAGE -->
    <div class="auth-right full-width flex flex-center column q-pa-xl relative-position">
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        class="auth-back-btn"
        aria-label="Kembali"
        @click="goBack"
      />

      <transition name="fade" mode="out-in">
        <!-- Form Register -->
        <div v-if="!isRegisterSuccess" key="form-register" class="auth-form-wrap">
          <div class="column items-center q-mb-lg">
            <!-- Logo seperti RegisterPage -->
            <div class="auth-logo-circle q-mb-md">
              <img src="~assets/LogoWhite.png" alt="Edulang" class="auth-logo-img" />
            </div>
            <h1 class="text-h4 text-weight-bolder q-ma-none text-dark">Daftar Sebagai Mentor</h1>
            <p class="text-grey-7 text-center q-mt-sm">
              Lengkapi form untuk mulai mengajar di Edulang
            </p>
          </div>

          <q-form @submit="handleRegister" class="q-gutter-y-md">
            <div class="field-wrapper">
              <label class="text-weight-bold text-caption q-ml-sm text-grey-9">
                Nama Lengkap Mentor:
              </label>
              <q-input
                v-model="form.name"
                placeholder="Masukkan nama lengkap"
                filled
                rounded
                dense
                borderless
                bg-color="grey-2"
                class="q-mt-xs auth-input"
                :rules="[
                  (v) => !!v || 'Nama wajib diisi',
                  (v) => v.length >= 3 || 'Minimal 3 karakter',
                ]"
              >
                <template #prepend>
                  <q-icon name="person_outline" size="xs" color="grey-7" />
                </template>
              </q-input>
            </div>

            <div class="field-wrapper">
              <label class="text-weight-bold text-caption q-ml-sm text-grey-9">
                Email Mentor:
              </label>
              <q-input
                v-model="form.email"
                type="email"
                placeholder="mentor@edulang.com"
                filled
                rounded
                dense
                borderless
                bg-color="grey-2"
                class="q-mt-xs auth-input"
                :rules="[
                  (v) => !!v || 'Email wajib diisi',
                  (v) => /.+@.+\..+/.test(v) || 'Email tidak valid',
                ]"
              >
                <template #prepend>
                  <q-icon name="mail_outline" size="xs" color="grey-7" />
                </template>
              </q-input>
            </div>

            <div class="field-wrapper">
              <label class="text-weight-bold text-caption q-ml-sm text-grey-9"> Password: </label>
              <q-input
                v-model="form.password"
                :type="isPwd ? 'password' : 'text'"
                placeholder="Minimal 6 karakter"
                filled
                rounded
                dense
                borderless
                bg-color="grey-2"
                class="q-mt-xs auth-input"
                :rules="[
                  (v) => !!v || 'Password wajib diisi',
                  (v) => v.length >= 6 || 'Minimal 6 karakter',
                ]"
              >
                <template #append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    size="xs"
                    class="cursor-pointer"
                    color="grey-7"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>

            <q-btn
              label="Daftar Sebagai Mentor"
              type="submit"
              class="auth-primary-btn full-width q-py-md text-weight-bold q-mt-lg"
              :loading="loading"
              unelevated
            />
          </q-form>
        </div>

        <!-- Success Message -->
        <div
          v-else
          key="success-message"
          class="auth-form-wrap flex flex-center column text-center animate-pop"
        >
          <div class="bg-green-1 q-pa-lg rounded-borders circle-icon q-mb-lg">
            <q-icon name="task_alt" color="green-6" size="80px" />
          </div>
          <h2 class="text-h4 text-weight-bold text-dark q-ma-none">Berhasil!</h2>
          <p class="text-grey-7 q-mt-md">
            Akun mentor <b>{{ form.email }}</b> telah dibuat.
          </p>
          <q-btn
            unelevated
            rounded
            class="auth-primary-btn full-width q-py-md q-mt-xl"
            label="Kembali ke Daftar Mentor"
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
import { useRouter } from 'vue-router' // ✅ FIX: Import dari vue-router, bukan quasar

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

// ✅ Arrow back → Admin Dashboard
const goBack = () => {
  router.push('/admin/dashboard')
}

// ✅ Success button → Admin Mentor List
const goBackSuccess = () => {
  router.push('/admin/mentor')
}

const handleRegister = async () => {
  loading.value = true
  try {
    const response = await api.post('/mentors', form.value)
    console.log('Mentor berhasil dibuat:', response.data)
    $q.notify({
      type: 'positive',
      message: 'Pendaftaran mentor berhasil! Menunggu persetujuan admin.',
    })
    isRegisterSuccess.value = true
    form.value = { name: '', email: '', password: '' }
  } catch (error) {
    console.error('Error register mentor:', error)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Gagal mendaftar mentor, silakan coba lagi.'
    $q.notify({
      type: 'negative',
      message: errorMessage,
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.window-height {
  min-height: 100vh;
}

.auth-right {
  min-height: 100vh;
  background: var(--edulang-white, #f5f7fa);
  position: relative;
}

.auth-back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  color: var(--edulang-black, #2d2d2d) !important;
  z-index: 10;
}

.auth-form-wrap {
  width: 100%;
  max-width: 420px;
}

.auth-logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--edulang-navy, #003387);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

.auth-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.auth-primary-btn {
  background: var(--edulang-navy, #003387) !important;
  color: white !important;
  border-radius: 12px !important;
  font-size: 1rem !important;
}

.field-wrapper {
  width: 100%;
}

:deep(.auth-input .q-field--filled .q-field__control) {
  background: #eef0f3 !important;
  border-radius: 12px !important;
  padding-left: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.circle-icon {
  border-radius: 50%;
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pop {
  animation: popIn 0.6s ease-out;
}

.rounded-borders {
  border-radius: 10px;
}
</style>
