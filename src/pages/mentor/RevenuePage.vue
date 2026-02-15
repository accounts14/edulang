<template>
  <q-page class="q-pa-lg bg-accent">
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 q-mb-xs">
        Dashboard / <span class="text-primary text-weight-medium">Revenue</span>
      </div>
      <div class="text-h4 text-weight-bolder text-indigo-10">Revenue</div>
      <div class="text-grey-7 q-mt-xs">
        Lihat performa pendapatan kelas dan riwayat uang masuk ke akunmu.
      </div>
    </div>

    <div class="row q-col-gutter-lg q-mb-xl items-stretch">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-md chart-card full-height">
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
              <div v-for="(month, idx) in monthLabels" :key="month" class="chart-bar-item">
                <div class="chart-bar">
                  <div class="chart-bar-fill" :style="{ height: barHeight(monthlyRevenue[idx]) }">
                    <q-tooltip>{{ formatRupiah(monthlyRevenue[idx]) }}</q-tooltip>
                  </div>
                </div>
                <div class="chart-bar-label text-caption text-grey-6">{{ month }}</div>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg summary-card full-height">
          <div class="row items-center no-wrap q-mb-md">
            <q-avatar size="60px" class="q-mr-md" color="primary" text-color="white">
              <q-icon name="payments" />
            </q-avatar>
            <div>
              <div class="text-subtitle1 text-weight-bold text-indigo-10">Revenue Kamu</div>
              <div class="text-caption text-grey-7">Rekap pendapatan bersih mentor.</div>
            </div>
          </div>
          <q-separator spaced />
          <div class="q-mt-md">
            <div class="text-caption text-grey-6">Jumlah Transaksi</div>
            <div class="text-h5 text-weight-bolder text-indigo-10">{{ transactions.length }}</div>
          </div>
          <div class="q-mt-md">
            <div class="text-caption text-grey-6">Total Pendapatan Mentor</div>
            <div class="text-h5 text-weight-bolder text-primary">{{ totalRevenueFormatted }}</div>
          </div>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg">
      <div class="text-subtitle1 text-weight-bold text-indigo-10 q-mb-md">Riwayat Uang Masuk</div>

      <q-table
        flat
        bordered
        class="rounded-borders-16"
        :rows="revenueRows"
        :columns="revenueColumns"
        :loading="loading"
        :rows-per-page-options="[5, 10, 25]"
        row-key="_id"
      >
        <template #body-cell-index="props">
          <q-td :props="props">
            {{ props.pageIndex + 1 }}
          </q-td>
        </template>

        <template #body-cell-amount="props">
          <q-td :props="props">
            <div v-if="props.row.isFree" class="italic text-caption" color="positive">Gratis</div>
            <div v-else class="text-weight-bold text-primary">{{ props.row.amountFormatted }}</div>
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
const transactions = ref([])
const totalEarningFormatted = ref('Rp0')
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

// Kolom Tabel
const revenueColumns = [
  { name: 'index', label: 'No', align: 'left' },
  {
    name: 'packageName',
    label: 'Paket Kelas',
    field: 'packageName',
    align: 'left',
    sortable: true,
  },
  { name: 'buyerEmail', label: 'Email Pembeli', field: 'buyerEmail', align: 'left' },
  {
    name: 'amount',
    label: 'Pendapatan Mentor',
    field: 'amountFormatted',
    align: 'left',
    sortable: true,
  },
  { name: 'date', label: 'Tanggal', field: 'dateFormatted', align: 'left', sortable: true },
]

// Data Mapping untuk Baris Tabel
const revenueRows = computed(() =>
  transactions.value.map((tx) => ({
    _id: tx._id,
    packageName: tx.package?.title || 'Tidak ada judul',
    buyerEmail: tx.buyer?.email || 'Tidak ada email',
    amountFormatted: formatRupiah(tx.mentorEarning),
    dateFormatted: formatDate(tx.date),
    isFree: tx.isFree,
  })),
)

// Logika Grafik
const yearOptions = computed(() => {
  const years = new Set([new Date().getFullYear()])
  transactions.value.forEach((tx) => {
    if (tx.date) years.add(new Date(tx.date).getFullYear())
  })
  return Array.from(years).sort()
})

const monthlyRevenue = computed(() => {
  const arr = new Array(12).fill(0)
  transactions.value.forEach((tx) => {
    const d = tx.date ? new Date(tx.date) : null
    if (d && d.getFullYear() === selectedYear.value) {
      arr[d.getMonth()] += Number(tx.mentorEarning) || 0
    }
  })
  return arr
})

const maxRevenue = computed(() => Math.max(1, ...monthlyRevenue.value))
const totalRevenueFormatted = computed(() => totalEarningFormatted.value)

// Fetch Data dari API
async function fetchData() {
  loading.value = true
  try {
    const res = await api.get('/transactions/mentor/history')
    if (res.data.success) {
      transactions.value = res.data.transactions || []
      totalEarningFormatted.value = res.data.totalEarningFormatted || 'Rp0'
    }
  } catch (err) {
    console.error('Error:', err)
    $q.notify({ type: 'negative', message: 'Gagal memuat data revenue.' })
  } finally {
    loading.value = false
  }
}

// Utils
function barHeight(value) {
  return `${(value / maxRevenue.value) * 100}%`
}
function formatRupiah(val) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val || 0)
}
function formatDate(d) {
  return d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'
}

onMounted(fetchData)
</script>

<style scoped>
.rounded-borders-16 {
  border-radius: 16px;
}
.chart-card {
  min-height: 300px;
}
.chart-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 200px;
}
.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
}
.chart-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.chart-bar {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.chart-bar-fill {
  width: 50%;
  background: linear-gradient(180deg, #3f51b5, #1a237e);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}
</style>
