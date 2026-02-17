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
            <q-btn
              flat
              round
              color="grey-7"
              icon="refresh"
              @click="fetchMentorData"
              :loading="loading"
            >
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

async function fetchMentorData() {
  loading.value = true
  try {
    // 1. Ambil data profil dasar (yang ada bankDetails-nya)
    const resBase = await api.get('/mentors')
    const listBase = resBase.data.mentors || []

    // 2. Ambil data saldo dari endpoint khusus (Gambar 3)
    const resBalance = await api.get('/mentors/admin/mentor-balances')
    const listBalance = resBalance.data.mentors || []

    // 3. Gabungkan datanya berdasarkan nama atau email agar info bank & saldo tampil bersamaan
    mentors.value = listBase.map((mBase) => {
      // Cari data saldo yang cocok untuk mentor ini di listBalance
      const balanceData = listBalance.find((b) => b.name === mBase.name)

      return {
        ...mBase,
        // Gunakan balance dari endpoint baru (Gambar 3)
        balance: balanceData ? balanceData.balance : 0,
        // Pastikan status verifikasi tetap sinkron dengan data profil atau API saldo
        isVerified:
          mBase.bankDetails?.isVerified || balanceData?.bankStatus === 'Verified' || false,
      }
    })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Gagal memuat data lengkap' })
  } finally {
    loading.value = false
  }
}

async function verifyBank(mentorId) {
  $q.loading.show({ message: 'Sedang memproses verifikasi bank...' })
  try {
    const res = await api.patch(`/mentors/bank-verify/${mentorId}`, { isVerified: true }) //
    if (res.data.success) {
      $q.notify({ type: 'positive', message: 'Rekening mentor berhasil diverifikasi!' })
      await fetchMentorData()
    }
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal verifikasi bank.' })
  } finally {
    $q.loading.hide()
  }
}

function confirmResetBalance(mentor) {
  $q.dialog({
    title: 'Konfirmasi Reset Saldo',
    message: `Lakukan reset saldo untuk ${mentor.name}?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Reset Sekarang', color: 'negative', unelevated: true },
  }).onOk(async () => {
    try {
      const res = await api.patch(`/mentors/${mentor._id}/balance`, { reset: true }) //
      if (res.data.success) {
        $q.notify({ type: 'warning', message: 'Saldo direset ke 0' })
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
/* Style Anda tetap utuh */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
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
.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}
.rounded-24 {
  border-radius: 24px;
}
.shadow-brand {
  box-shadow: 0 15px 35px -5px rgba(0, 51, 135, 0.08) !important;
}
.border-subtle {
  border: 1px solid rgba(0, 51, 135, 0.05);
}
.bank-info-box {
  line-height: 1.2;
}
.font-mono {
  font-family: 'Courier New', Courier, monospace;
}
.mentor-finance-table :deep(.q-table__th) {
  font-weight: 800;
  color: #003387;
  background-color: #fafafa;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}
</style>
