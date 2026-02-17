<template>
  <q-page class="bg-edulang-background q-pb-xl">
    <div class="header-section q-pa-md q-pa-sm-xl q-mb-lg bg-white border-bottom">
      <div class="max-width-container mx-auto">
        <div class="row items-center justify-between q-col-gutter-md">
          <div class="col-12 col-md-7">
            <h1
              class="text-h4 text-sm-h3 text-weight-bolder text-edulang-navy font-outfit q-ma-none"
            >
              Kelola <span class="text-edulang-blue">Pengguna</span>
            </h1>
            <p class="text-subtitle1 text-grey-7 q-mt-sm">
              Manajemen akun pengguna terverifikasi dalam ekosistem Edulang.
            </p>
          </div>

          <div class="col-12 col-md-5">
            <div class="row q-col-gutter-sm">
              <div class="col">
                <q-input
                  v-model="searchUser"
                  dense
                  outlined
                  rounded
                  placeholder="Cari Nama atau Email..."
                  bg-color="white"
                  class="search-input shadow-sm"
                  @keyup.enter="applySearch"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" color="edulang-blue" />
                  </template>
                </q-input>
              </div>
              <div class="col-auto">
                <q-btn
                  unelevated
                  rounded
                  color="edulang-yellow"
                  text-color="edulang-navy"
                  label="Cari"
                  class="text-weight-bold full-height px-lg"
                  @click="applySearch"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-width-container mx-auto q-px-md">
      <div class="row q-mb-lg">
        <div class="col-12">
          <q-card flat class="bg-edulang-navy text-white rounded-24 shadow-brand overflow-hidden">
            <q-card-section class="q-pa-lg row items-center justify-between">
              <div class="row items-center">
                <q-avatar
                  color="white-opacity"
                  text-color="white"
                  icon="group"
                  size="52px"
                  class="q-mr-md"
                />
                <div>
                  <div class="text-caption text-uppercase letter-spacing-1 opacity-70">
                    Total User Terverifikasi
                  </div>
                  <div class="text-h4 text-weight-bolder font-outfit line-height-1">
                    {{ totalUser }}
                  </div>
                </div>
              </div>
              <q-btn flat round icon="refresh" color="white" @click="fetchUsers" :loading="loading">
                <q-tooltip>Refresh Data</q-tooltip>
              </q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card flat class="rounded-24 shadow-brand bg-white border-subtle overflow-hidden">
        <div v-if="loading" class="text-center q-pa-xl">
          <q-spinner-tail color="edulang-blue" size="50px" />
          <p class="q-mt-md text-grey-6 font-outfit">Menghubungkan ke database...</p>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="text-center q-pa-xl">
          <q-icon name="person_off" size="64px" color="grey-4" />
          <div class="text-h6 text-grey-5 q-mt-md font-outfit">
            {{ searchUser ? 'User tidak ditemukan' : 'Belum ada data' }}
          </div>
          <q-btn
            flat
            color="edulang-blue"
            label="Reset Pencarian"
            @click="searchUser = ''"
            class="q-mt-sm"
          />
        </div>

        <q-table
          v-else
          :rows="filteredUsers"
          :columns="columns"
          row-key="email"
          flat
          class="edulang-table"
          :rows-per-page-options="[10, 25, 50]"
          :grid="$q.screen.lt.md"
        >
          <template v-slot:item="props">
            <div class="q-pa-sm col-12 col-sm-6">
              <q-card flat bordered class="rounded-16 q-pa-md user-mobile-card">
                <div class="row items-center q-mb-sm">
                  <q-avatar
                    color="blue-1"
                    text-color="edulang-blue"
                    size="40px"
                    class="text-weight-bold"
                  >
                    {{ props.row.name ? props.row.name.charAt(0).toUpperCase() : 'U' }}
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-weight-bold text-edulang-navy">
                      {{ props.row.name || '-' }}
                    </div>
                    <div class="text-caption text-grey-6">{{ props.row.email }}</div>
                  </div>
                </div>
                <q-separator class="q-my-sm opacity-50" />
                <div class="row justify-between items-center">
                  <span class="text-caption text-grey-5 italic">Password Encrypted</span>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete_outline"
                    size="sm"
                    @click="confirmDelete(props.row)"
                  />
                </div>
              </q-card>
            </div>
          </template>

          <template #body-cell-nama="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-avatar
                  size="32px"
                  color="blue-1"
                  text-color="edulang-blue"
                  class="q-mr-sm text-weight-bold"
                >
                  {{ props.row.name ? props.row.name.charAt(0).toUpperCase() : '?' }}
                </q-avatar>
                <div class="text-weight-medium text-edulang-navy">{{ props.row.name || '-' }}</div>
              </div>
            </q-td>
          </template>

          <template #body-cell-email="props">
            <q-td :props="props" class="text-grey-7">
              {{ props.row.email || '-' }}
            </q-td>
          </template>

          <template #body-cell-password="props">
            <q-td :props="props">
              <q-chip
                size="xs"
                outline
                color="grey-5"
                text-color="grey-7"
                icon="lock"
                label="Bcrypt"
              />
            </q-td>
          </template>

          <template #body-cell-aksi="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                class="hover-negative"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Hapus Akun</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
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
const users = ref([])
const totalUser = ref(0)
const searchUser = ref('')

