<template>
  <q-page class="q-pa-md q-pa-sm-xl bg-edulang-white">
    <div class="max-width-container mx-auto">
      <div class="q-mb-xl">
        <h1 class="text-h4 text-weight-bolder text-edulang-navy font-outfit q-ma-none">
          Revenue & Transaksi
        </h1>
        <p class="text-subtitle1 text-grey-7">
          Monitor arus kas dan riwayat transaksi platform secara real-time.
        </p>
      </div>

      <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-sm-6 col-md-4">
          <q-card
            flat
            class="stat-card q-pa-lg bg-white shadow-brand rounded-24 relative-position overflow-hidden"
          >
            <div class="bg-edulang-blue absolute-top" style="height: 4px"></div>
            <div class="row items-center no-wrap">
              <q-avatar
                color="edulang-blue-light"
                text-color="edulang-blue"
                icon="receipt_long"
                size="56px"
                class="q-mr-md"
              />
              <div>
                <div class="text-h4 text-weight-bolder text-edulang-navy line-height-1">
                  {{ summary.totalTransaksi }}
                </div>
                <div class="text-caption text-weight-bold text-grey-6 uppercase q-mt-xs">
                  Transaksi ({{ monthLabel }})
                </div>
              </div>
            </div>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card
            flat
            class="stat-card q-pa-lg bg-white shadow-brand rounded-24 relative-position overflow-hidden"
          >
            <div class="bg-edulang-yellow absolute-top" style="height: 4px"></div>
            <div class="row items-center no-wrap">
              <q-avatar
                color="orange-1"
                text-color="edulang-yellow-dark"
                icon="payments"
                size="56px"
                class="q-mr-md"
              />
              <div>
                <div class="text-h5 text-weight-bolder text-edulang-navy line-height-1">
                  {{ summary.pendapatanFormatted }}
                </div>
                <div class="text-caption text-weight-bold text-grey-6 uppercase q-mt-xs">
                  Total Pendapatan
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <div class="row items-center q-mb-lg q-col-gutter-sm">
        <div class="col-12 col-sm-auto">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Cari Paket atau Email Mentor..."
            bg-color="white"
            clearable
            class="search-input rounded-12"
            style="min-width: 320px"
            @keyup.enter="applySearch"
            @clear="applySearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-5" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-auto">
          <q-btn
            unelevated
            color="edulang-blue"
            no-caps
            label="Filter Data"
            class="full-width rounded-12 q-px-lg text-weight-bold"
            @click="applySearch"
          />
        </div>
      </div>

      <q-card flat class="rounded-24 shadow-brand bg-white overflow-hidden border-subtle">
        <div class="bg-edulang-navy" style="height: 6px"></div>
        <q-card-section class="q-pa-lg">
          <div class="text-h6 text-weight-bolder text-edulang-navy font-outfit q-mb-md">
            Riwayat Transaksi
          </div>

          <div v-if="loading" class="text-center q-pa-xl">
            <q-spinner-dots color="edulang-blue" size="40px" />
          </div>

          <div v-else-if="filteredRows.length === 0" class="text-center q-pa-xl">
            <q-icon name="history" size="xl" color="grey-3" />
            <div class="text-grey-6 q-mt-md font-medium">
              {{
                searchQuery ? 'Tidak ada data yang cocok.' : 'Belum ada data transaksi tercatat.'
              }}
            </div>
          </div>

          <q-table
            v-else
            :rows="filteredRows"
            :columns="columns"
            row-key="_id"
            flat
            class="edulang-table"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template #body-cell-packageName="props">
              <q-td :props="props">
                <div class="text-weight-bold text-edulang-navy">{{ props.row.packageName }}</div>
                <div class="text-caption text-grey-5 font-mono">
                  ID: {{ props.row._id.slice(-8) }}
                </div>
              </q-td>
            </template>

            <template #body-cell-amount="props">
              <q-td :props="props" class="text-weight-bolder text-edulang-blue">
                {{ formatRupiah(props.row.amount) }}
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  :color="statusColor(props.row.status)"
                  class="rounded-8 q-py-xs q-px-md text-weight-bold"
                  unelevated
                >
                  {{ statusLabel(props.row.status) }}
                </q-badge>
              </q-td>
            </template>

            <template #body-cell-createdAt="props">
              <q-td :props="props">
                <div class="text-grey-8">{{ formatDate(props.row.createdAt) }}</div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'src/boot/axios'

// State
const loading = ref(true)
const searchQuery = ref('')
const searchApplied = ref('')

const transactions = ref([])
const packages = ref([])
const mentors = ref([])

// Filter Waktu (Bulan ini)
const monthFilter = ref(new Date().getMonth() + 1)
const yearFilter = ref(new Date().getFullYear())
const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]
const monthLabel = computed(() => `${monthNames[monthFilter.value - 1] || ''} ${yearFilter.value}`)

// Summary Cards Logic
const summary = computed(() => {
  const list = transactions.value.filter((tx) => tx.status === 'success')

  const inMonth = list.filter((tx) => {
    const d = tx.createdAt ? new Date(tx.createdAt) : null
    if (!d) return false
    return d.getMonth() + 1 === monthFilter.value && d.getFullYear() === yearFilter.value
  })

  const totalTransaksi = inMonth.length
  const pendapatan = inMonth.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)

  return {
    totalTransaksi,
    pendapatan,
    pendapatanFormatted: formatRupiah(pendapatan),
  }
})

