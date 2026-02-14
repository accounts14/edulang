<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="q-mb-xl">
      <div class="row items-center q-gutter-x-sm text-caption text-grey-6 q-mb-xs">
        <span>Dashboard</span>
        <q-icon name="chevron_right" />
        <span class="text-edulang-blue text-weight-bold">Pengaturan Profil</span>
      </div>
      <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">Setting Profile</h1>
      <p class="text-subtitle1 text-grey-7 q-mt-xs">
        Kelola informasi akun Anda dalam satu tempat.
      </p>
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-card flat class="content-card q-pa-lg">
          <div class="text-h6 text-edulang-navy text-weight-bold q-mb-lg flex items-center">
            <q-icon name="manage_accounts" color="primary" class="q-mr-sm" size="28px" />
            Informasi Personal
          </div>

          <q-form @submit.prevent="onSubmit">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <label class="label-custom">Username</label>
                <q-input
                  v-model="form.username"
                  outlined
                  dense
                  placeholder="Masukkan username"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Username wajib diisi']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <label class="label-custom">Alamat Email</label>
                <q-input
                  v-model="form.email"
                  outlined
                  dense
                  type="email"
                  placeholder="email@edulang.id"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Email wajib diisi']"
                />
              </div>

              <div class="col-12">
                <q-separator class="q-my-md opacity-50" />
                <div class="text-subtitle2 text-edulang-navy text-weight-bold q-mb-sm">
                  Keamanan
                </div>
              </div>

              <div class="col-12 col-sm-6">
                <label class="label-custom">Password Baru</label>
                <q-input
                  v-model="form.password"
                  outlined
                  dense
                  type="password"
                  placeholder="••••••••"
                  class="custom-input"
                  hint="Kosongkan jika tidak ingin mengubah"
                />
              </div>

              <div class="col-12 col-sm-6">
                <label class="label-custom">Konfirmasi Password</label>
                <q-input
                  v-model="form.confirmPassword"
                  outlined
                  dense
                  type="password"
                  placeholder="••••••••"
                  class="custom-input"
                  :rules="[
                    (val) => !form.password || val === form.password || 'Password tidak cocok',
                  ]"
                />
              </div>

              <div class="col-12 q-mt-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-btn
                      label="Simpan Perubahan"
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
                      :disable="submitting"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="support-card q-pa-lg text-white relative-position overflow-hidden">
          <q-icon name="help_outline" class="absolute-top-right q-ma-md opacity-20" size="100px" />

          <div class="row items-center q-mb-md">
            <q-avatar
              size="48px"
              font-size="24px"
              color="white"
              text-color="edulang-blue"
              icon="headset_mic"
            />
            <div class="q-ml-md">
              <div class="text-weight-bold text-h6">Butuh Bantuan?</div>
              <div class="text-caption opacity-80">Tim kami siap membantu kendala Anda.</div>
            </div>
          </div>

          <q-btn
            label="Hubungi Support"
            color="white"
            text-color="edulang-navy"
            no-caps
            unelevated
            class="full-width rounded-btn text-weight-bolder q-mt-md"
            icon="chat"
            :href="whatsappSupportLink"
          />
        </q-card>

        <q-card flat bordered class="content-card q-pa-md q-mt-lg">
          <div class="row items-center justify-between">
            <div class="text-weight-bold text-edulang-navy">Status Akun</div>
            <q-badge
              color="green-1"
              text-color="green-9"
              label="Aktif"
              class="q-pa-xs px-md text-weight-bold"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()

const submitting = ref(false)

const originalData = ref({
  username: '',
  email: '',
})

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const mentorId = ref(null)

function applyFromOriginal() {
  form.value.username = originalData.value.username
  form.value.email = originalData.value.email
  form.value.password = ''
  form.value.confirmPassword = ''
}

const whatsappSupportLink = computed(() => {
  // Ganti dengan nomor WA support Anda (format internasional)
  const phoneNumber = '6282279506450' // Contoh: +62 812-3456-7890
  return `https://wa.me/${phoneNumber}`
})

function resetForm() {
  applyFromOriginal()
}

async function fetchProfile() {
  try {
    const storedEmail = localStorage.getItem('userEmail') || ''
    let profile = null

    try {
      const resMe = await api.get('/mentors/me')
      const dataMe = resMe.data || {}
      profile = dataMe.mentor || dataMe.data || dataMe
    } catch {
      console.warn('[Mentor Setting] /mentors/me tidak tersedia, fallback ke /mentors')
    }

    if (!profile) {
      const res = await api.get('/mentors')
      const data = res.data || {}
      const list = data.mentors || data.data || []
      if (Array.isArray(list) && list.length > 0) {
        if (storedEmail) {
          profile =
            list.find((m) => String(m.email).toLowerCase() === storedEmail.toLowerCase()) || list[0]
        } else {
          profile = list[0]
        }
      }
    }

    if (!profile) return

    mentorId.value = profile._id || profile.id || null

    originalData.value = {
      username: profile.username || profile.name || '',
      email: profile.email || '',
    }

    applyFromOriginal()
  } catch (err) {
    console.error('[Mentor Setting] Gagal memuat profil mentor', err)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data profil mentor.',
    })
  }
}

async function onSubmit() {
  if (form.value.password && form.value.password !== form.value.confirmPassword) {
    $q.notify({
      type: 'negative',
      message: 'Konfirmasi password tidak cocok.',
    })
    return
  }

  try {
    submitting.value = true

    const payload = {
      username: form.value.username,
      email: form.value.email,
    }

    if (form.value.password) {
      payload.password = form.value.password
    }

    if (mentorId.value) {
      await api.put(`/mentors/${mentorId.value}`, payload)
    } else {
      await api.put('/mentors/me', payload)
    }

    $q.notify({
      type: 'positive',
      message: 'Profil mentor berhasil diperbarui.',
    })

    originalData.value = {
      username: form.value.username,
      email: form.value.email,
    }
    applyFromOriginal()
  } catch (err) {
    console.error('[Mentor Setting] Gagal menyimpan profil mentor', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal menyimpan perubahan profil.',
    })
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
/* Color Palette based on Brand Guideline */
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

/* Component Styling */
.content-card {
  border-radius: 20px;
  background: white;
  border: 1px solid #eef0f3;
  box-shadow: 0 4px 25px rgba(0, 51, 135, 0.05) !important;
}

.support-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #003387 0%, #0089ff 100%);
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
  transition: all 0.3s ease;
}

.custom-input :deep(.q-field--focused .q-field__control) {
  border-color: #0089ff !important;
}

.opacity-20 {
  opacity: 0.2;
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-80 {
  opacity: 0.8;
}
</style>
