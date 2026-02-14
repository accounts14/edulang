<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="auth-page-full row no-wrap">
        <div class="auth-left gt-sm relative-position overflow-hidden">
          <q-img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
            class="full-height full-width"
            fit="cover"
          />
        </div>

        <div class="auth-right flex flex-center column q-pa-xl">
          <div class="auth-form-wrap">
            <div class="column items-center q-mb-lg">
              <div class="auth-logo-circle q-mb-md">
                <img src="~assets/LogoWhite.png" alt="Edulang" class="auth-logo-img" />
              </div>
              <h1 class="text-h4 text-weight-bolder q-ma-none text-dark text-center">
                Reset Password
              </h1>
              <p class="text-grey-7 text-center q-mt-sm">Buat password baru Anda sekarang</p>
            </div>

            <q-form @submit="handleReset" class="q-gutter-y-sm">
              <div class="field-wrapper">
                <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                  >Token Reset :</label
                >
                <q-input
                  v-model="form.token"
                  placeholder="Masukkan token dari email"
                  filled
                  rounded
                  bg-color="grey-2"
                  dense
                  borderless
                  class="q-mt-xs auth-input"
                >
                  <template v-slot:append>
                    <q-icon name="vpn_key" size="xs" color="grey-7" />
                  </template>
                </q-input>
              </div>

              <div class="field-wrapper">
                <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                  >Password Baru :</label
                >
                <q-input
                  v-model="form.newPassword"
                  :type="isPwd ? 'password' : 'text'"
                  placeholder="Password baru"
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
                label="Update Password"
                type="submit"
                class="auth-primary-btn full-width q-py-md text-weight-bold q-mt-lg"
                :loading="loading"
              />
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
const isPwd = ref(true)
const loading = ref(false)
const form = ref({
  token: '',
  newPassword: '',
})

const handleReset = async () => {
  if (!form.value.token || !form.value.newPassword) {
    $q.notify({ type: 'warning', message: 'Semua field harus diisi!' })
    return
  }

  loading.value = true
  try {
    await api.post('/auth/reset-password', form.value)
    $q.notify({
      type: 'positive',
      message: 'Password berhasil diubah! Silakan login kembali.',
    })
    router.push('/login')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal mereset password.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Gunakan style yang sama dengan di atas */
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
:deep(.auth-input .q-field--filled .q-field__control) {
  background: #eef0f3 !important;
  border-radius: 12px;
}
</style>
