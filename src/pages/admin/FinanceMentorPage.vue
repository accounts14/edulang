<template>
  <q-page class="q-pa-md q-pa-sm-xl bg-edulang-white">
    <div class="max-width-container mx-auto">
      <div class="q-mb-xl">
        <div class="row items-center q-gutter-sm q-mb-xs">
          <q-icon name="account_balance_wallet" color="edulang-blue" size="md" />
          <h1 class="text-h4 text-weight-bolder text-edulang-navy q-ma-none font-outfit">
            Manajemen Keuangan Mentor
          </h1>
        </div>
        <p class="text-subtitle1 text-grey-7">
          Verifikasi rekening bank, pantau saldo, dan kelola pembayaran mentor secara efisien.
        </p>
      </div>

      <div class="row q-col-gutter-md q-mb-xl">
        <div class="col-12 col-sm-6 col-md-4">
          <q-card
            flat
            class="stat-card q-pa-lg bg-white shadow-brand border-subtle relative-position overflow-hidden"
          >
            <div class="bg-edulang-blue absolute-top" style="height: 4px"></div>
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-weight-bold text-grey-6 uppercase tracking-wider">
                  Total Mentor
                </div>
                <div class="text-h3 text-weight-bolder text-edulang-navy q-mt-xs">
                  {{ mentors.length }}
                </div>
              </div>
              <q-icon name="people" color="edulang-blue-light" size="lg" />
            </div>
          </q-card>
        </div>
      </div>

      <q-card flat class="rounded-24 shadow-brand bg-white border-subtle overflow-hidden">
        <div class="bg-edulang-navy" style="height: 6px"></div>

        <q-card-section class="q-pa-lg">
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h6 text-weight-bold text-edulang-navy font-outfit">
              Daftar Rekening & Saldo
            </div>
            <q-btn flat round color="grey-7" icon="refresh" @click="fetchMentorData">
              <q-tooltip>Refresh Data</q-tooltip>
            </q-btn>
          </div>

          <q-table
            :rows="mentors"
            :columns="columns"
            row-key="_id"
            :loading="loading"
            flat
            class="mentor-finance-table"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="text-weight-bold text-edulang-navy">{{ props.row.name }}</div>
                <div class="text-caption text-grey-6">{{ props.row.email }}</div>
              </q-td>
            </template>

            <template v-slot:body-cell-bank="props">
              <q-td :props="props">
                <div v-if="props.row.bankDetails" class="bank-info-box q-pa-xs">
                  <div class="text-weight-bold text-edulang-blue">
                    {{ props.row.bankDetails.bankName }}
                  </div>
                  <div class="text-body2 text-grey-9 font-mono">
                    {{ props.row.bankDetails.accountNumber }}
                  </div>
                  <div class="text-caption text-grey-6 italic">
                    a.n {{ props.row.bankDetails.accountHolder }}
                  </div>
                </div>
                <div v-else class="text-grey-4 italic">Belum diatur</div>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props" class="text-center">
                <q-chip
                  :color="props.row.isVerified ? 'green-1' : 'orange-1'"
                  :text-color="props.row.isVerified ? 'green-9' : 'orange-9'"
                  class="text-weight-bold rounded-8"
                  dense
                >
                  <q-icon
                    :name="props.row.isVerified ? 'verified' : 'pending'"
                    size="xs"
                    class="q-mr-xs"
                  />
                  {{ props.row.isVerified ? 'TERVERIFIKASI' : 'PENDING' }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-balance="props">
              <q-td :props="props" class="text-right">
                <div class="text-subtitle1 text-weight-bolder text-edulang-navy">
                  Rp {{ (props.row.balance || 0).toLocaleString('id-ID') }}
                </div>
                <div class="text-caption text-grey-5">Saldo Saat Ini</div>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-center">
                <div class="row justify-center q-gutter-x-sm no-wrap">
                  <q-btn
                    v-if="props.row.bankDetails && !props.row.isVerified"
                    color="green-7"
                    label="Approve"
                    size="sm"
                    unelevated
                    no-caps
                    icon="check"
                    class="rounded-8"
                    @click="verifyBank(props.row._id)"
                  />
                  <q-btn
                    color="negative"
                    outline
                    size="sm"
                    round
                    icon="restart_alt"
                    @click="confirmResetBalance(props.row)"
                  >
                    <q-tooltip>Reset Saldo</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)
