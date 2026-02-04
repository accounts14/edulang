<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div class="text-h5 text-weight-bolder text-indigo-10">
      Edit Akun Pengguna
    </div>
    <div class="text-grey-7 q-mt-xs">
      Kelola data pengguna terdaftar
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else>
      <q-form class="q-mt-lg" @submit.prevent="handleSubmit">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Nama</div>
            <q-input
              v-model="form.name"
              dense
              outlined
              bg-color="white"
              placeholder="Nama lengkap"
              :rules="[v => !!v || 'Nama wajib diisi']"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Email</div>
            <q-input
              v-model="form.email"
              dense
              outlined
              type="email"
              bg-color="white"
              placeholder="email@contoh.com"
              :rules="[v => !!v || 'Email wajib diisi']"
            />
          </div>

          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Password (kosongkan jika tidak diubah)</div>
            <q-input
              v-model="form.password"
              dense
              outlined
              :type="showPassword ? 'text' : 'password'"
              bg-color="white"
              placeholder="Password baru"
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-grey-8 text-caption q-mb-xs">Role</div>
            <q-select
              v-model="form.role"
              dense
              outlined
              bg-color="white"
              :options="roleOptions"
              emit-value
              map-options
              placeholder="Pilih role"
              :rules="[v => !!v || 'Role wajib dipilih']"
            />
          </div>
        </div>

        <div class="q-mt-xl">
          <q-btn
            unelevated
            color="primary"
            label="Edit"
            no-caps
            class="q-px-lg q-mr-sm rounded-borders"
            type="submit"
            :loading="submitting"
            :disable="submitting"
          />
          <q-btn
            unelevated
            color="negative"
            label="Batal"
            no-caps
            class="q-px-lg rounded-borders"
            :disable="submitting"
            @click="handleCancel"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const submitting = ref(false)
const showPassword = ref(false)

const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Mentor', value: 'mentor' },
  { label: 'Admin', value: 'admin' }
]

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

function handleCancel () {
  router.push('/admin/pendaftar')
}

async function loadUser () {
  try {
    loading.value = true
    const res = await api.get(`/users/${route.params.id}`)
    const u = res.data?.user || res.data?.data || res.data
    if (!u) {
      $q.notify({ type: 'negative', message: 'User tidak ditemukan.' })
      handleCancel()
      return
    }
    form.name = u.name || ''
    form.email = u.email || ''
    form.role = u.role || 'user'
    form.password = ''
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal memuat data user.'
    })
    handleCancel()
  } finally {
    loading.value = false
  }
}

async function handleSubmit () {
  try {
    submitting.value = true
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role
    }
    if (form.password && form.password.trim()) {
      payload.password = form.password.trim()
    }
    await api.put(`/users/${route.params.id}`, payload)
    $q.notify({ type: 'positive', message: 'Akun pengguna berhasil diperbarui.', timeout: 1600 })
    router.push('/admin/pendaftar')
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal memperbarui akun pengguna.'
    })
  } finally {
    submitting.value = false
  }
}

onMounted(loadUser)
</script>

<style scoped>
.text-indigo-10 { color: #0d2a5c; }
</style>
