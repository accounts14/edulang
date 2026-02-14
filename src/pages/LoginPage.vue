<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="auth-page-full row no-wrap">
        <!-- Left: Image -->
        <div class="auth-left gt-sm relative-position overflow-hidden">
          <q-img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
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

          <div class="auth-form-wrap">
            <div class="column items-center q-mb-lg">
              <div class="auth-logo-circle q-mb-md">
                <img src="~assets/LogoWhite.png" alt="Edulang" class="auth-logo-img" />
              </div>
              <h1 class="text-h4 text-weight-bolder q-ma-none text-dark">Sign In Now</h1>
              <p class="text-grey-7 text-center q-mt-sm">Masukkan data ke form sesuai dan valid</p>
            </div>

            <q-form @submit="handleLogin" class="q-gutter-y-sm">
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
                <label class="text-weight-bold text-caption q-ml-sm text-grey-9">Password :</label>
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

              <div class="text-right q-mt-xs">
    <span 
      class="auth-link cursor-pointer text-caption" 
      @click="$router.push('/forgot-password')"
    >
      Lupa Password?
    </span>
  </div>

              <q-btn
                label="Sign In"
                type="submit"
                class="auth-primary-btn full-width q-py-md text-weight-bold q-mt-lg"
                :loading="loading"
              />

              <div class="text-center q-mt-lg text-body2 auth-switch-text">
                Belum punya akun?
                <span
                  class="auth-link cursor-pointer text-weight-bold"
                  @click="$router.push('/register')"
                  >Daftar sekarang</span
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
    const token = res.data.token || res.data.data?.token
    const user = res.data.user || res.data.data?.user

    if (!token) {
      throw new Error('Token tidak ditemukan dalam respons API')
    }

    localStorage.setItem('token', token)
    localStorage.setItem('userRole', user?.role || 'user')
    localStorage.setItem('userName', user?.name || 'Pengguna')
    const userId = user?._id || user?.id || user?.userId
    if (userId) localStorage.setItem('userId', String(userId))
    if (user?.email) localStorage.setItem('userEmail', user.email)

    $q.notify({
      type: 'positive',
      message: `Selamat datang, ${user?.name || 'Pengguna'}!`,
    })

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
</style>
