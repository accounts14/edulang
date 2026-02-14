<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="q-mb-xl">
      <div class="row items-center q-gutter-x-sm text-caption text-grey-6 q-mb-xs">
        <span>Dashboard</span>
        <q-icon name="chevron_right" />
        <span class="text-edulang-blue text-weight-bold">Rekening & Saldo</span>
      </div>
      <h1 class="text-h4 text-weight-bold text-edulang-navy q-ma-none">Manajemen Keuangan</h1>
      <p class="text-subtitle1 text-grey-7 q-mt-xs">
        Atur rekening bank untuk pencairan dana dan pantau saldo Anda.
      </p>
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <q-card flat class="content-card q-pa-lg">
          <div class="row items-center justify-between q-mb-lg">
            <div class="text-h6 text-edulang-navy text-weight-bold flex items-center">
              <q-icon name="account_balance" color="primary" class="q-mr-sm" size="28px" />
              Detail Bank
            </div>
            <q-badge :color="bankData.isVerified ? 'green' : 'orange'" class="q-pa-sm">
              {{ bankData.isVerified ? 'TERVERIFIKASI' : 'MENUNGGU VERIFIKASI' }}
            </q-badge>
          </div>

          <q-form @submit.prevent="updateBankDetails">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <label class="label-custom">Nama Bank</label>
                <q-input
                  v-model="bankForm.bankName"
                  outlined
                  dense
                  placeholder="Contoh: BCA, Mandiri"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Nama bank wajib diisi']"
                />
              </div>

              <div class="col-12 col-sm-6">
                <label class="label-custom">Nomor Rekening</label>
                <q-input
                  v-model="bankForm.accountNumber"
                  outlined
                  dense
                  placeholder="Masukkan nomor rekening"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Nomor rekening wajib diisi']"
                />
              </div>

              <div class="col-12">
                <label class="label-custom">Nama Pemilik Rekening</label>
                <q-input
                  v-model="bankForm.accountHolder"
                  outlined
                  dense
                  placeholder="Sesuai nama di buku tabungan"
                  class="custom-input"
                  :rules="[(val) => !!val || 'Nama pemilik wajib diisi']"
                />
              </div>

              <div class="col-12 q-mt-md">
                <q-btn
                  label="Update Rekening"
                  unelevated
                  no-caps
                  class="btn-edulang-primary rounded-btn q-px-xl"
                  type="submit"
                  :loading="loading.bank"
                />
              </div>
            </div>
          </q-form>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat class="balance-card q-pa-lg text-white q-mb-lg">
          <div class="text-subtitle1 opacity-80">Total Saldo</div>
          <div class="text-h3 text-weight-bolder q-my-sm">
            Rp {{ (balanceData.balance || 0).toLocaleString('id-ID') }}
          </div>
          <div class="row items-center q-mt-md">
            <q-icon name="info" size="xs" class="q-mr-xs" />
            <div class="text-caption">Status Bank: {{ balanceData.bankStatus || 'Pending' }}</div>
          </div>
        </q-card>

        <q-card flat bordered class="content-card q-pa-md">
          <div class="text-weight-bold text-edulang-navy q-mb-sm">Bantuan</div>
          <p class="text-caption text-grey-7">
            Verifikasi bank dilakukan manual oleh admin dalam 1x24 jam. Pastikan data sudah benar.
          </p>
          <q-btn
            label="Hubungi Support"
            flat
            no-caps
            color="primary"
            class="full-width border-light rounded-btn"
            icon="headset_mic"
          />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// State Data
const bankData = ref({ isVerified: false })
const balanceData = ref({ balance: 0, bankStatus: 'Pending' })
const bankForm = ref({
  bankName: '',
  accountNumber: '',
  accountHolder: '',
})

const loading = ref({
  bank: false,
  page: true,
})

// 1. Ambil Detail Bank (GET /mentors/bank-details)
async function fetchBankDetails() {
  try {
    // Prefix /api DIHAPUS karena sudah ada di baseURL axios.js
    const res = await api.get('/mentors/bank-details')
    if (res.data.success && res.data.bankDetails) {
      bankData.value = res.data.bankDetails
      bankForm.value = {
        bankName: res.data.bankDetails.bankName || '',
        accountNumber: res.data.bankDetails.accountNumber || '',
        accountHolder: res.data.bankDetails.accountHolder || '',
      }
    }
  } catch (err) {
    console.error('Error fetching bank details', err)
  }
}

// 2. Ambil Saldo (GET /mentors/my/balance/balance)
async function fetchBalance() {
  try {
    // Prefix /api DIHAPUS
    const res = await api.get('/mentors/my/balance/balance')
    if (res.data.success) {
      balanceData.value = {
        balance: res.data.balance || 0,
        bankStatus: res.data.bankStatus || 'Pending',
      }
    }
  } catch (err) {
    console.error('Error fetching balance', err)
  }
}

// 3. Update Bank (PUT /mentors/bank-details)
async function updateBankDetails() {
  loading.value.bank = true
  try {
    // Prefix /api DIHAPUS
    const res = await api.put('/mentors/bank-details', bankForm.value)
    if (res.data.success) {
      $q.notify({
        type: 'positive',
        message: res.data.message || 'Data bank berhasil diperbarui. Menunggu verifikasi admin.',
      })
      await fetchBankDetails() // Refresh status verifikasi
    }
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Gagal memperbarui data bank.',
    })
  } finally {
    loading.value.bank = false
  }
}

onMounted(() => {
  fetchBankDetails()
  fetchBalance()
})
</script>

<style scoped>
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}

.content-card {
  border-radius: 20px;
  background: white;
  border: 1px solid #eef0f3;
  box-shadow: 0 4px 25px rgba(0, 51, 135, 0.05) !important;
}

.balance-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #003387 0%, #0089ff 100%);
  box-shadow: 0 10px 20px rgba(0, 51, 135, 0.2);
}

.label-custom {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #003387;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.rounded-btn {
  border-radius: 12px;
}
.btn-edulang-primary {
  background: #003387;
  color: white;
}
.border-light {
  border: 1px solid #e0e0e0;
}
.opacity-80 {
  opacity: 0.8;
}
</style>
