<template>
  <q-page class="bg-edulang-background q-pb-xl">
    <div class="header-gradient q-pa-md q-pa-sm-xl q-mb-lg">
      <div class="max-width-container mx-auto">
        <div class="row items-center justify-between">
          <div class="col-12 col-md-8">
            <h1
              class="text-h4 text-sm-h3 text-weight-bolder text-edulang-navy font-outfit q-ma-none"
            >
              Revenue & <span class="text-edulang-blue">Transaksi</span>
            </h1>
            <p class="text-subtitle1 text-grey-7 q-mt-sm">
              Pantau pertumbuhan ekonomi platform Edulang secara real-time.
            </p>
          </div>
          <div class="col-12 col-md-4 q-mt-md q-mt-md-none">
            <q-input
              v-model="searchQuery"
              dense
              outlined
              rounded
              placeholder="Cari transaksi..."
              bg-color="white"
              class="search-input shadow-sm"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="edulang-blue" />
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>

    <div class="max-width-container mx-auto q-px-md">
      <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-sm-6">
          <q-card flat class="stat-card rounded-24 shadow-brand overflow-hidden">
            <div class="bg-edulang-blue" style="height: 6px"></div>
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="icon-box bg-blue-1 q-mr-lg">
                  <q-icon name="account_balance_wallet" color="edulang-blue" size="32px" />
                </div>
                <div>
                  <div class="text-caption text-weight-bold text-grey-6 uppercase letter-spacing-1">
                    Total Transaksi
                  </div>
                  <div class="text-h4 text-weight-bolder text-edulang-navy font-outfit">
                    {{ totalTransactions }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6">
          <q-card flat class="stat-card rounded-24 shadow-brand overflow-hidden">
            <div class="bg-edulang-yellow" style="height: 6px"></div>
            <q-card-section class="q-pa-lg">
              <div class="row items-center no-wrap">
                <div class="icon-box bg-orange-1 q-mr-lg">
                  <q-icon name="payments" color="orange-9" size="32px" />
                </div>
                <div>
                  <div class="text-caption text-weight-bold text-grey-6 uppercase letter-spacing-1">
                    Total Pendapatan
                  </div>
                  <div class="text-h5 text-sm-h4 text-weight-bolder text-edulang-navy font-outfit">
                    {{ formatRupiah(totalRevenue) }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card flat class="rounded-24 shadow-brand bg-white overflow-hidden border-subtle">
        <div class="q-pa-md q-pa-sm-lg border-bottom bg-grey-1 row items-center justify-between">
          <div class="text-subtitle1 text-weight-bold text-edulang-navy">
            Riwayat Transaksi Terkini
          </div>
          <q-btn flat round color="grey-7" icon="filter_list" size="sm" />
        </div>

        <q-table
          :rows="filteredPurchases"
          :columns="columns"
          :loading="loading"
          row-key="_id"
          flat
          class="edulang-table"
          :rows-per-page-options="[10, 25, 50]"
          :grid="$q.screen.lt.sm"
        >
          <template v-slot:item="props">
            <div class="q-pa-sm col-12">
              <q-card flat bordered class="rounded-12 q-pa-md">
                <div class="row justify-between items-start">
                  <div class="text-weight-bold text-edulang-navy">{{ props.row.packageTitle }}</div>
                  <div class="text-green-7 text-weight-bolder">
                    {{ formatRupiah(props.row.amount) }}
                  </div>
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">{{ props.row.userName }}</div>
                <q-separator class="q-my-sm" />
                <div class="row justify-between items-center">
                  <div class="text-caption text-grey-5">{{ formatDate(props.row.createdAt) }}</div>
                  <q-chip size="xs" color="indigo-1" text-color="indigo-7" class="text-weight-bold">
                    {{ props.row.mentorName || 'No Mentor' }}
                  </q-chip>
                </div>
              </q-card>
            </div>
          </template>

          <template #body-cell-packageInfo="props">
            <q-td :props="props">
              <div class="text-weight-bold text-edulang-navy">{{ props.row.packageTitle }}</div>
              <div class="text-caption text-grey-7">{{ props.row.userName }}</div>
            </q-td>
          </template>

          <template #body-cell-mentor="props">
            <q-td :props="props">
              <q-chip
                v-if="props.row.mentorName"
                size="sm"
                color="blue-1"
                text-color="edulang-blue"
                class="text-weight-bold"
              >
                {{ props.row.mentorName }}
              </q-chip>
              <span v-else class="text-grey-4 italic text-caption">Tanpa mentor</span>
            </q-td>
          </template>

          <template #body-cell-amount="props">
            <q-td :props="props">
              <div class="text-weight-bolder text-edulang-navy">
                {{ formatRupiah(props.row.amount) }}
              </div>
            </q-td>
          </template>

          <template #no-data>
            <div class="full-width row flex-center q-pa-xl text-grey-6">
              <q-icon name="history_toggle_off" size="48px" class="q-mb-sm" />
              <div class="full-width text-center">Belum ada data transaksi yang ditemukan.</div>
            </div>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { date } from 'quasar'

const loading = ref(true)
const purchases = ref([])
const totalTransactions = ref(0)
const searchQuery = ref('')

const columns = [
  { name: 'packageInfo', label: 'Informasi Paket & Pembeli', align: 'left', field: 'packageTitle' },
  { name: 'mentor', label: 'Mentor', align: 'left', field: 'mentorName' },
  { name: 'amount', label: 'Nominal', align: 'left', field: 'amount', sortable: true },
  { name: 'date', label: 'Tanggal Transaksi', align: 'left', field: 'createdAt', sortable: true },
]

// Hitung Total Revenue dari data purchases
const totalRevenue = computed(() => {
  return purchases.value.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const fetchData = async () => {
  loading.value = true
  try {
    const response = await api.get('/mentors/admin/user-purchases')
    if (response.data.success) {
      purchases.value = response.data.purchases
      totalTransactions.value = response.data.total
    }
  } catch (error) {
    console.error('Error fetch data:', error)
  } finally {
    loading.value = false
  }
}

const filteredPurchases = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return purchases.value
  return purchases.value.filter(
    (p) =>
      p.packageTitle.toLowerCase().includes(q) ||
      p.userName.toLowerCase().includes(q) ||
      (p.mentorName && p.mentorName.toLowerCase().includes(q)),
  )
})

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(val || 0)
}

const formatDate = (val) => {
  return date.formatDate(val, 'DD MMM YYYY, HH:mm')
}

onMounted(fetchData)
</script>

<style scoped>
/* Edulang Official Colors from Brand Guideline */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.bg-edulang-navy {
  background-color: #003387;
}
.bg-edulang-blue {
  background-color: #0089ff;
}
.bg-edulang-yellow {
  background-color: #ffc42c;
}
.bg-edulang-background {
  background-color: #f5f7fa;
}

/* Design Elements */
.header-gradient {
  background: linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%);
  border-bottom: 1px solid #e2e8f0;
}

.max-width-container {
  max-width: 1200px;
}

.rounded-24 {
  border-radius: 24px;
}
.rounded-12 {
  border-radius: 12px;
}

.shadow-brand {
  box-shadow: 0 4px 20px rgba(0, 51, 135, 0.06);
}

.icon-box {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.font-outfit {
  font-family:
    'Outfit',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

.border-subtle {
  border: 1px solid #e2e8f0;
}

.stat-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid transparent;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: #0089ff;
  box-shadow: 0 12px 30px rgba(0, 137, 255, 0.12);
}

/* Table Styling */
.edulang-table :deep(.q-table__th) {
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  font-size: 12px;
  padding: 16px;
  background-color: #f8fafc;
}

.edulang-table :deep(.q-table__td) {
  padding: 16px;
}

.search-input {
  transition: all 0.3s ease;
}

.search-input :deep(.q-field__control):before {
  border-color: #e2e8f0;
}

/* Mobile Adjustments */
@media (max-width: 600px) {
  .icon-box {
    width: 48px;
    height: 48px;
  }
  .stat-card .text-h4 {
    font-size: 1.5rem;
  }
}
</style>