const mentors = ref([])

const columns = [
  { name: 'name', label: 'Nama Mentor', field: 'name', align: 'left', sortable: true },
  { name: 'bank', label: 'Rekening Bank', align: 'left' },
  { name: 'status', label: 'Status Verifikasi', field: 'isVerified', align: 'center' },
  { name: 'balance', label: 'Saldo (Bulan Ini)', field: 'balance', align: 'right', sortable: true },
  { name: 'actions', label: 'Aksi Keuangan', align: 'center' },
]

// 1. Ambil List Mentor - Hapus prefix /api
// 1. Ambil List Mentor
async function fetchMentorData() {
  loading.value = true
  try {
    const res = await api.get('/mentors')
    const list = res.data.mentors || []

    mentors.value = list.map((m) => {
      // DEBUG: Cek di console untuk melihat struktur asli m.balance
      console.log(`Balance untuk ${m.name}:`, m.balance)

      return {
        ...m,
        isVerified: m.bankDetails?.isVerified || false,
        // Jika m.balance adalah objek, ambil properti angkanya (misal: m.balance.amount)
        // Jika m.balance sudah angka, gunakan langsung
        balance: typeof m.balance === 'object' ? m.balance.amount || 0 : m.balance || 0,
      }
    })
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal memuat data dari server' })
  } finally {
    loading.value = false
  }
}

// 2. Approve/Verify Bank - Hapus prefix /api
async function verifyBank(mentorId) {
  // Pastikan plugin Loading sudah aktif di config agar baris bawah ini tidak error
  $q.loading.show({
    message: 'Sedang memproses verifikasi bank...',
  })

  try {
    const res = await api.patch(`/mentors/bank-verify/${mentorId}`, { isVerified: true })
    if (res.data.success) {
      $q.notify({
        type: 'positive',
        message: 'Rekening mentor berhasil diverifikasi!',
      })
      await fetchMentorData() // Refresh tabel
    }
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: 'Gagal verifikasi bank. Silakan coba lagi.',
    })
  } finally {
    $q.loading.hide() // Menutup overlay
  }
}

// 3. Reset Balance - Hapus prefix /api
function confirmResetBalance(mentor) {
  $q.dialog({
    title: 'Konfirmasi Reset Saldo',
    message: `Lakukan reset saldo untuk ${mentor.name}? Saldo saat ini (Rp ${mentor.balance.toLocaleString('id-ID')}) akan menjadi 0.`,
    cancel: true,
    persistent: true,
    ok: { label: 'Reset Sekarang', color: 'negative', unelevated: true },
  }).onOk(async () => {
    try {
      const res = await api.patch(`/mentors/${mentor._id}/balance`, { reset: true })
      if (res.data.success) {
        $q.notify({
          type: 'warning',
          icon: 'payments',
          message: `Saldo direset! Sebelumnya: Rp ${res.data.previousBalance?.toLocaleString('id-ID')}`,
        })
        fetchMentorData()
      }
    } catch {
      $q.notify({ type: 'negative', message: 'Gagal mereset saldo' })
    }
  })
}

onMounted(fetchMentorData)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Brand Colors Edulang */
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
.text-edulang-blue {
  color: #0089ff !important;
}
.edulang-blue-light {
  color: rgba(0, 137, 255, 0.15) !important;
}

/* Components */
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

.stat-card {
  transition: transform 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-5px);
}

.bank-info-box {
  line-height: 1.2;
}

.font-mono {
  font-family: 'Courier New', Courier, monospace;
}

/* Table Professional Styling */
.mentor-finance-table :deep(.q-table__th) {
  font-weight: 800;
  color: #003387;
  background-color: #fafafa;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}

/* Responsiveness */
@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem;
  }
  .q-pa-sm-xl {
    padding: 16px !important;
  }
}
</style>
