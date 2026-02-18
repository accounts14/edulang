<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="auth-page-full row no-wrap">
        <div class="auth-left gt-sm relative-position overflow-hidden">
          <q-img
            src="https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/965ca6cd-7bde-416e-b3af-e6b2ee975ed6.png"
            class="full-height full-width"
            fit="cover"
          />
        </div>

        <div class="auth-right flex flex-center column q-pa-xl">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            class="auth-back-btn"
            aria-label="Kembali"
            @click="$router.push('/login')"
          />

          <div class="auth-form-wrap">
            <div class="column items-center q-mb-lg">
              <div class="auth-logo-circle q-mb-md">
                <img src="~assets/LogoWhite.png" alt="Edulang" class="auth-logo-img" />
              </div>
              <h1 class="text-h4 text-weight-bolder q-ma-none text-dark text-center">
                Forgot Password
              </h1>
              <p class="text-grey-7 text-center q-mt-sm">
                Masukkan email Anda untuk menerima token reset password
              </p>
            </div>

            <q-form @submit="handleForgot" class="q-gutter-y-sm">
              <div class="field-wrapper">
                <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                  >Email Address :</label
                >
                <q-input
                  v-model="email"
                  placeholder="Example@gmail.com"
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

              <q-btn
                label="Send Reset Token"
                type="submit"
                class="auth-primary-btn full-width q-py-md text-weight-bold q-mt-lg"
                :loading="loading"
              />

              <div class="text-center q-mt-lg text-body2 auth-switch-text">
                Ingat password Anda?
                <span
                  class="auth-link cursor-pointer text-weight-bold"
                  @click="$router.push('/login')"
                  >Kembali Login</span
                >
              </div>
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const email = ref('')
const loading = ref(false)

const handleForgot = async () => {
  if (!email.value) {
    $q.notify({ type: 'warning', message: 'Email wajib diisi!' })
    return
  }

  loading.value = true
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    $q.notify({
      type: 'positive',
      message: 'Token berhasil dikirim! Silakan cek email Anda.',
    })
    // Pindah ke halaman input token & password baru
    router.push('/reset-password')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal mengirim permintaan.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Copas style dari LoginPage Anda ke sini atau gunakan file eksternal */
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
  background: #f5f7fa;
  position: relative;
}
.auth-back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  color: #2d2d2d !important;
}
.auth-form-wrap {
  width: 100%;
  max-width: 420px;
}
.auth-logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #003387;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.auth-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.auth-primary-btn {
  background: #003387 !important;
  color: white !important;
  border-radius: 12px;
}
.auth-link {
  color: #0089ff !important;
  text-decoration: underline;
}
:deep(.auth-input .q-field--filled .q-field__control) {
  background: #eef0f3 !important;
  border-radius: 12px;
}
</style>
