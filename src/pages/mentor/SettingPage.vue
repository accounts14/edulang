<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="q-mb-xl">
      <div class="row items-center q-gutter-x-sm text-caption text-grey-6 q-mb-xs">
        <span>Dashboard</span>
        <q-icon name="chevron_right" />
        <span class="text-edulang-blue text-weight-bold">Pengaturan Profil</span>
      </div>
      <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">Setting Profile</h1>
      <p class="text-subtitle1 text-grey-7 q-mt-xs">Kelola keamanan akun Anda dalam satu tempat.</p>
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-card flat class="content-card q-pa-lg">
          <div class="text-h6 text-edulang-navy text-weight-bold q-mb-lg flex items-center">
            <q-icon name="lock_reset" color="primary" class="q-mr-sm" size="28px" />
            Ganti Password
          </div>

          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <label class="label-custom">Username</label>
                <q-input
                  v-model="form.username"
                  outlined
                  dense
                  readonly
                  disable
                  class="custom-input bg-grey-2"
                />
              </div>
              <div class="col-12 col-sm-6">
                <label class="label-custom">Alamat Email</label>
                <q-input
                  v-model="form.email"
                  outlined
                  dense
                  readonly
                  disable
                  class="custom-input bg-grey-2"
                />
              </div>

              <div class="col-12"><q-separator class="q-my-md opacity-50" /></div>

              <div class="col-12">
                <label class="label-custom">Password Saat Ini</label>
                <q-input
                  v-model="form.currentPassword"
                  outlined
                  dense
                  :type="isPwdOld ? 'password' : 'text'"
                  placeholder="Masukkan password lama"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Password lama wajib diisi']"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwdOld ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwdOld = !isPwdOld"
                    />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <label class="label-custom">Password Baru</label>
                <q-input
                  v-model="form.password"
                  outlined
                  dense
                  :type="isPwdNew ? 'password' : 'text'"
                  placeholder="••••••••"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Password baru wajib diisi']"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwdNew ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwdNew = !isPwdNew"
                    />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <label class="label-custom">Konfirmasi Password Baru</label>
                <q-input
                  v-model="form.confirmPassword"
                  outlined
                  dense
                  :type="isPwdConfirm ? 'password' : 'text'"
                  placeholder="••••••••"
                  class="custom-input"
                  :rules="[
                    (val) => !!val || 'Konfirmasi password wajib diisi',
                    (val) => val === form.password || 'Password tidak cocok',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwdConfirm = !isPwdConfirm"
                    />
                  </template>
                </q-input>
              </div>

              <div class="col-12 q-mt-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-btn
                      label="Perbarui Password"
                      unelevated
                      no-caps
                      class="full-width rounded-btn btn-edulang-primary shadow-2 text-weight-bold"
                      type="submit"
                      padding="12px"
                      :loading="submitting"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-btn
                      label="Batal"
                      flat
                      no-caps
                      color="grey-7"
                      class="full-width rounded-btn border-light"
                      padding="12px"
                      @click="resetForm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const submitting = ref(false)

// State untuk toggle visibility password (mata)
const isPwdOld = ref(true)
const isPwdNew = ref(true)
const isPwdConfirm = ref(true)

const form = ref({
  username: '',
  email: '',
  currentPassword: '',
  password: '',
  confirmPassword: '',
})

/**
 * Fungsi mengambil ID dari sessionStorage (Data dihapus saat tab ditutup)
 */
function getMentorIdFromSession() {
  try {
    const token = LocalStorage.getItem('token') // Pastikan saat login, Anda pakai sessionStorage.setItem('token', ...)
    if (!token) return null

    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))

    return payload.id || payload._id || payload.sub
  } catch (e) {
    console.error('Error parsing session token:', e)
    return null
  }
}

async function fetchProfile() {
  // Hanya untuk menampilkan data username/email saja
  try {
    const res = await api.get('/mentors/me')
    const data = res.data.mentor || res.data.data || res.data
    form.value.username = data.username || data.name
    form.value.email = data.email
  } catch {
    console.warn('Gagal memuat info profil')
  }
}

function resetForm() {
  form.value.currentPassword = ''
  form.value.password = ''
  form.value.confirmPassword = ''
}

async function onSubmit() {
  const mentorId = getMentorIdFromSession()

  if (!mentorId) {
    $q.notify({ type: 'negative', message: 'Sesi habis. Silakan login kembali.' })
    return
  }

  try {
    submitting.value = true

    // Payload sesuai dokumentasi PUT /api/mentors/:id/change-password
    const payload = {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.password,
    }

    await api.put(`/mentors/${mentorId}/change-password`, payload)

    $q.notify({
      type: 'positive',
      message: 'Password berhasil diubah!',
      icon: 'done',
    })
    resetForm()
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal mengubah password.',
    })
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.btn-edulang-primary {
  background-color: #003387;
  color: white;
  transition: 0.3s;
}
.btn-edulang-primary:hover {
  background-color: #0089ff;
}
.content-card {
  border-radius: 20px;
  background: white;
  border: 1px solid #eef0f3;
  box-shadow: 0 4px 25px rgba(0, 51, 135, 0.05) !important;
}
.rounded-btn {
  border-radius: 12px;
}
.border-light {
  border: 1px solid #e0e0e0;
}
.label-custom {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #003387;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.custom-input :deep(.q-field__control) {
  border-radius: 12px;
}
</style>