const columns = [
  { name: 'nama', label: 'Nama', field: 'name', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'password', label: 'Status Password', align: 'left' },
  { name: 'aksi', label: 'Aksi', align: 'center' },
]

const filteredUsers = computed(() => {
  const q = (searchUser.value || '').trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((u) => {
    return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
  })
})

async function fetchUsers() {
  try {
    loading.value = true
    // Menggunakan endpoint yang LIVE di PDF
    const res = await api.get('/mentors/admin/users/verified')

    // Sesuai response PDF: {"success": true, "users": [...], "total": 247}
    users.value = res.data.users || []
    totalUser.value = res.data.total || 0
  } catch (err) {
    console.error('Fetch Error:', err)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data dari /api/mentors/admin/users/verified',
    })
  } finally {
    loading.value = false
  }
}

function confirmDelete(row) {
  $q.dialog({
    title: 'Perhatian',
    message: `Fungsi hapus untuk user ${row.email} memerlukan endpoint DELETE yang belum terdaftar di PDF LIVE.`,
    ok: { label: 'Tutup', color: 'primary' },
  })
}

function applySearch() {}

onMounted(fetchUsers)
</script>

<style scoped>
/* Branding Colors */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-navy {
  background-color: #003387;
}
.bg-edulang-yellow {
  background-color: #ffc42c;
}
.bg-edulang-background {
  background-color: #f5f7fa;
}
.white-opacity {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Typography & Containers */
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.max-width-container {
  max-width: 1140px;
}
.letter-spacing-1 {
  letter-spacing: 1px;
}

/* Components Style */
.rounded-24 {
  border-radius: 24px;
}
.rounded-16 {
  border-radius: 16px;
}
.border-subtle {
  border: 1px solid #e2e8f0;
}
.border-bottom {
  border-bottom: 1px solid #e2e8f0;
}

.shadow-brand {
  box-shadow: 0 10px 30px -5px rgba(0, 51, 135, 0.08);
}

.search-input :deep(.q-field__control) {
  height: 48px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.edulang-table :deep(.q-table__th) {
  font-weight: 700;
  color: #64748b;
  background-color: #f8fafc;
  padding: 16px;
  text-transform: uppercase;
  font-size: 11px;
}

.edulang-table :deep(.q-table__td) {
  padding: 16px;
}

.user-mobile-card {
  transition: transform 0.2s;
}
.user-mobile-card:active {
  transform: scale(0.98);
}

.px-lg {
  padding-left: 24px;
  padding-right: 24px;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.75rem;
  }
  .header-section {
    padding: 32px 16px;
  }
}
</style>
