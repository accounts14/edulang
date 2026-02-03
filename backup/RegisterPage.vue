<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="auth-card row no-wrap shadow-24">
          <div class="col-md-5 gt-sm relative-position bg-primary overflow-hidden">
             <q-img src="https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?ixlib=rb-4.0.3" class="full-height" />
            <div class="absolute-center full-width text-center text-white q-pa-md">
              <div class="text-h4 text-weight-bold">Edulang</div>
              <p>Mulai Karier Global Anda</p>
            </div>
          </div>

          <div class="col-12 col-md-7 q-pa-xl bg-white">
            <div class="column items-center q-mb-lg">
              <q-avatar size="60px" color="primary" text-color="white" icon="school" class="q-mb-md" />
              <h1 class="text-h5 text-weight-bolder q-ma-none">Create New Account</h1>
              <p class="text-grey-7 text-center q-mt-sm">Lengkapi form di bawah dengan data valid</p>
            </div>

            <q-form @submit="handleRegister" class="q-gutter-md">
              <q-input v-model="form.name" label="Nama Lengkap" filled rounded bg-color="grey-2" dense>
                <template v-slot:append><q-icon name="person" /></template>
              </q-input>

              <q-input v-model="form.email" label="Email Address" filled rounded bg-color="grey-2" dense>
                <template v-slot:append><q-icon name="email" /></template>
              </q-input>

              <q-input v-model="form.password" :type="isPwd ? 'password' : 'text'" label="Password" filled rounded bg-color="grey-2" dense>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <q-btn label="Continue" type="submit" color="primary" rounded unelevated class="full-width q-py-sm" :loading="loading" />
              
              <div class="text-center q-mt-md">
                Sudah punya akun? <span class="text-primary cursor-pointer text-weight-bold" @click="$router.push('/login')">Masuk</span>
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
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const isPwd = ref(true)
const loading = ref(false)
const form = ref({ name: '', email: '', password: '' })

const handleRegister = async () => {
  loading.value = true
  try {
    await api.post('/auth/register', form.value)
    $q.notify({ type: 'positive', message: 'Berhasil mendaftar!' })
    router.push('/login')
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Gagal mendaftar' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card { width: 100%; max-width: 900px; border-radius: 20px; overflow: hidden; }
.bg-primary { background-color: #003366 !important; }
</style>