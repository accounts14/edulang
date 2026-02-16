<template>
  <q-page class="q-pa-md q-pa-sm-xl bg-edulang-white">
    <div class="max-width-container mx-auto">
      <div class="row items-center justify-between q-mb-xl">
        <div class="col-12 col-md-auto q-mb-md q-md-mb-none">
          <div class="text-h4 text-weight-bolder text-edulang-navy font-outfit q-mb-xs">
            Kelola Akun Mentor
          </div>
          <div class="text-subtitle1 text-grey-7">
            Pusat verifikasi dan manajemen data instruktur Edulang
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-input
                v-model="searchMentor"
                dense
                outlined
                placeholder="Cari mentor..."
                bg-color="white"
                clearable
                class="rounded-12 custom-input"
                style="min-width: 260px"
                @keyup.enter="applySearch"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="grey-5" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>

      <q-card flat class="rounded-24 shadow-brand bg-white border-subtle overflow-hidden">
        <div class="bg-edulang-blue" style="height: 6px"></div>

        <q-card-section class="q-pa-lg">
          <div class="row items-center q-mb-lg">
            <q-avatar
              color="edulang-blue-light"
              text-color="edulang-blue"
              icon="verified_user"
              size="md"
              class="q-mr-sm"
            />
            <div class="text-h6 text-weight-bold text-edulang-navy font-outfit">
              Status Verifikasi Mentor
            </div>
          </div>

          <div v-if="loading" class="text-center q-pa-xl">
            <q-spinner-dots color="edulang-blue" size="40px" />
            <div class="text-grey-6 q-mt-md">Memuat data mentor...</div>
          </div>

          <div v-else-if="filteredMentors.length === 0" class="text-center q-pa-xl">
            <q-icon name="person_off" size="xl" color="grey-4" />
            <div class="text-grey-7 q-mt-sm">
              {{
                searchMentor
                  ? 'Tidak ada mentor yang cocok dengan pencarian.'
                  : 'Belum ada data mentor yang masuk.'
              }}
            </div>
          </div>

          <q-table
            v-else
            :rows="filteredMentors"
            :columns="columns"
            row-key="_id"
            flat
            class="mentor-table"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template #body-cell-nama="props">
              <q-td :props="props">
                <div class="row items-center no-wrap">
                  <q-avatar color="grey-2" size="sm" class="q-mr-sm">
                    <q-icon name="person" color="grey-6" size="xs" />
                  </q-avatar>
                  <div class="text-weight-bold text-edulang-navy">{{ props.row.name || '-' }}</div>
                </div>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props" class="text-center">
                <q-chip
                  v-if="isVerified(props.row)"
                  dense
                  class="rounded-8 q-px-md text-weight-bold"
                  color="green-1"
                  text-color="green-7"
                  icon="check_circle"
                >
                  Terverifikasi
                </q-chip>
                <q-chip
                  v-else
                  dense
                  class="rounded-8 q-px-md text-weight-bold"
                  color="orange-1"
                  text-color="orange-7"
                  icon="pending"
                >
                  Pending
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-aksi="props">
              <q-td :props="props" class="text-center">
                <div class="row justify-center q-gutter-x-sm no-wrap">
                  <q-btn
                    unelevated
                    no-caps
                    color="edulang-blue"
                    size="sm"
                    padding="6px 16px"
                    class="rounded-8 text-weight-bold"
                    label="Konfirmasi"
                    :disable="isVerified(props.row)"
                    :loading="confirmingId === props.row._id"
                    @click="confirmMentor(props.row)"
                  />
                  <q-btn
                    flat
                    round
                    color="negative"
                    size="sm"
                    icon="delete_outline"
                    :loading="deletingId === props.row._id"
                    @click="confirmDelete(props.row)"
                  >
                    <q-tooltip>Hapus Akun</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Warna Brand Edulang */
.bg-edulang-white {
  background-color: #f5f7fa !important;
}
.text-edulang-navy {
  color: #003387 !important;
}
.bg-edulang-navy {
  background-color: #003387 !important;
}
.bg-edulang-blue {
  background-color: #0089ff !important;
}
.edulang-blue-light {
  background-color: rgba(0, 137, 255, 0.1) !important;
}

/* Layouting & Shadows */
.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}
.rounded-24 {
  border-radius: 24px;
}
.rounded-12 {
  border-radius: 12px;
}
.rounded-8 {
  border-radius: 8px;
}

.shadow-brand {
  box-shadow: 0 20px 40px -10px rgba(0, 51, 135, 0.08) !important;
}

.border-subtle {
  border: 1px solid rgba(0, 51, 135, 0.05);
}

/* Table Styling */
.mentor-table :deep(.q-table__th) {
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #616161;
  background-color: #fafafa;
}

.mentor-table :deep(.q-table__middle) {
  border-radius: 12px;
}

/* Responsivitas */
@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.75rem;
  }
  .search-input {
    width: 100% !important;
  }
}
</style>
