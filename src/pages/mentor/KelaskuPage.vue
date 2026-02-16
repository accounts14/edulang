<template>
  <q-page class="q-pa-md q-pa-sm-xl bg-edulang-white">
    <div class="max-width-container mx-auto">
      <div class="q-mb-xl">
        <div class="text-caption text-grey-6 q-mb-xs font-outfit uppercase tracking-wider">
          Dashboard / <span class="text-edulang-blue text-weight-bold">Kelasku</span>
        </div>
        <h1 class="text-h4 text-weight-bolder text-edulang-navy q-ma-none font-outfit">Kelasku</h1>
        <div class="text-subtitle1 text-grey-7 q-mt-xs">
          Pantau pertumbuhan peserta dan performa kursus yang Anda kelola.
        </div>
      </div>

      <div class="row q-col-gutter-lg q-mb-xl items-stretch">
        <div class="col-12 col-md-8">
          <q-card
            flat
            class="rounded-24 bg-white shadow-brand q-pa-lg chart-card full-height border-subtle"
          >
            <div class="row items-center justify-between q-mb-xl">
              <div class="row items-center">
                <q-icon name="bar_chart" color="edulang-blue" size="sm" class="q-mr-sm" />
                <div class="text-h6 text-weight-bold text-edulang-navy font-outfit">
                  Tren Peserta Baru
                </div>
              </div>

              <div class="bg-grey-1 q-pa-xs rounded-12 row items-center">
                <q-btn
                  v-for="year in yearOptions"
                  :key="year"
                  dense
                  no-caps
                  unelevated
                  size="sm"
                  :label="year"
                  :class="[
                    'q-px-md rounded-8 transition-all',
                    selectedYear === year ? 'bg-edulang-navy text-white' : 'text-grey-7',
                  ]"
                  @click="selectedYear = year"
                />
              </div>
            </div>

            <div v-if="loading" class="flex flex-center" style="height: 200px">
              <q-spinner-dots color="edulang-blue" size="40px" />
            </div>

            <div v-else class="chart-container">
              <div class="chart-bars">
                <div v-for="(month, idx) in monthLabels" :key="month" class="chart-bar-item">
                  <div class="chart-bar-track">
                    <div
                      class="chart-bar-fill"
                      :style="{ height: barHeight(monthlyUserCount[idx]) }"
                    >
                      <q-tooltip anchor="top center" self="bottom center" class="bg-edulang-navy">
                        {{ monthlyUserCount[idx] }} Peserta ({{ month }})
                      </q-tooltip>
                    </div>
                  </div>
                  <div class="chart-bar-label text-caption text-weight-bold text-grey-6">
                    {{ month }}
                  </div>
                </div>
              </div>
            </div>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card
            flat
            class="rounded-24 bg-edulang-blue text-white shadow-brand q-pa-xl flex flex-center full-height relative-position overflow-hidden"
          >
            <q-icon
              name="group"
              class="absolute-bottom-right q-mr-n-lg q-mb-n-lg opacity-1"
              size="200px"
            />

            <div class="text-center relative-position">
              <div class="bg-white/20 q-pa-md rounded-circle inline-block q-mb-md">
                <q-icon name="groups" size="lg" />
              </div>
              <div class="text-subtitle1 text-white/80 font-outfit uppercase tracking-widest">
                Total Peserta
              </div>
              <div class="text-h2 text-weight-bolder q-mt-xs">{{ transactions.length }}</div>
              <div class="text-caption text-white/70 q-mt-sm">User Terdaftar di Semua Kelas</div>
            </div>
          </q-card>
        </div>
      </div>

      <q-card flat class="rounded-24 shadow-brand bg-white q-pa-lg border-subtle">
        <div class="row items-center justify-between q-mb-lg q-col-gutter-md">
          <div class="col-12 col-sm-auto">
            <div class="text-h6 text-weight-bold text-edulang-navy font-outfit">
              Daftar Kursus Aktif
            </div>
          </div>
          <div class="col-12 col-sm-auto">
            <q-input
              v-model="search"
              dense
              outlined
              bg-color="white"
              placeholder="Cari nama kelas..."
              class="search-input rounded-12"
            >
              <template #prepend>
                <q-icon name="search" color="grey-5" />
              </template>
            </q-input>
          </div>
        </div>

        <q-table
          flat
          class="edulang-table"
          :rows="filteredRows"
          :columns="columns"
          :loading="loading"
          :rows-per-page-options="[5, 10, 25]"
        >
          <template #body-cell-index="props">
            <q-td :props="props" class="text-grey-5 font-mono">#{{ props.pageIndex + 1 }}</q-td>
          </template>

          <template #body-cell-title="props">
            <q-td :props="props" class="text-weight-bold text-edulang-navy">
              {{ props.row.title }}
            </q-td>
          </template>

          <template #body-cell-totalUsers="props">
            <q-td :props="props">
              <q-chip
                color="edulang-blue-light"
                text-color="edulang-blue"
                class="text-weight-bolder rounded-8 q-px-md"
              >
                {{ props.row.totalUsers }} Peserta
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'

