<template>
  <q-page class="q-pa-lg bg-blue-1">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 q-mb-xs">
        Dashboard /
        <span class="text-primary text-weight-medium">Revenue</span>
      </div>
      <div class="text-h4 text-weight-bolder text-indigo-10">Revenue</div>
      <div class="text-grey-7 q-mt-xs">
        Lihat performa pendapatan kelas dan riwayat uang masuk ke akunmu.
      </div>
    </div>

    <!-- Grafik + Summary -->
    <div class="row q-col-gutter-lg q-mb-xl items-stretch">
      <!-- Grafik Pendapatan -->
      <div class="col-12 col-md-8">
        <q-card
          flat
          bordered
          class="rounded-borders-16 bg-white q-pa-md chart-card full-height"
        >
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold text-indigo-10">
              Grafik Pendapatan Kelas
            </div>
            <div class="row items-center q-gutter-xs">
              <q-btn
                v-for="year in yearOptions"
                :key="year"
                dense
                no-caps
                flat
                size="sm"
                :label="year"
                :class="[
                  'q-px-sm rounded-borders-sm',
                  selectedYear === year ? 'bg-primary text-white' : 'text-grey-7',
                ]"
                @click="selectedYear = year"
              />
            </div>
          </div>

          <div v-if="loading" class="text-center q-pa-xl">
            <q-spinner-dots color="primary" size="40px" />
          </div>

          <div v-else class="chart-wrapper">
            <div class="chart-bars">
              <div
                v-for="(month, idx) in monthLabels"
                :key="month"
                class="chart-bar-item"
              >
                <div class="chart-bar">
                  <div
                    class="chart-bar-fill"
                    :style="{ height: barHeight(monthlyRevenue[idx]) }"
                  />
                </div>
                <div class="chart-bar-label text-caption text-grey-6">
                  {{ month }}
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Summary Card -->
      <div class="col-12 col-md-4">
        <q-card
          flat
          bordered
          class="rounded-borders-16 bg-white q-pa-lg summary-card full-height"
        >
          <div class="row items-center no-wrap q-mb-md">
            <q-avatar
              size="60px"
              class="q-mr-md"
            >
              <img
                src="https://cdn.quasar.dev/img/avatar2.jpg"
                alt="Mentor"
              >
            </q-avatar>
            <div>
              <div class="text-subtitle1 text-weight-bold text-indigo-10">
                Revenue Kamu
              </div>
              <div class="text-caption text-grey-7">
                Rekap pendapatan dari semua kelas yang kamu kelola.
              </div>
            </div>
          </div>

          <q-separator spaced />

          <div class="q-mt-md">
            <div class="text-caption text-grey-6">Jumlah Transaksi</div>
            <div class="text-h5 text-weight-bolder text-indigo-10">
              {{ totalTransactions }}
            </div>
          </div>

          <div class="q-mt-md">
            <div class="text-caption text-grey-6">Total Pendapatan</div>
            <div class="text-h5 text-weight-bolder text-primary">
              {{ totalRevenueFormatted }}
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Tabel Uang Masuk -->
    <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg">
      <div class="row items-center justify-between q-mb-md">
        <div>
          <div class="text-subtitle1 text-weight-bold text-indigo-10">
            Uang Masuk
          </div>
          <div class="text-caption text-grey-7">
            Riwayat transaksi sukses yang masuk ke akunmu.
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="revenueRows.length === 0" class="text-center q-pa-xl text-grey-7">
        Belum ada data uang masuk.
      </div>

      <q-table
        v-else
        flat
        bordered
        class="rounded-borders-16"
        row-key="_id"
        :rows="revenueRows"
        :columns="revenueColumns"
        :rows-per-page-options="[5, 10, 25]"
      >
        <template #body-cell-proof="props">
          <q-td :props="props" class="text-right">
            <q-btn
              label="Lihat Bukti"
              outline
              color="primary"
              no-caps
              dense
              disable
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const loading = ref(true)

const packages = ref([])
const transactions = ref([])

const selectedYear = ref(new Date().getFullYear())

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]

