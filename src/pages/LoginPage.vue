<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="auth-card row no-wrap shadow-24">
          <div class="col-md-5 gt-sm relative-position bg-primary overflow-hidden">
            <q-img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
              class="full-height"
              fit="cover"
            />
            <div
              class="absolute-center full-width text-center text-white q-pa-md"
              style="background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(2px)"
            >
              <div class="text-h3 text-weight-bold">Edulang</div>
              <p class="text-subtitle1 q-mt-sm">Masuk untuk Melanjutkan</p>
            </div>
          </div>

          <div class="col-12 col-md-7 q-pa-xl bg-white">
            <div class="column items-center q-mb-lg">
              <q-avatar
                size="60px"
                color="blue-1"
                text-color="primary"
                icon="lock_open"
                class="q-mb-md shadow-1"
              />
              <h1 class="text-h5 text-weight-bolder q-ma-none text-dark">Sign In Now</h1>
              <p class="text-grey-7 text-center q-mt-sm">Masukkan data ke form sesuai dan valid</p>
            </div>

            <q-form @submit="handleLogin" class="q-gutter-y-sm">
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
                <div class="row justify-between items-center">
                  <label class="text-weight-bold text-caption q-ml-sm text-grey-9">Password</label>
                  <span class="text-caption text-primary cursor-pointer text-weight-medium"
                    >Lupa Password?</span
                  >
                </div>
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
                label="Sign In"
                type="submit"
                color="primary"
                rounded
                unelevated
                class="full-width q-py-md text-weight-bold q-mt-md shadow-3"
                :loading="loading"
              />

              <div class="text-center q-mt-xl text-body2">
                Belum punya akun?
                <span
                  class="text-primary cursor-pointer text-weight-bold hover-underline"
                  @click="$router.push('/register')"
                  >Daftar sekarang</span
                >
              </div>
            </q-form>
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
import { useRouter, useRoute } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const isPwd = ref(true)
const loading = ref(false)
const form = ref({ email: '', password: '' })

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    $q.notify({
      type: 'warning',
      message: 'Email dan Password wajib diisi!',
    })
    return
  }

  loading.value = true
  try {
    const res = await api.post('/auth/login', form.value)

    console.log('[LOGIN RESP]', res.data) // 👈 DEBUG: Lihat struktur nyata

    // Ambil token dan user dengan safe access
    const token = res.data.token || res.data.data?.token
    const user = res.data.user || res.data.data?.user

    if (!token) {
      throw new Error('Token tidak ditemukan dalam respons API')
    }

    // Simpan ke localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('userRole', user?.role || 'user')
    localStorage.setItem('userName', user?.name || 'Pengguna')
    // Simpan juga id & email untuk kebutuhan filter data per-mentor
    const userId = user?._id || user?.id || user?.userId
    if (userId) {
      localStorage.setItem('userId', String(userId))
    }
    if (user?.email) {
      localStorage.setItem('userEmail', user.email)
    }

    $q.notify({
      type: 'positive',
      message: `Selamat datang, ${user?.name || 'Pengguna'}!`,
    })

    // Redirect berdasarkan role atau redirect URL jika disediakan
    const role = user?.role || 'user'
    const redirect = route.query.redirect

    if (redirect) {
      router.push(String(redirect))
    } else if (role === 'admin') {
      router.push('/admin/dashboard')
    } else if (role === 'mentor') {
      router.push('/mentor/dashboard')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('[LOGIN ERROR]', error.response?.data || error.message)

    let msg = 'Login gagal. Cek email/password.'
    if (error.response?.status === 400) {
      msg = error.response.data?.message || 'Data login tidak valid.'
    } else if (error.response?.status === 401) {
      msg = 'Autentikasi gagal. Token salah atau kadaluarsa.'
    } else if (error.code === 'ERR_NETWORK') {
      msg = 'Koneksi jaringan bermasalah.'
    }

    $q.notify({ type: 'negative', message: msg })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 1000px;
  height: 90vh;
  max-height: 700px;
  border-radius: 24px;
  overflow: hidden;
}

.bg-primary {
  background-color: #003366 !important;
}

/* Custom Input Styling agar match dengan RegisterPage */
:deep(.q-field--filled .q-field__control) {
  background: #f5f6f8 !important;
  border-radius: 12px;
}
:deep(.q-field--filled .q-field__control:hover) {
  background: #eef0f3 !important;
}

.hover-underline:hover {
  text-decoration: underline;
}
</style>
