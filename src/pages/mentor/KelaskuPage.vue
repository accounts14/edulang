<template>
  <q-page class="q-pa-lg bg-accent">
    <!-- Header -->
    <div class="q-mb-lg">
      <div class="text-caption text-grey-6 q-mb-xs">
        Dashboard / <span class="text-primary text-weight-medium">Kelasku</span>
      </div>
      <div class="text-h4 text-weight-bolder text-indigo-10">Kelasku</div>
      <div class="text-grey-7 q-mt-xs">
        Pantau pendapatan kelas, total peserta, dan performa setiap course yang kamu kelola.
      </div>
    </div>

    <!-- Chart & Summary (sejajar dan ukuran rapi) -->
    <div class="row q-col-gutter-lg q-mb-xl items-stretch">
      <!-- Grafik Pendapatan -->
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
                  <div class="chart-bar-fill" :style="{ height: barHeight(monthlyRevenue[idx]) }" />
                </div>
                <div class="chart-bar-label text-caption text-grey-6">
                  {{ month }}
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Kartu Total User (rapi, sejajar dengan grafik) -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg summary-card full-height">
          <div class="row items-center no-wrap">
            <q-avatar color="blue-6" text-color="white" icon="group" size="52px" class="q-mr-md" />
            <div>
              <div class="text-caption text-grey-6">Total User Course-mu</div>
              <div class="text-h5 text-weight-bolder text-indigo-10">
                {{ totalUsers }}
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Tabel Kelasku -->
    <q-card flat bordered class="rounded-borders-16 bg-white q-pa-lg">
      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle1 text-weight-bold text-indigo-10">Kelasku</div>
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

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="filteredRows.length === 0" class="text-center q-pa-xl text-grey-7">
        {{
          search
            ? 'Tidak ada kelas yang cocok dengan pencarian.'
            : 'Belum ada kelas yang terdaftar.'
        }}
      </div>

      <q-table
        v-else
        flat
        bordered
        class="rounded-borders-16"
        row-key="id"
        :rows="filteredRows"
        :columns="columns"
        :rows-per-page-options="[5, 10, 25]"
      >
        <template #body-cell-image="props">
          <q-td :props="props">
            <q-img :src="props.row.imageUrl" ratio="4/3" class="thumb-image" />
          </q-td>
        </template>

        <template #body-cell-title="props">
          <q-td :props="props">
            <div class="text-weight-bold text-body2">{{ props.row.title }}</div>
            <div class="text-caption text-grey-6">{{ props.row.description }}</div>
          </q-td>
        </template>

        <template #body-cell-language="props">
          <q-td :props="props">
            {{ props.row.languageName || '—' }}
          </q-td>
        </template>

        <template #body-cell-level="props">
          <q-td :props="props">
            <q-chip dense outline color="primary" text-color="primary">
              {{ props.row.levelLabel }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-totalUsers="props">
          <q-td :props="props" class="text-weight-bold">
            {{ props.row.totalUsers }}
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
const search = ref('')

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

const columns = [
  { name: 'image', label: 'Gambar', field: 'imageUrl', align: 'left' },
  { name: 'title', label: 'Nama Course', field: 'title', align: 'left', sortable: true },
  {
    name: 'language',
    label: 'Type Language',
    field: 'languageName',
    align: 'left',
    sortable: true,
  },
  { name: 'level', label: 'Level', field: 'levelLabel', align: 'left', sortable: true },
  {
    name: 'totalUsers',
    label: 'Total User',
    field: 'totalUsers',
    align: 'center',
    sortable: true,
  },
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

const packageUserCountMap = computed(() => {
  const map = {}
  successTransactionsForMentor.value.forEach((tx) => {
    const pkgRef = tx.package
    let pkgId = null

    if (typeof pkgRef === 'string') {
      pkgId = pkgRef
    } else if (pkgRef && typeof pkgRef === 'object') {
      pkgId = pkgRef._id || pkgRef.id || null
    }

    if (!pkgId) return
    map[pkgId] = (map[pkgId] || 0) + 1
  })
  return map
})

const totalUsers = computed(() =>
  Object.values(packageUserCountMap.value).reduce((sum, val) => sum + Number(val || 0), 0),
)

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

const maxRevenue = computed(() => Math.max(1, ...monthlyRevenue.value.map((v) => Number(v || 0))))

const tableRows = computed(() => {
  const map = packageUserCountMap.value
  return (packages.value || []).map((p) => {
    const id = p._id || p.id
    const level = p.level || ''
    let levelLabel = level
    if (level === 'limited') levelLabel = 'HSK 1'
    else if (level === 'moderated') levelLabel = 'HSK 2'
    else if (level === 'good') levelLabel = 'HSK 3'
    else if (level === 'fluent') levelLabel = 'HSK 4'

    return {
      id,
      imageUrl: p.imageUrl || 'https://cdn.quasar.dev/img/parallax2.jpg',
      title: p.title || p.name || 'Kelas Tanpa Judul',
      description: p.description || '',
      languageName: p.languageType?.name || p.languageTypeName || '',
      level,
      levelLabel,
      totalUsers: map[id] || 0,
    }
  })
})

const filteredRows = computed(() => {
  const q = (search.value || '').toLowerCase().trim()
  if (!q) return tableRows.value
  return tableRows.value.filter((row) => {
    return (
      (row.title || '').toLowerCase().includes(q) ||
      (row.languageName || '').toLowerCase().includes(q) ||
      (row.levelLabel || '').toLowerCase().includes(q)
    )
  })
})

function barHeight(value) {
  const v = Number(value) || 0
  const max = maxRevenue.value || 0
  if (max === 0) return '0%'
  const ratio = v / max
  return `${ratio * 100}%`
}

// Utility untuk memastikan hanya paket milik mentor yang login yang ikut dihitung.
function filterPackagesForCurrentMentor(list, { userId, userEmail }) {
  if (!Array.isArray(list)) return []

  return list.filter((pkg) => {
    const mentor = pkg.mentor || pkg.trainer || pkg.owner || pkg.createdBy || null
    if (!mentor) return false

    const mentorUserId =
      mentor.userId ||
      mentor.user_id ||
      (mentor.user && (mentor.user._id || mentor.user.id)) ||
      mentor._id ||
      mentor.id

    if (userId && mentorUserId && String(mentorUserId) === String(userId)) {
      return true
    }

    const mentorEmail = mentor.email || (mentor.user && mentor.user.email) || ''
    if (
      userEmail &&
      mentorEmail &&
      String(mentorEmail).toLowerCase() === String(userEmail).toLowerCase()
    ) {
      return true
    }

    return false
  })
}

async function fetchData() {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userEmail = localStorage.getItem('userEmail')

  if (!token) {
    $q.notify({
      type: 'negative',
      message: 'Sesi tidak valid. Silakan login ulang.',
    })
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
    return
  }

  loading.value = true
  try {
    const results = await Promise.allSettled([
      api.get('/packages', {
        params: {
          mentorId: userId,
        },
      }),
      api.get('/transactions'),
    ])

    if (results[0].status === 'fulfilled') {
      const res = results[0].value
      const data = res.data || {}
      const allPkgs = data.packages || data.data || (Array.isArray(data) ? data : [])
      packages.value = filterPackagesForCurrentMentor(allPkgs, { userId, userEmail })
    } else {
      console.error('[Kelasku] Gagal memuat packages:', results[0].reason)
      packages.value = []
    }

    if (results[1].status === 'fulfilled') {
      const res = results[1].value
      const data = res.data || {}
      transactions.value = data.transactions || data.data || (Array.isArray(data) ? data : [])
    } else {
      console.error('[Kelasku] Gagal memuat transactions:', results[1].reason)
      transactions.value = []
    }
  } catch (err) {
    console.error('[Kelasku] Critical error:', err)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data Kelasku.',
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
  align-items: center;
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

.thumb-image {
  width: 72px;
  border-radius: 12px;
}

.search-input {
  max-width: 260px;
}
</style>
