<template>
  <q-page class="bg-edulang-background q-pb-xl">
    <div class="header-gradient q-pa-md q-pa-sm-xl q-mb-lg border-bottom">
      <div class="max-width-container mx-auto">
        <div class="row items-center justify-between q-col-gutter-md">
          <div class="col-12 col-md-7">
            <h1
              class="text-h4 text-sm-h3 text-weight-bolder text-edulang-navy font-outfit q-ma-none"
            >
              Akses <span class="text-edulang-blue">Kursus</span>
            </h1>
            <p class="text-subtitle1 text-grey-7 q-mt-sm">
              Kelola dan pantau hak akses materi pengguna berdasarkan transaksi.
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
                  placeholder="Cari nama atau email..."
                  bg-color="white"
                  class="search-input shadow-sm"
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
                  icon="person_search"
                  class="text-weight-bold full-height px-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-width-container mx-auto q-px-md">
      <q-card flat class="rounded-24 shadow-brand bg-white border-subtle overflow-hidden">
        <div class="bg-edulang-navy" style="height: 6px"></div>

        <div class="q-pa-md q-pa-sm-lg border-bottom row items-center justify-between">
          <div class="text-h6 text-weight-bolder text-edulang-navy font-outfit">
            Data Pengguna & Kursus Terdaftar
          </div>
          <q-btn
            flat
            round
            icon="sync"
            color="edulang-blue"
            @click="fetchAdminData"
            :loading="loading"
          />
        </div>

        <q-table
          :rows="filteredUsers"
          :columns="columns"
          row-key="userEmail"
          :loading="loading"
          flat
          class="edulang-table"
          :rows-per-page-options="[10, 25, 50]"
          :grid="$q.screen.lt.md"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="edulang-blue" />
          </template>

          <template v-slot:item="props">
            <div class="q-pa-sm col-12 col-sm-6">
              <q-card flat bordered class="rounded-16 q-pa-md">
                <div class="row items-center q-mb-md">
                  <q-avatar
                    color="blue-1"
                    text-color="edulang-blue"
                    font-outfit
                    class="text-weight-bold"
                  >
                    {{ props.row.userName.charAt(0) }}
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-weight-bold text-edulang-navy">{{ props.row.userName }}</div>
                    <div class="text-caption text-grey-6">{{ props.row.userEmail }}</div>
                  </div>
                </div>

                <div class="q-mb-sm">
                  <div
                    class="text-caption text-grey-5 text-uppercase text-weight-bold letter-spacing-1 q-mb-xs"
                  >
                    Kursus Aktif
                  </div>
                  <div class="row q-gutter-xs">
                    <q-chip
                      v-for="(course, i) in props.row.courses"
                      :key="i"
                      size="sm"
                      color="edulang-yellow"
                      text-color="edulang-navy"
                      class="text-weight-bold"
                    >
                      {{ course }}
                    </q-chip>
                  </div>
                </div>

                <q-separator class="q-my-sm opacity-50" />

                <div class="row items-center text-caption text-grey-7">
                  <q-icon name="record_voice_over" size="16px" class="q-mr-xs" />
                  Mentor: {{ props.row.mentors.join(', ') || '—' }}
                </div>
              </q-card>
            </div>
          </template>

          <template v-slot:body-cell-nama="props">
            <q-td :props="props">
              <div class="text-weight-bold text-edulang-navy">{{ props.row.userName }}</div>
              <div class="text-caption text-grey-6">{{ props.row.userEmail }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-terdaftarKelas="props">
            <q-td :props="props">
              <div class="row q-gutter-xs" style="max-width: 400px">
                <q-chip
                  v-for="(course, index) in props.row.courses"
                  :key="index"
                  size="sm"
                  color="blue-1"
                  text-color="edulang-blue"
                  class="text-weight-bold"
                >
                  {{ course }}
                </q-chip>
                <div v-if="!props.row.courses.length" class="text-grey-4 italic">—</div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-mentor="props">
            <q-td :props="props">
              <div class="row items-center text-grey-8">
                <q-icon name="star" color="edulang-yellow" size="xs" class="q-mr-xs" />
                {{ props.row.mentors.join(', ') || '—' }}
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)
const groupedData = ref([])
const searchUser = ref('')

const columns = [
  { name: 'nama', label: 'Informasi Pengguna', align: 'left', field: 'userName', sortable: true },
  { name: 'terdaftarKelas', label: 'Kursus Aktif', align: 'left' },
  { name: 'mentor', label: 'Pendamping (Mentor)', align: 'left' },
]

async function fetchAdminData() {
  loading.value = true
  try {
    const res = await api.get('/mentors/admin/user-purchases')
    const purchases = res.data.purchases || []

    const map = {}
    purchases.forEach((item) => {
      const email = item.userEmail
      if (!map[email]) {
        map[email] = {
          userName: item.userName || 'No Name',
          userEmail: email,
          courses: [],
          mentors: [],
        }
      }
      if (item.packageTitle && !map[email].courses.includes(item.packageTitle)) {
        map[email].courses.push(item.packageTitle)
      }
      if (item.mentorName && !map[email].mentors.includes(item.mentorName)) {
        map[email].mentors.push(item.mentorName)
      }
    })
    groupedData.value = Object.values(map)
  } catch (err) {
    console.error('Error:', err)
    $q.notify({ type: 'negative', message: 'Koneksi ke server Edulang terputus.' })
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  const s = (searchUser.value || '').toLowerCase()
  if (!s) return groupedData.value
  return groupedData.value.filter(
    (u) => u.userName.toLowerCase().includes(s) || u.userEmail.toLowerCase().includes(s),
  )
})

onMounted(fetchAdminData)
</script>

<style scoped>
/* Edulang Brand Colors */
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

/* Layout & Typography */
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.max-width-container {
  max-width: 1200px;
}
.header-gradient {
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

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

.letter-spacing-1 {
  letter-spacing: 1px;
}

/* Table Style */
.edulang-table :deep(.q-table__th) {
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  font-size: 11px;
  background-color: #f8fafc;
  padding: 16px;
}

.edulang-table :deep(.q-table__td) {
  padding: 16px;
}

/* Mobile Adjustments */
@media (max-width: 600px) {
  .header-gradient {
    padding: 32px 16px;
  }
  .text-h4 {
    font-size: 1.75rem;
  }
}
</style>
