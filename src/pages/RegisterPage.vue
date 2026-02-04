<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="auth-card row no-wrap shadow-24">
          <div class="col-md-5 gt-sm relative-position bg-primary overflow-hidden">
            <q-img
              src="https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?ixlib=rb-4.0.3"
              class="full-height"
              fit="cover"
            />
            <div
              class="absolute-center full-width text-center text-white q-pa-md"
              style="background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(2px)"
            >
              <div class="text-h3 text-weight-bold">Edulang</div>
              <p class="text-subtitle1 q-mt-sm">Mulai Karier Global Anda</p>
            </div>
          </div>

          <div class="col-12 col-md-7 q-pa-xl bg-white relative-position">
            <transition name="fade" mode="out-in">
              <div v-if="!isRegisterSuccess" key="form-register">
                <div class="column items-center q-mb-lg">
                  <q-avatar
                    size="60px"
                    color="blue-1"
                    text-color="primary"
                    icon="school"
                    class="q-mb-md shadow-1"
                  />
                  <h1 class="text-h5 text-weight-bolder q-ma-none text-dark">Create New Account</h1>
                  <p class="text-grey-7 text-center q-mt-sm">
                    Lengkapi form di bawah dengan data valid
                  </p>
                </div>

                <q-form @submit="handleRegister" class="q-gutter-y-md">
                  <div class="field-wrapper">
                    <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                      >Nama Lengkap</label
                    >
                    <q-input
                      v-model="form.name"
                      placeholder="John Doe"
                      filled
                      rounded
                      bg-color="grey-2"
                      dense
                      borderless
                      class="q-mt-xs"
                    >
                      <template v-slot:append
                        ><q-icon name="person_outline" size="xs" color="grey-7"
                      /></template>
                    </q-input>
                  </div>

                  <div class="field-wrapper">
                    <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                      >Email Address</label
                    >
                    <q-input
                      v-model="form.email"
                      placeholder="example@email.com"
                      filled
                      rounded
                      bg-color="grey-2"
                      dense
                      borderless
                      class="q-mt-xs"
                    >
                      <template v-slot:append
                        ><q-icon name="mail_outline" size="xs" color="grey-7"
                      /></template>
                    </q-input>
                  </div>

                  <div class="field-wrapper">
                    <label class="text-weight-bold text-caption q-ml-sm text-grey-9"
                      >Password</label
                    >
                    <q-input
                      v-model="form.password"
                      :type="isPwd ? 'password' : 'text'"
                      placeholder="••••••••"
                      filled
                      rounded
                      bg-color="grey-2"
                      dense
                      borderless
                      class="q-mt-xs"
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
                    color="primary"
                    rounded
                    unelevated
                    class="full-width q-py-md text-weight-bold q-mt-lg shadow-3"
                    :loading="loading"
                  />

                  <div class="text-center q-mt-lg text-body2">
                    Sudah punya akun?
                    <span
                      class="text-primary cursor-pointer text-weight-bold hover-underline"
                      @click="$router.push('/login')"
                      >Masuk sekarang</span
                    >
                  </div>
                </q-form>
              </div>

              <div
                v-else
                key="success-message"
                class="flex flex-center full-height column text-center animate-pop"
              >
                <div class="bg-green-1 q-pa-lg rounded-borders circle-icon q-mb-lg">
                  <q-icon name="mark_email_read" color="green-6" size="80px" />
                </div>

                <h2 class="text-h4 text-weight-bold text-dark q-mb-sm">Cek Email Anda!</h2>

                <p
                  class="text-grey-7 text-body1 q-px-md"
                  style="max-width: 400px; line-height: 1.6"
                >
                  Kami telah mengirimkan tautan verifikasi ke
                  <span class="text-weight-bold text-dark">{{ form.email }}</span
                  >. <br />Silakan cek kotak masuk (inbox) atau folder spam Anda.
                </p>

                <div class="q-mt-xl full-width" style="max-width: 300px">
                  <q-btn
                    unelevated
                    rounded
                    color="primary"
                    label="Kembali ke Login"
                    class="full-width q-py-md text-weight-bold"
                    @click="$router.push('/login')"
                  />

                  <div class="q-mt-md text-caption text-grey-6 cursor-pointer hover-text-primary">
                    Tidak menerima email? <span class="text-weight-bold">Kirim ulang</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
// import { useRouter } dihapus karena kita pakai $router langsung di template

const $q = useQuasar()
// const router dihapus karena tidak dipakai di logic script
const isPwd = ref(true)
const loading = ref(false)
const isRegisterSuccess = ref(false)

const form = ref({ name: '', email: '', password: '' })

const handleRegister = async () => {
  loading.value = true
  try {
    // FIX: Menggunakan 'api' sungguhan (Error 'api defined never used' akan hilang)
    await api.post('/auth/register', form.value)

    // Jika sukses, ubah tampilan
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
.auth-card {
  width: 100%;
  max-width: 1000px;
  height: 90vh; /* Agar tampilan konsisten tinggi */
  max-height: 700px;
  border-radius: 24px;
  overflow: hidden;
}

/* Custom Input Styling */
:deep(.q-field--filled .q-field__control) {
  background: #f5f6f8 !important;
  border-radius: 12px;
}
:deep(.q-field--filled .q-field__control:hover) {
  background: #eef0f3 !important;
}

/* Transisi Fade Out-In */
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

/* Styling Khusus Halaman Sukses */
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

.hover-underline:hover {
  text-decoration: underline;
}

.hover-text-primary:hover {
  color: #1976d2 !important; /* Warna primary */
}
</style>
