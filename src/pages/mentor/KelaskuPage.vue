<template>
  <q-page class="q-pa-lg bg-accent">
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 q-mb-xs">
        Dashboard / <span class="text-primary text-weight-medium">Kelasku</span>
      </div>
      <div class="text-h4 text-weight-bolder text-indigo-10">Kelasku</div>
      <div class="text-grey-7 q-mt-xs">
        Pantau jumlah peserta dan performa setiap course yang kamu kelola.
      </div>
    </div>

    <div class="row q-col-gutter-lg q-mb-xl items-stretch">
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-md chart-card full-height">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold text-indigo-10">
              Grafik Jumlah Peserta Baru
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
                  <div class="chart-bar-fill" :style="{ height: barHeight(monthlyUserCount[idx]) }">
                    <q-tooltip>{{ monthlyUserCount[idx] }} Peserta</q-tooltip>
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
          <div class="row items-center no-wrap">
            <q-avatar color="blue-6" text-color="white" icon="group" size="52px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Total Seluruh Peserta</div>
              <div class="text-h5 text-weight-bolder text-indigo-10">
                {{ transactions.length }} User
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle1 text-weight-bold text-indigo-10">Daftar Kursus Aktif</div>
        <q-input
          v-model="search"
          dense
          outlined
          bg-color="white"
          placeholder="Cari kelas"
          clearable
          class="search-input"
        >
          <template #append>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </div>

      <q-table
        flat
        bordered
        class="rounded-borders-16"
        row-key="title"
        :rows="filteredRows"
        :columns="columns"
        :loading="loading"
        :rows-per-page-options="[5, 10, 25]"
      >
        <template #body-cell-index="props">
          <q-td :props="props">
            {{ props.pageIndex + 1 }}
          </q-td>
        </template>

        <template #body-cell-totalUsers="props">
          <q-td :props="props">
            <q-badge color="blue-1" text-color="blue-8" class="text-weight-bold q-px-md q-py-xs">
              {{ props.row.totalUsers }} Peserta
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>
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
  width: 40%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}
.summary-card {
  display: flex;
  align-items: center;
}
.search-input {
  max-width: 250px;
}
</style>
