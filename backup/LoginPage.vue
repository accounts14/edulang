<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="auth-card row no-wrap shadow-24">
          <div class="col-md-5 gt-sm">
            <q-img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3" class="full-height" />
          </div>

          <div class="col-12 col-md-7 q-pa-xl bg-white">
            <div class="column items-center q-mb-lg">
              <q-avatar size="60px" color="primary" text-color="white" icon="lock" class="q-mb-md" />
              <h1 class="text-h5 text-weight-bolder q-ma-none">Sign In Now</h1>
              <p class="text-grey-7">Masukkan data ke form sesuai dan valid</p>
            </div>

            <q-form @submit="handleLogin" class="q-gutter-md">
              <q-input v-model="form.email" label="Email Address" filled rounded bg-color="grey-2" dense>
                <template v-slot:append><q-icon name="email" /></template>
              </q-input>

              <q-input v-model="form.password" :type="isPwd ? 'password' : 'text'" label="Password" filled rounded bg-color="grey-2" dense>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <q-btn label="Sign In" type="submit" color="primary" rounded unelevated class="full-width q-py-sm" :loading="loading" />
              <q-btn outline label="Create New Account" rounded color="grey-7" class="full-width" @click="$router.push('/register')" />
              
              <div class="row items-center q-my-md">
                <q-separator col /> <span class="q-px-sm text-grey-6">atau</span> <q-separator col />
              </div>

              <q-btn unelevated rounded class="full-width bg-dark text-white" no-caps>
                <img src="~assets/google-logo-search-new-svgrepo-com.svg" style="width: 18px; height: 18px;" class="q-mr-sm" />
                Masuk / Daftar
              </q-btn>
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
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const isPwd = ref(true)
const loading = ref(false)
const form = ref({ email: '', password: '' })

const handleLogin = async () => {
  loading.value = true
  try {
    const res = await api.post('/auth/login', form.value)
    localStorage.setItem('token', res.data.token)
    $q.notify({ type: 'positive', message: 'Selamat datang kembali!' })
    router.push('/')
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Login gagal' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card { width: 100%; max-width: 900px; border-radius: 20px; overflow: hidden; }
</style>