<template>
  <q-page class="q-pa-md q-pa-sm-xl bg-edulang-white">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-btn
          flat
          no-caps
          color="edulang-navy"
          icon="arrow_back"
          label="Kembali ke Daftar"
          class="q-mb-md text-weight-bold"
          @click="handleCancel"
        />

        <q-card flat class="rounded-24 shadow-brand overflow-hidden bg-white">
          <div class="bg-edulang-blue" style="height: 8px"></div>

          <q-card-section class="q-pa-xl">
            <div class="row items-center q-mb-xl">
              <div class="bg-edulang-blue-light q-pa-md rounded-12 q-mr-md">
                <q-icon name="add_circle" color="edulang-blue" size="sm" />
              </div>
              <div>
                <div class="text-h5 text-weight-bolder text-edulang-navy font-outfit">
                  Tambah Kategori
                </div>
                <div class="text-caption text-grey-7">
                  Lengkapi informasi bahasa baru untuk ekosistem Edulang
                </div>
              </div>
            </div>

            <q-form @submit.prevent="handleSubmit" class="q-gutter-y-lg">
              <div>
                <div class="text-subtitle2 text-edulang-navy q-mb-xs font-outfit">Nama Bahasa</div>
                <q-input
                  v-model="form.name"
                  placeholder="Contoh: Mandarin Taiwan"
                  outlined
                  dense
                  class="custom-input"
                  :rules="[(v) => !!v || 'Nama bahasa wajib diisi']"
                />
              </div>

              <div>
                <div class="text-subtitle2 text-edulang-navy q-mb-xs font-outfit">
                  URL Icon (Bendera)
                </div>
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <q-input
                      v-model="form.iconUrl"
                      placeholder="https://flagcdn.com/..."
                      outlined
                      dense
                      type="url"
                      hint="Gunakan format .svg atau .png"
                    />
                  </div>
                  <div class="col-auto">
                    <div class="preview-box border-grey flex flex-center rounded-8 overflow-hidden">
                      <q-img
                        v-if="form.iconUrl"
                        :src="form.iconUrl"
                        style="width: 45px; height: 32px"
                      />
                      <q-icon v-else name="image" color="grey-4" size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="text-subtitle2 text-edulang-navy q-mb-xs font-outfit">Deskripsi</div>
                <q-input
                  v-model="form.description"
                  type="textarea"
                  placeholder="Jelaskan secara singkat mengenai kategori bahasa ini..."
                  outlined
                  dense
                  autogrow
                />
              </div>

              <div class="row q-col-gutter-md q-pt-lg">
                <div class="col-12 col-sm-6">
                  <q-btn
                    label="Batal"
                    flat
                    no-caps
                    class="full-width rounded-12 text-weight-bold text-grey-7"
                    @click="handleCancel"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-btn
                    type="submit"
                    color="edulang-navy"
                    unelevated
                    no-caps
                    class="full-width rounded-12 text-weight-bold q-py-sm btn-hover-effect"
                    label="Simpan Kategori"
                    :loading="submitting"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const router = useRouter()
const submitting = ref(false)

const form = reactive({
  name: '',
  iconUrl: '',
  description: '',
})

const handleCancel = () => {
  router.push('/admin/kategori')
}

const handleSubmit = async () => {
  try {
    submitting.value = true

    // Memastikan semua field terkirim sesuai dokumentasi image_893f4b.png
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      iconUrl: form.iconUrl?.trim() || '', // Menggunakan 'iconUrl' sesuai image_893f4b.png
    }

    // Mengirim ke endpoint POST /api/language-types
    await api.post('/language-types', payload)

    $q.notify({
      type: 'positive',
      message: 'Kategori bahasa berhasil ditambahkan.',
      timeout: 1800,
    })
    router.push('/admin/kategori')
  } catch (error) {
    // Menampilkan pesan error spesifik dari server jika ada
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal menambahkan kategori bahasa.',
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

/* Warna Brand */
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
.bg-edulang-blue-light {
  background-color: rgba(0, 137, 255, 0.1);
}

/* Layout & Elements */
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
  box-shadow: 0 20px 40px -10px rgba(0, 51, 135, 0.1) !important;
}

.custom-input :deep(.q-field__control) {
  border-radius: 10px;
}

.preview-box {
  width: 60px;
  height: 40px;
  border: 2px dashed #e0e0e0;
  background: #fafafa;
}

.btn-hover-effect {
  transition: all 0.3s ease;
}
.btn-hover-effect:hover {
  filter: brightness(1.2);
  transform: translateY(-2px);
}
</style>
