<template>
  <q-page class="q-pa-lg" style="background-color: #f5f7fa">
    <div class="q-mb-lg">
      <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">
        Manajemen Keuangan Mentor
      </h1>
      <p class="text-subtitle1 text-grey-7">
        Verifikasi rekening bank, pantau saldo, dan kelola pembayaran mentor secara efisien.
      </p>
    </div>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card flat class="stat-card q-pa-md bg-white border-light">
          <div class="text-grey-7">Total Mentor Terdaftar</div>
          <div class="text-h4 text-weight-bold text-edulang-navy">{{ mentors.length }}</div>
        </q-card>
      </div>
    </div>

    <q-card flat class="content-card">
      <q-table
        title="Daftar Rekening & Saldo Mentor"
        :rows="mentors"
        :columns="columns"
        row-key="_id"
        :loading="loading"
        flat
        class="font-poppins"
      >
        <template v-slot:body-cell-bank="props">
          <q-td :props="props">
            <div v-if="props.row.bankDetails">
              <div class="text-weight-bold text-edulang-navy">
                {{ props.row.bankDetails.bankName }}
              </div>
              <div class="text-caption text-grey-8">{{ props.row.bankDetails.accountNumber }}</div>
              <div class="text-caption text-italic text-grey-6">
                {{ props.row.bankDetails.accountHolder }}
              </div>
            </div>
            <div v-else class="text-grey-5 italic">Belum diatur</div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props" class="text-center">
            <q-chip
              :color="props.row.isVerified ? 'green-1' : 'orange-1'"
              :text-color="props.row.isVerified ? 'green-9' : 'orange-9'"
              :label="props.row.isVerified ? 'VERIFIED' : 'PENDING'"
              class="text-weight-bold"
              dense
            />
          </q-td>
        </template>

        <template v-slot:body-cell-balance="props">
          <q-td :props="props" class="text-right text-weight-bolder text-primary">
            Rp {{ (props.row.balance || 0).toLocaleString('id-ID') }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-xs text-center">
            <q-btn
              v-if="props.row.bankDetails && !props.row.isVerified"
              color="positive"
              label="Approve"
              size="sm"
              unelevated
              no-caps
              icon="verified"
              @click="verifyBank(props.row._id)"
            />

            <q-btn
              color="negative"
              label="Reset Saldo"
              size="sm"
              outline
              no-caps
              icon="history_toggle_off"
              @click="confirmResetBalance(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
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
.text-edulang-navy {
  color: #003387;
}
.content-card {
  border-radius: 15px;
  background: white;
  border: 1px solid #eef0f3;
}
.stat-card {
  border-radius: 12px;
}
.border-light {
  border: 1px solid #e0e0e0;
}
</style>