// Utilities
function formatRupiah(val) {
  const n = Number(val) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)
}

function formatDate(d) {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function statusLabel(s) {
  const map = { success: 'Berhasil', pending: 'Menunggu', failed: 'Gagal', canceled: 'Dibatalkan' }
  return map[s] || s || 'Unknown'
}

function statusColor(s) {
  const map = { success: 'positive', pending: 'warning', failed: 'negative', canceled: 'grey' }
  return map[s] || 'grey'
}

// Konfigurasi Kolom Tabel (Sesuai ERD Transactions)
const columns = [
  { name: 'packageName', label: 'Paket', field: 'packageName', align: 'left', sortable: true },
  { name: 'emailMentor', label: 'Mentor', field: 'emailMentor', align: 'left', sortable: true },
  { name: 'amount', label: 'Nilai Transaksi', field: 'amount', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center', sortable: true },
  { name: 'createdAt', label: 'Tanggal', field: 'createdAt', align: 'left', sortable: true },
]

// Data Mapping (Relasi Transactions -> Packages -> Mentors)
const distributionRows = computed(() => {
  const txList = transactions.value || []
  const pkgList = packages.value || []
  const mentorList = mentors.value || []

  // Indexing untuk performa pencarian ID
  const mentorById = {}
  mentorList.forEach((m) => {
    if (m?._id) mentorById[m._id] = m
    if (m?.id) mentorById[m.id] = m
  })

  const pkgById = {}
  pkgList.forEach((p) => {
    if (p?._id) pkgById[p._id] = p
    if (p?.id) pkgById[p.id] = p
  })

  return txList.map((tx) => {
    // 1. Cari Paket
    // Backend mungkin mengirim object (populated) atau string ID
    const pkgId =
      typeof tx.package === 'object' && tx.package ? tx.package._id || tx.package.id : tx.package
    const pkg = pkgById[pkgId] || (typeof tx.package === 'object' ? tx.package : null)

    // 2. Cari Mentor
    let mentorEmail = '—'
    if (pkg) {
      const mentorRef = pkg.mentor
      if (typeof mentorRef === 'object' && mentorRef) {
        // Jika sudah dipopulate oleh backend
        mentorEmail = mentorRef.email || '—'
      } else if (typeof mentorRef === 'string') {
        // Jika hanya ID, cari di list mentors yang kita fetch
        const m = mentorById[mentorRef]
        if (m) mentorEmail = m.email
      }
    }

    return {
      _id: tx._id || tx.id,
      packageName: pkg ? pkg.title : '(Paket Tidak Ditemukan)',
      emailMentor: mentorEmail,
      amount: tx.amount || 0,
      status: tx.status || 'pending',
      createdAt: tx.createdAt || tx.updatedAt || new Date().toISOString(),
    }
  })
})

// Filter Pencarian (Paket & Email Mentor)
const filteredRows = computed(() => {
  const q = (searchApplied.value || '').toLowerCase().trim()
  if (!q) return distributionRows.value

  return distributionRows.value.filter((r) => {
    return (
      (r.packageName || '').toLowerCase().includes(q) ||
      (r.emailMentor || '').toLowerCase().includes(q)
    )
  })
})

function applySearch() {
  searchApplied.value = searchQuery.value
}

// Fetch Data
async function fetchData() {
  loading.value = true
  try {
    // Menggunakan allSettled agar jika endpoint /mentors error (CORS),
    // transaksi tetap bisa tampil (partial success).
    const results = await Promise.allSettled([
      api.get('/transactions'),
      api.get('/packages'),
      api.get('/mentors'),
    ])

    // Handle Transactions
    if (results[0].status === 'fulfilled') {
      const res = results[0].value
      transactions.value = res.data?.transactions ?? res.data?.data ?? []
    } else {
      console.error('Gagal ambil transaksi:', results[0].reason)
      transactions.value = []
    }

    // Handle Packages
    if (results[1].status === 'fulfilled') {
      const res = results[1].value
      packages.value = res.data?.packages ?? res.data?.data ?? []
    } else {
      console.warn('Gagal ambil packages:', results[1].reason)
      packages.value = []
    }

    // Handle Mentors (Sering kena CORS di dev environment)
    if (results[2].status === 'fulfilled') {
      const res = results[2].value
      mentors.value = res.data?.mentors ?? res.data?.data ?? []
    } else {
      console.warn('Gagal ambil mentors (Cek CORS/Permission):', results[2].reason)
      mentors.value = []
    }
  } catch (e) {
    console.error('Critical Error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Brand Colors */
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
.bg-edulang-yellow {
  background-color: #ffc42c !important;
}
.edulang-yellow-dark {
  color: #b48a1d !important;
}

/* Components Style */
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
  box-shadow: 0 15px 35px -5px rgba(0, 51, 135, 0.08) !important;
}

.border-subtle {
  border: 1px solid rgba(0, 51, 135, 0.05);
}
.line-height-1 {
  line-height: 1;
}
.font-mono {
  font-family: 'Courier New', Courier, monospace;
  font-size: 10px;
}

/* Table Styling */
.edulang-table :deep(.q-table__th) {
  font-weight: 800;
  color: #616161;
  background-color: #fafafa;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}

.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px -10px rgba(0, 51, 135, 0.15) !important;
}

/* Responsivitas */
@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.75rem;
  }
  .search-input {
    width: 100% !important;
  }
  .stat-card .text-h4 {
    font-size: 1.5rem;
  }
}
</style>
