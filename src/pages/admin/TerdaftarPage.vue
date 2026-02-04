<template>
  <q-page class="q-pa-xl bg-blue-1">
    <div class="q-mb-xl">
      <div class="text-h4 text-weight-bolder text-indigo-10">Kelola Akun Pengguna</div>
      <div class="text-subtitle1 text-grey-7">Tempat Pengelolaan Akun Pengguna</div>
    </div>

    <div class="row items-center q-mb-md">
      <q-input
        v-model="searchUser"
        dense
        outlined
        placeholder="Cari User"
        bg-color="white"
        clearable
        style="min-width: 280px"
        @keyup.enter="applySearch"
      />
      <q-btn
        unelevated
        color="amber-8"
        no-caps
        label="Search"
        icon="search"
        class="q-ml-sm"
        @click="applySearch"
      />
    </div>

    <q-card flat class="rounded-borders-lg shadow-1 q-pa-lg bg-white">
      <div class="text-h6 text-weight-bolder q-mb-md">User Terdaftar</div>

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="filteredUsers.length === 0" class="text-center q-pa-xl">
        <p class="text-grey-7">
          {{ searchUser ? 'Tidak ada user yang cocok dengan pencarian.' : 'Belum ada data pengguna terdaftar.' }}
        </p>
        <p v-if="endpointUnavailable" class="text-amber-9 text-caption q-mt-sm">
          Endpoint GET /api/users belum tersedia di backend. Tambahkan endpoint tersebut agar data user dapat dimuat.
        </p>
      </div>

      <q-table
        v-else
        :rows="filteredUsers"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        class="rounded-borders"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template #body-cell-nama="props">
          <q-td>{{ props.row.name || '-' }}</q-td>
        </template>
        <template #body-cell-email="props">
          <q-td>{{ props.row.email || '-' }}</q-td>
        </template>
        <template #body-cell-password>
          <q-td>
            <span class="text-grey-6">••••••••</span>
          </q-td>
        </template>
        <template #body-cell-aksi="props">
          <q-td>
            <q-btn
              unelevated
              no-caps
              outline
              color="primary"
              size="sm"
              class="q-mr-sm"
              label="Hapus"
              :loading="deletingId === (props.row._id || props.row.id)"
              @click="confirmDelete(props.row)"
            />
            <q-btn
              unelevated
              no-caps
              outline
              color="primary"
              size="sm"
              label="Edit"
              @click="goEdit(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const loading = ref(true)
const users = ref([])
const searchUser = ref('')
const deletingId = ref(null)
const endpointUnavailable = ref(false)

const columns = [
  { name: 'nama', label: 'Nama', field: 'name', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'password', label: 'Password', align: 'left' },
  { name: 'aksi', label: 'Aksi', align: 'center' }
]

const filteredUsers = computed(() => {
  const q = (searchUser.value || '').trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((u) => {
    const name = (u.name || '').toLowerCase()
    const email = (u.email || '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })
})

function applySearch () {}

function goEdit (row) {
  const id = row._id || row.id
  if (id) router.push(`/admin/pendaftar/${id}/edit`)
}

function confirmDelete (row) {
  const id = row._id || row.id
  if (!id) return

  $q.dialog({
    title: 'Hapus Akun Pengguna',
    message: `Yakin ingin menghapus akun "${row.name || row.email}"?`,
    ok: { label: 'Hapus', color: 'negative', unelevated: true },
    cancel: { label: 'Batal', flat: true }
  }).onOk(async () => {
    try {
      deletingId.value = id
      await api.delete(`/users/${id}`)
      $q.notify({ type: 'positive', message: 'Akun pengguna berhasil dihapus.' })
      await fetchUsers()
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: err.response?.data?.message || 'Gagal menghapus akun pengguna.'
      })
    } finally {
      deletingId.value = null
    }
  })
}

async function fetchUsers () {
  endpointUnavailable.value = false
  try {
    loading.value = true
    const res = await api.get('/users')
    const data = res.data || {}
    const list = data.users || data.data || []
    users.value = Array.isArray(list) ? list : []
  } catch (err) {
    users.value = []
    if (err.response?.status === 404) {
      endpointUnavailable.value = true
    } else {
      $q.notify({
        type: 'negative',
        message: err.response?.data?.message || 'Gagal memuat data pengguna.'
      })
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.rounded-borders-lg { border-radius: 24px; }
.text-indigo-10 { color: #0d2a5c; }
</style>
