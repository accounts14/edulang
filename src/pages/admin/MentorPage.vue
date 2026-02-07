<template>
  <q-page class="q-pa-xl bg-accent">
    <div class="q-mb-xl">
      <div class="text-h4 text-weight-bolder text-indigo-10">Kelola Akun Mentor</div>
      <div class="text-subtitle1 text-grey-7">Tempat Pengelolaan Akun Mentor</div>
    </div>

    <q-card flat class="rounded-borders-lg shadow-1 q-pa-lg bg-white">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6 text-weight-bolder">Verifikasi Calon Mentor</div>
        <div class="row items-center q-gutter-sm">
          <q-input
            v-model="searchMentor"
            dense
            outlined
            placeholder="Cari Mentor"
            bg-color="white"
            clearable
            class="search-input"
            style="min-width: 220px"
            @keyup.enter="applySearch"
          />
          <q-btn
            unelevated
            color="amber-8"
            no-caps
            label="Search"
            icon="search"
            @click="applySearch"
          />
        </div>
      </div>

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="filteredMentors.length === 0" class="text-center q-pa-xl text-grey-7">
        {{
          searchMentor ? 'Tidak ada mentor yang cocok dengan pencarian.' : 'Belum ada data mentor.'
        }}
      </div>

      <q-table
        v-else
        :rows="filteredMentors"
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
        <template #body-cell-status="props">
          <q-td>
            <q-chip v-if="isVerified(props.row)" dense color="green-6" text-color="white" size="sm">
              Terverifikasi
            </q-chip>
            <q-chip v-else dense color="grey-5" text-color="white" size="sm">
              Belum verifikasi
            </q-chip>
          </q-td>
        </template>
        <template #body-cell-aksi="props">
          <q-td>
            <q-btn
              unelevated
              no-caps
              color="primary"
              size="sm"
              class="q-mr-sm"
              label="Konfirmasi"
              :disable="isVerified(props.row)"
              :loading="confirmingId === props.row._id"
              @click="confirmMentor(props.row)"
            />
            <q-btn
              unelevated
              no-caps
              outline
              color="grey-7"
              size="sm"
              label="Hapus"
              :loading="deletingId === props.row._id"
              @click="confirmDelete(props.row)"
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
import { api } from 'src/boot/axios'

const $q = useQuasar()
const loading = ref(true)
const mentors = ref([])
const searchMentor = ref('')
const confirmingId = ref(null)
const deletingId = ref(null)

const filteredMentors = computed(() => {
  const q = (searchMentor.value || '').trim().toLowerCase()
  if (!q) return mentors.value
  return mentors.value.filter((m) => {
    const name = (m.name || '').toLowerCase()
    const email = (m.email || '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })
})

function applySearch() {
  // Filter is reactive via filteredMentors; button can trigger refocus or future API call
}

const columns = [
  { name: 'nama', label: 'Nama', field: 'name', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'password', label: 'Password', align: 'left' },
  { name: 'status', label: 'Status', align: 'center' },
  { name: 'aksi', label: 'Aksi', align: 'center' },
]

function isVerified(row) {
  return row.isVerified === true || (row.verifiedAt != null && row.verifiedAt !== '')
}

async function fetchMentors() {
  try {
    loading.value = true
    const res = await api.get('/mentors')
    const data = res.data || {}
    const list = data.mentors || data.data || []
    mentors.value = Array.isArray(list) ? list : []
  } catch (err) {
    console.error('[Admin Mentor]', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal memuat data mentor.',
    })
  } finally {
    loading.value = false
  }
}

function confirmMentor(row) {
  if (isVerified(row)) return
  const id = row._id || row.id
  if (!id) return

  $q.dialog({
    title: 'Konfirmasi Mentor',
    message: `Yakin ingin mengonfirmasi akun mentor "${row.name || row.email}"?`,
    ok: { label: 'Konfirmasi', color: 'primary', unelevated: true },
    cancel: { label: 'Batal', flat: true },
  }).onOk(async () => {
    try {
      confirmingId.value = id
      await api.put(`/mentors/${id}`, { ...row, isVerified: true })
      $q.notify({ type: 'positive', message: 'Akun mentor berhasil dikonfirmasi.' })
      await fetchMentors()
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: err.response?.data?.message || 'Gagal mengonfirmasi mentor.',
      })
    } finally {
      confirmingId.value = null
    }
  })
}

function confirmDelete(row) {
  const id = row._id || row.id
  if (!id) return

  $q.dialog({
    title: 'Hapus Akun Mentor',
    message: `Yakin ingin menghapus akun mentor "${row.name || row.email}"?`,
    ok: { label: 'Hapus', color: 'negative', unelevated: true },
    cancel: { label: 'Batal', flat: true },
  }).onOk(async () => {
    try {
      deletingId.value = id
      await api.delete(`/mentors/${id}`)
      $q.notify({ type: 'positive', message: 'Akun mentor berhasil dihapus.' })
      await fetchMentors()
    } catch (err) {
      $q.notify({
        type: 'negative',
        message: err.response?.data?.message || 'Gagal menghapus mentor.',
      })
    } finally {
      deletingId.value = null
    }
  })
}

onMounted(fetchMentors)
</script>

<style scoped>
.rounded-borders-lg {
  border-radius: 24px;
}
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
