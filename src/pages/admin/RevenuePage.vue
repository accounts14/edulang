<template>
  <q-page class="q-pa-xl bg-accent">
    <div class="text-h4 text-weight-bolder text-indigo-10 q-mb-xl">Revenue & Transaksi</div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat class="rounded-borders-lg shadow-1 q-pa-lg bg-white">
          <div class="row items-center">
            <q-avatar
              color="blue-6"
              text-color="white"
              icon="description"
              size="48px"
              class="q-mr-md"
            />
            <div>
              <div class="text-h4 text-weight-bolder text-grey-9">{{ summary.totalTransaksi }}</div>
              <div class="text-caption text-grey-7">Total Transaksi ({{ monthLabel }})</div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <q-card flat class="rounded-borders-lg shadow-1 q-pa-lg bg-white">
          <div class="row items-center">
            <q-avatar
              color="amber-7"
              text-color="white"
              icon="payments"
              size="48px"
              class="q-mr-md"
            />
            <div>
              <div class="text-h6 text-weight-bolder text-grey-9">
                {{ summary.pendapatanFormatted }}
              </div>
              <div class="text-caption text-grey-7">Pendapatan Masuk</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="row items-center q-mb-md">
      <q-input
        v-model="searchQuery"
        dense
        outlined
        placeholder="Cari Paket / Email Mentor"
        bg-color="white"
        clearable
        class="rounded-borders"
        style="min-width: 320px"
        @keyup.enter="applySearch"
        @clear="applySearch"
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
      <div class="text-h6 text-weight-bolder q-mb-md">Data Transaksi</div>

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="filteredRows.length === 0" class="text-center q-pa-xl text-grey-7">
        {{
          searchQuery ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada data transaksi.'
        }}
      </div>

      <q-table
        v-else
        :rows="filteredRows"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        class="rounded-borders"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template #body-cell-packageName="props">
          <q-td>
            <div class="text-weight-bold">{{ props.row.packageName }}</div>
            <div class="text-caption text-grey-7" style="font-size: 10px">
              ID: {{ props.row._id }}
            </div>
          </q-td>
        </template>

        <template #body-cell-emailMentor="props">
          <q-td>
            <div>{{ props.row.emailMentor }}</div>
          </q-td>
        </template>

        <template #body-cell-amount="props">
          <q-td class="text-weight-medium">{{ formatRupiah(props.row.amount) }}</q-td>
        </template>

        <template #body-cell-status="props">
          <q-td>
            <q-badge :color="statusColor(props.row.status)" class="q-py-xs q-px-sm">
              {{ statusLabel(props.row.status) }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-createdAt="props">
          <q-td>{{ formatDate(props.row.createdAt) }}</q-td>
        </template>
      </q-table>
    </q-card>
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
.rounded-borders-lg {
  border-radius: 24px;
}
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
