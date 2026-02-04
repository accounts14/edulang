<template>
  <q-page class="q-pa-xl bg-blue-1">
    <div class="q-mb-xl">
      <div class="text-h4 text-weight-bolder text-indigo-10">Kelola Akun Pengguna Terdaftar</div>
      <div class="text-subtitle1 text-grey-7">
        Tempat Pengelolaan Akun Pengguna yang terdaftar Course
      </div>
    </div>

    <div class="row items-center q-mb-md">
      <q-input
        v-model="searchUser"
        dense
        outlined
        placeholder="Cari User"
        bg-color="white"
        clearable
        class="search-input"
        style="min-width: 280px"
        @keyup.enter="applySearch"
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
      <div class="text-h6 text-weight-bolder q-mb-md">User</div>

      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="40px" />
      </div>

      <div v-else-if="users.length === 0" class="text-center q-pa-xl text-grey-7">
        Belum ada data pengguna.
      </div>

      <q-table
        v-else
        :rows="filteredUsers"
        :columns="columns"
        row-key="_id"
        flat
        bordered
        class="rounded-borders"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template #body-cell-nama="props">
          <q-td>{{ props.row.name || '-' }}</q-td>
        </template>
        <template #body-cell-email="props">
          <q-td>{{ props.row.email || '-' }}</q-td>
        </template>
        <template #body-cell-terdaftarKelas="props">
          <q-td>{{ getRegisteredCourseLabel(props.row) }}</q-td>
        </template>
        <template #body-cell-mentor="props">
          <q-td>{{ getMentorLabel(props.row) }}</q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'

const loading = ref(true)
const users = ref([])
const searchUser = ref('')
const userCourseMap = ref({}) // { userId: { count, mentorName, courseNames } }

const columns = [
  { name: 'nama', label: 'Nama', field: 'name', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'terdaftarKelas', label: 'Terdaftar Kelas', align: 'left' },
  { name: 'mentor', label: 'Mentor', align: 'left' },
]

const filteredUsers = computed(() => {
  const q = (searchUser.value || '').trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter((u) => {
    const name = (u.name || '').toLowerCase()
    const email = (u.email || '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })
})

function getRegisteredCourseLabel(row) {
  const id = row._id || row.id
  const info = userCourseMap.value[id]
  if (!info || info.count === 0) return '—'
  if (info.courseNames && info.courseNames.length > 0) {
    return info.courseNames.slice(0, 3).join(', ') + (info.courseNames.length > 3 ? '...' : '')
  }
  return `${info.count} course`
}

function getMentorLabel(row) {
  const id = row._id || row.id
  const info = userCourseMap.value[id]
  return info && info.mentorName ? info.mentorName : '—'
}

function applySearch() {
  // Filter is reactive via filteredUsers
}

async function fetchUsers() {
  try {
    loading.value = true
    const res = await api.get('/users')
    const data = res.data || {}
    const list = data.users || data.data || []
    const all = Array.isArray(list) ? list : []
    users.value = all.filter((u) => (u.role || '').toLowerCase() === 'user')
  } catch (err) {
    console.warn('[Admin User] GET /users tidak tersedia atau error', err?.response?.status)
    users.value = []
  } finally {
    loading.value = false
  }
  await buildUserCourseMap()
}

async function buildUserCourseMap() {
  const map = {}
  try {
    const [txRes, pkgRes] = await Promise.all([
      api.get('/transactions').catch(() => ({ data: {} })),
      api.get('/packages').catch(() => ({ data: {} })),
    ])
    const txList = txRes.data?.transactions || txRes.data?.data || []
    const packages = pkgRes.data?.packages || pkgRes.data?.data || []
    const pkgById = {}
    packages.forEach((p) => {
      const id = p._id || p.id
      if (id) pkgById[id] = p
    })

    const list = Array.isArray(txList) ? txList : []
    list.forEach((tx) => {
      if (tx.status !== 'success') return
      const uid = (tx.user && (tx.user._id || tx.user.id)) || tx.user
      const pid = (tx.package && (tx.package._id || tx.package.id)) || tx.package
      if (!uid) return
      if (!map[uid]) map[uid] = { count: 0, courseNames: [], mentorName: '' }
      map[uid].count += 1
      const pkg = pkgById[pid] || tx.package
      if (pkg && pkg.title) {
        if (!map[uid].courseNames.includes(pkg.title)) map[uid].courseNames.push(pkg.title)
      }
      const mentor = pkg?.mentor
      const mentorName = (mentor && (mentor.name || mentor.email)) || ''
      if (mentorName && !map[uid].mentorName) map[uid].mentorName = mentorName
    })
  } catch (err) {
    console.warn('[Admin User] buildUserCourseMap', err?.message || err)
  }
  userCourseMap.value = map
}

onMounted(fetchUsers)
</script>

<style scoped>
.rounded-borders-lg {
  border-radius: 24px;
}
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
