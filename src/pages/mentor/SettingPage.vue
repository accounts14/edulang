<template>
  <q-page class="q-pa-lg bg-blue-1">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 q-mb-xs">
        Dashboard /
        <span class="text-primary text-weight-medium">Setting</span>
      </div>
      <div class="text-h4 text-weight-bolder text-indigo-10">Setting Profile</div>
      <div class="text-grey-7 q-mt-xs">
        Perbarui data akun mentor dan informasi pembayaranmu.
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Form Edit Profile -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-xl">
          <div class="text-subtitle1 text-weight-bolder text-indigo-10 q-mb-xl">
            Edit Profile
          </div>

          <q-form @submit.prevent="onSubmit">
            <div class="q-gutter-md">
              <q-input
                v-model="form.username"
                outlined
                dense
                label="Username"
                placeholder="Username : contoh User123"
                :rules="[(val) => !!val || 'Username wajib diisi']"
              />

              <q-input
                v-model="form.email"
                outlined
                dense
                type="email"
                label="Email"
                placeholder="Email : contoh Edulang@gmail.com"
                :rules="[(val) => !!val || 'Email wajib diisi']"
              />

              <q-input
                v-model="form.password"
                outlined
                dense
                type="password"
                label="Password"
                placeholder="Password"
                hint="Kosongkan jika tidak ingin mengubah password"
              />

              <q-input
                v-model="form.confirmPassword"
                outlined
                dense
                type="password"
                label="Confirm Password"
                placeholder="Confirm Password"
                :rules="[
                  (val) => !form.password || val === form.password || 'Konfirmasi password tidak cocok',
                ]"
              />

              <q-input
                v-model="form.bankAccount"
                outlined
                dense
                label="Virtual Bank Account"
                placeholder="Virtual Bank Account"
              />

              <div class="row q-mt-lg">
                <div class="col-12 col-sm-6 q-pr-sm q-mb-sm">
                  <q-btn
                    label="Edit Profile"
                    unelevated
                    no-caps
                    color="primary"
                    class="full-width"
                    type="submit"
                    :loading="submitting"
                  />
                </div>
                <div class="col-12 col-sm-6 q-pl-sm q-mb-sm">
                  <q-btn
                    label="Batal"
                    unelevated
                    no-caps
                    color="negative"
                    class="full-width"
                    flat
                    @click="resetForm"
                    :disable="submitting"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-card>
      </div>

      <!-- Contact Card -->
      <div class="col-12 col-md-4">
        <q-card
          flat
          class="rounded-borders-16 q-pa-lg text-white contact-card"
        >
          <div class="row items-center q-mb-md">
            <q-avatar icon="phone" color="white" text-color="primary" />
            <div class="q-ml-md">
              <div class="text-caption">Hubungi Jika Mengalami Kendala</div>
            </div>
          </div>
          <q-btn
            label="Contact Us"
            color="amber-8"
            text-color="black"
            no-caps
            unelevated
            class="q-mt-lg full-width"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()

const submitting = ref(false)

const originalData = ref({
  username: '',
  email: '',
  bankAccount: '',
})

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  bankAccount: '',
})

const mentorId = ref(null)

function applyFromOriginal() {
  form.value.username = originalData.value.username
  form.value.email = originalData.value.email
  form.value.bankAccount = originalData.value.bankAccount
  form.value.password = ''
  form.value.confirmPassword = ''
}

function resetForm() {
  applyFromOriginal()
}

async function fetchProfile() {
  try {
    // Coba ambil dari endpoint khusus profil mentor jika tersedia
    // Fallback: ambil dari /mentors dan filter berdasarkan email di localStorage
    const storedEmail = localStorage.getItem('userEmail') || ''

    let profile = null

    try {
      const resMe = await api.get('/mentors/me')
      const dataMe = resMe.data || {}
      profile = dataMe.mentor || dataMe.data || dataMe
    } catch (err) {
      console.warn('[Mentor Setting] /mentors/me tidak tersedia, fallback ke /mentors', err?.response?.status)
    }

    if (!profile) {
      const res = await api.get('/mentors')
      const data = res.data || {}
      const list = data.mentors || data.data || []
      if (Array.isArray(list) && list.length > 0) {
        if (storedEmail) {
          profile =
            list.find((m) => String(m.email).toLowerCase() === storedEmail.toLowerCase()) ||
            list[0]
        } else {
          profile = list[0]
        }
      }
    }

    if (!profile) {
      return
    }

    mentorId.value = profile._id || profile.id || null

    originalData.value = {
      username: profile.username || profile.name || '',
      email: profile.email || '',
      bankAccount:
        profile.virtualBankAccount ||
        profile.bankAccount ||
        profile.virtual_account ||
        '',
    }

    applyFromOriginal()
  } catch (err) {
    console.error('[Mentor Setting] Gagal memuat profil mentor', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal memuat data profil mentor.',
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
      virtualBankAccount: form.value.bankAccount,
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
      bankAccount: form.value.bankAccount,
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
.rounded-borders-16 {
  border-radius: 16px;
}

.contact-card {
  background: linear-gradient(135deg, #0d47a1, #1565c0);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