const loading = ref(true)
const search = ref('')
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

// Definisi Kolom Tabel (Gambar dihapus, Index ditambahkan)
const columns = [
  { name: 'index', label: 'No', align: 'left' },
  { name: 'title', label: 'Nama Course', field: 'title', align: 'left', sortable: true },
  {
    name: 'totalUsers',
    label: 'Total Peserta',
    field: 'totalUsers',
    align: 'center',
    sortable: true,
  },
]

// Logika Grafik: Menghitung JUMLAH USER per bulan dari History
const monthlyUserCount = computed(() => {
  const arr = new Array(12).fill(0)
  transactions.value.forEach((tx) => {
    const d = tx.date ? new Date(tx.date) : null
    if (d && d.getFullYear() === selectedYear.value) {
      arr[d.getMonth()] += 1
    }
  })
  return arr
})

const maxUsers = computed(() => Math.max(1, ...monthlyUserCount.value))

// Mengelompokkan transaksi berdasarkan judul package untuk baris tabel
const tableRows = computed(() => {
  const groups = {}
  transactions.value.forEach((tx) => {
    const title = tx.package?.title || 'Unknown Course'
    if (!groups[title]) {
      groups[title] = { title, totalUsers: 0 }
    }
    groups[title].totalUsers += 1
  })
  return Object.values(groups)
})

const filteredRows = computed(() => {
  const q = (search.value || '').toLowerCase().trim()
  return tableRows.value.filter((row) => row.title.toLowerCase().includes(q))
})

const yearOptions = computed(() => {
  const years = new Set([new Date().getFullYear()])
  transactions.value.forEach((tx) => {
    if (tx.date) years.add(new Date(tx.date).getFullYear())
  })
  return Array.from(years).sort()
})

async function fetchData() {
  loading.value = true
  try {
    // Ambil History Transaksi Mentor sebagai sumber data tunggal
    const res = await api.get('/transactions/mentor/history')
    if (res.data.success) {
      transactions.value = res.data.transactions || []
    }
  } catch (err) {
    console.error('Fetch Error:', err)
  } finally {
    loading.value = false
  }
}

function barHeight(value) {
  return `${(value / maxUsers.value) * 100}%`
}

onMounted(fetchData)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Colors */
.bg-edulang-white {
  background-color: #f5f7fa !important;
}
.text-edulang-navy {
  color: #003387 !important;
}
.text-edulang-blue {
  color: #0089ff !important;
}
.bg-edulang-navy {
  background-color: #003387 !important;
}
.bg-edulang-blue {
  background-color: #0089ff !important;
}
.bg-edulang-blue-light {
  background-color: rgba(0, 137, 255, 0.1) !important;
}

/* Utils */
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
.rounded-circle {
  border-radius: 50%;
}
.shadow-brand {
  box-shadow: 0 20px 40px -10px rgba(0, 51, 135, 0.08) !important;
}
.border-subtle {
  border: 1px solid rgba(0, 51, 135, 0.05);
}
.opacity-1 {
  opacity: 0.1;
}
.transition-all {
  transition: all 0.3s ease;
}

/* Chart Styling */
.chart-container {
  height: 250px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 20px;
}
.chart-bars {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: flex-end;
}
.chart-bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
.chart-bar-track {
  width: 14px;
  height: 100%;
  background-color: #f1f3f6;
  border-radius: 10px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 12px;
  overflow: hidden;
}
.chart-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #0089ff 0%, #003387 100%);
  border-radius: 10px;
  transition: height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Table */
.edulang-table :deep(.q-table__th) {
  font-weight: 800;
  color: #003387;
  background-color: #fafafa;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  padding: 16px;
}

@media (max-width: 600px) {
  .chart-bar-track {
    width: 8px;
  }
  .chart-bar-label {
    font-size: 8px;
  }
  .search-input {
    width: 100% !important;
  }
}
</style>