const yearOptions = computed(() => {
  const years = new Set()
  transactions.value.forEach((tx) => {
    const d = tx.createdAt ? new Date(tx.createdAt) : null
    if (!d || Number.isNaN(d.getTime())) return
    years.add(d.getFullYear())
  })
  if (years.size === 0) {
    years.add(new Date().getFullYear())
  }
  return Array.from(years).sort()
})

const successTransactionsForMentor = computed(() => {
  const pkgIds = new Set(
    (packages.value || []).map((p) => p._id || p.id).filter((id) => id != null),
  )

  return (transactions.value || []).filter((tx) => {
    if (tx.status && tx.status !== 'success') return false
    const pkgRef = tx.package
    let pkgId = null

    if (typeof pkgRef === 'string') {
      pkgId = pkgRef
    } else if (pkgRef && typeof pkgRef === 'object') {
      pkgId = pkgRef._id || pkgRef.id || null
    }

    return pkgId && pkgIds.has(pkgId)
  })
})

const monthlyRevenue = computed(() => {
  const arr = new Array(12).fill(0)
  const targetYear = selectedYear.value

  successTransactionsForMentor.value.forEach((tx) => {
    const d = tx.createdAt ? new Date(tx.createdAt) : null
    if (!d || Number.isNaN(d.getTime())) return
    if (d.getFullYear() !== targetYear) return
    const monthIdx = d.getMonth()
    const amount = Number(tx.amount) || 0
    arr[monthIdx] += amount
  })

  return arr
})

const maxRevenue = computed(() =>
  Math.max(1, ...monthlyRevenue.value.map((v) => Number(v || 0))),
)

const totalTransactions = computed(() => successTransactionsForMentor.value.length)

const totalRevenue = computed(() =>
  successTransactionsForMentor.value.reduce(
    (sum, tx) => sum + (Number(tx.amount) || 0),
    0,
  ),
)

const totalRevenueFormatted = computed(() => formatRupiah(totalRevenue.value))

const revenueColumns = [
  { name: 'period', label: 'Periode', field: 'period', align: 'left' },
  { name: 'amount', label: 'Jumlah Payout', field: 'amountFormatted', align: 'left' },
  {
    name: 'transferDate',
    label: 'Tanggal Transfer',
    field: 'transferDateFormatted',
    align: 'left',
  },
  { name: 'proof', label: 'Bukti Transfer', field: 'proof', align: 'right' },
]

const revenueRows = computed(() =>
  successTransactionsForMentor.value.map((tx) => {
    const d = tx.createdAt ? new Date(tx.createdAt) : new Date()
    const year = d.getFullYear()

    return {
      _id: tx._id || tx.id,
      period: year,
      amount: Number(tx.amount) || 0,
      amountFormatted: formatRupiah(tx.amount),
      transferDateFormatted: formatDate(d),
    }
  }),
)

function barHeight(value) {
  const v = Number(value) || 0
  const max = maxRevenue.value || 0
  if (max === 0) return '0%'
  const ratio = v / max
  return `${ratio * 100}%`
}

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
    })
  } catch {
    return '—'
  }
}

async function fetchData() {
  loading.value = true
  try {
    const results = await Promise.allSettled([api.get('/packages'), api.get('/transactions')])

    if (results[0].status === 'fulfilled') {
      const res = results[0].value
      const data = res.data || {}
      packages.value = data.packages || data.data || (Array.isArray(data) ? data : [])
    } else {
      console.error('[Mentor Revenue] Gagal memuat packages:', results[0].reason)
      packages.value = []
    }

    if (results[1].status === 'fulfilled') {
      const res = results[1].value
      const data = res.data || {}
      transactions.value = data.transactions || data.data || (Array.isArray(data) ? data : [])
    } else {
      console.error('[Mentor Revenue] Gagal memuat transactions:', results[1].reason)
      transactions.value = []
    }
  } catch (err) {
    console.error('[Mentor Revenue] Critical error:', err)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data revenue.',
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.summary-card {
  border-radius: 18px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rounded-borders-16 {
  border-radius: 16px;
}

.chart-card {
  min-height: 260px;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px 8px 4px;
}

.chart-bars {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
}

.chart-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 32px;
}

.chart-bar {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bar-fill {
  width: 60%;
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
  border-radius: 999px 999px 0 0;
  transition: height 0.3s ease;
}

.chart-bar-label {
  margin-top: 4px;
}
</style>

