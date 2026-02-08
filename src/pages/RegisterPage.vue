<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="auth-page-full row no-wrap">
        <!-- Left: Image -->
        <div class="auth-left gt-sm relative-position overflow-hidden">
          <q-img
            src="https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?ixlib=rb-4.0.3"
            class="full-height full-width"
            fit="cover"
          />
        </div>

        <!-- Right: Form -->
        <div class="auth-right flex flex-center column q-pa-xl">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            class="auth-back-btn"
            aria-label="Kembali"
            @click="$router.push('/')"
          />

          <transition name="fade" mode="out-in">
            <div v-if="!isRegisterSuccess" key="form-register" class="auth-form-wrap">
              <div class="column items-center q-mb-lg">
                <div class="auth-logo-circle q-mb-md">
                  <img src="~assets/LogoWhite.png" alt="Edulang" class="auth-logo-img" />
                </div>
                <h1 class="text-h4 text-weight-bolder q-ma-none text-dark">Create New Account</h1>
                <p class="text-grey-7 text-center q-mt-sm">
                  Lengkapi form di bawah dengan menggunakan data Anda yang valid
                </p>
              </div>

              <q-form @submit="handleRegister" class="q-gutter-y-md">
                <div class="field-wrapper">
                  <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                    >Nama Lengkap :</label
                  >
                  <q-input
                    v-model="form.name"
                    placeholder="Username"
                    filled
                    rounded
                    bg-color="grey-2"
                    dense
                    borderless
                    class="q-mt-xs auth-input"
                  >
                    <template v-slot:append>
                      <q-icon name="person_outline" size="xs" color="grey-7" />
                    </template>
                  </q-input>
                </div>

                <div class="field-wrapper">
                  <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                    >Email Address :</label
                  >
                  <q-input
                    v-model="form.email"
                    placeholder="Example@gmai.com"
                    filled
                    rounded
                    bg-color="grey-2"
                    dense
                    borderless
                    class="q-mt-xs auth-input"
                  >
                    <template v-slot:append>
                      <q-icon name="mail_outline" size="xs" color="grey-7" />
                    </template>
                  </q-input>
                </div>

                <div class="field-wrapper">
                  <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                    >Password :</label
                  >
                  <q-input
                    v-model="form.password"
                    :type="isPwd ? 'password' : 'text'"
                    placeholder="Password"
                    filled
                    rounded
                    bg-color="grey-2"
                    dense
                    borderless
                    class="q-mt-xs auth-input"
                  >
                    <template v-slot:append>
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
                  label="Continue"
                  type="submit"
                  class="auth-primary-btn full-width q-py-md text-weight-bold q-mt-lg"
                  :loading="loading"
                />

                <div class="text-center q-mt-lg text-body2 auth-switch-text">
                  Sudah punya akun?
                  <span
                    class="auth-link cursor-pointer text-weight-bold"
                    @click="$router.push('/login')"
                    >Masuk sekarang</span
                  >
                </div>
              </q-form>
            </div>

            <div
              v-else
              key="success-message"
              class="auth-form-wrap flex flex-center column text-center animate-pop"
            >
              <div class="bg-green-1 q-pa-lg rounded-borders circle-icon q-mb-lg">
                <q-icon name="mark_email_read" color="green-6" size="80px" />
              </div>
              <h2 class="text-h4 text-weight-bold text-dark q-mb-sm">Cek Email Anda!</h2>
              <p class="text-grey-7 text-body1 q-px-md" style="max-width: 400px; line-height: 1.6">
                Kami telah mengirimkan tautan verifikasi ke
                <span class="text-weight-bold text-dark">{{ form.email }}</span
                >. <br />Silakan cek kotak masuk (inbox) atau folder spam Anda.
              </p>
              <div class="q-mt-xl full-width" style="max-width: 300px">
                <q-btn
                  unelevated
                  rounded
                  class="auth-primary-btn full-width q-py-md text-weight-bold"
                  label="Kembali ke Login"
                  @click="$router.push('/login')"
                />
                <div class="q-mt-md text-caption text-grey-6 cursor-pointer hover-text-primary">
                  Tidak menerima email? <span class="text-weight-bold">Kirim ulang</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isPwd = ref(true)
const loading = ref(false)
const isRegisterSuccess = ref(false)
const form = ref({ name: '', email: '', password: '' })

const handleRegister = async () => {
  loading.value = true
  try {
    await api.post('/auth/register', form.value)
    $q.notify({ type: 'positive', message: 'Registrasi Berhasil!' })
    isRegisterSuccess.value = true
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal mendaftar, silakan cek data Anda.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page-full {
  min-height: 100vh;
}

.auth-left {
  flex: 1;
  min-height: 100vh;
}

.auth-right {
  flex: 1;
  min-height: 100vh;
  background: var(--edulang-white, #f5f7fa);
  position: relative;
}

.auth-back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  color: var(--edulang-black, #2d2d2d) !important;
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
  border-radius: 12px;
}

.auth-switch-text {
  color: var(--edulang-black, #2d2d2d);
}

.auth-link {
  color: var(--edulang-blue, #0089ff) !important;
  text-decoration: underline;
}

.auth-link:hover {
  opacity: 0.9;
}

:deep(.auth-input .q-field--filled .q-field__control) {
  background: #eef0f3 !important;
  border-radius: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.circle-icon {
  border-radius: 50%;
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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

.hover-text-primary:hover {
  color: var(--edulang-blue, #0089ff) !important;
}
</style>
