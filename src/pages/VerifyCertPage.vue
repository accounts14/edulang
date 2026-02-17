<template>
  <q-page class="bg-edulang-background flex flex-center q-pa-md">
    <div class="verify-container full-width">
      <div class="text-center q-mb-xl">
        <div class="logo-box q-mx-auto q-mb-lg shadow-brand">
          <img src="~assets/LogoWhite.png" alt="Edulang" class="logo-img" />
        </div>
        <h1 class="text-h4 text-weight-bolder text-edulang-navy font-outfit q-ma-none">
          Verifikasi <span class="text-edulang-blue">Sertifikat</span>
        </h1>
        <p class="text-grey-7 q-mt-sm">Pastikan keaslian sertifikat Anda dalam sistem Edulang</p>
      </div>

      <q-card flat class="rounded-24 shadow-brand bg-white q-pa-lg border-subtle">
        <q-form @submit="handleVerify" class="q-gutter-y-md">
          <div class="field-label text-weight-bold text-edulang-navy q-ml-sm">Nomor Sertifikat</div>
          <q-input
            v-model="certNumber"
            outlined
            rounded
            placeholder="Contoh: EDULANG-2026-001"
            bg-color="white"
            class="edulang-input shadow-sm"
            :rules="[(v) => !!v || 'Nomor sertifikat wajib diisi']"
          >
            <template #prepend>
              <q-icon name="verified_user" color="edulang-blue" />
            </template>
          </q-input>

          <q-btn
            type="submit"
            unelevated
            rounded
            color="edulang-navy"
            class="full-width q-py-md text-weight-bolder auth-main-btn"
            label="Verifikasi Sekarang"
            :loading="loading"
          />
        </q-form>
      </q-card>

      <div class="text-center q-mt-xl">
        <p class="text-caption text-grey-5">
          &copy; 2026 Edulang Education Consultant. All rights reserved.
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const certNumber = ref('')
const loading = ref(false)

const handleVerify = () => {
  if (certNumber.value) {
    loading.value = true
    router.push({
      name: 'CertificateStatus', // Menggunakan name lebih aman daripada path
      query: { id: certNumber.value.trim() },
    })
  }
}
</script>

<style scoped>
.verify-container {
  max-width: 450px;
}
.logo-box {
  width: 70px;
  height: 70px;
  background: #003387;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}
.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.bg-edulang-background {
  background-color: #f5f7fa;
}
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.rounded-24 {
  border-radius: 24px;
}
.shadow-brand {
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.08);
}
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.auth-main-btn {
  background: #003387 !important;
  transition: all 0.3s ease;
}
.auth-main-btn:hover {
  background: #0089ff !important;
  transform: translateY(-2px);
}
</style>
