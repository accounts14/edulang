<template>
  <q-page class="q-pa-md q-pa-sm-xl bg-edulang-white">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-btn
          flat
          no-caps
          color="edulang-navy"
          icon="arrow_back"
          label="Kembali ke Manajemen Bahasa"
          class="q-mb-md text-weight-bold btn-back"
          @click="handleCancel"
        />

        <q-card flat class="rounded-24 shadow-brand overflow-hidden bg-white">
          <div class="bg-edulang-navy" style="height: 8px"></div>

          <q-card-section class="q-pa-lg q-pa-md-xl">
            <div class="row items-center q-mb-xl">
              <div class="bg-edulang-blue-light q-pa-md rounded-12 q-mr-md">
                <q-icon name="edit_note" color="edulang-blue" size="sm" />
              </div>
              <div>
                <div class="text-h5 text-weight-bolder text-edulang-navy font-outfit">
                  Edit Kategori
                </div>
                <div class="text-caption text-grey-7">
                  Perbarui informasi bahasa:
                  <span class="text-weight-bold text-edulang-blue">{{ form.name }}</span>
                </div>
              </div>
            </div>

            <q-form @submit.prevent="handleSubmit" class="q-gutter-y-lg">
              <div>
                <div class="text-subtitle2 text-edulang-navy q-mb-xs font-outfit">Nama Bahasa</div>
                <q-input
                  v-model="form.name"
                  outlined
                  dense
                  placeholder="Masukkan nama bahasa"
                  class="custom-input"
                  :rules="[(v) => !!v || 'Nama bahasa wajib diisi']"
                />
              </div>

              <div>
                <div class="text-subtitle2 text-edulang-navy q-mb-xs font-outfit">
                  URL Icon Bahasa (Bendera)
                </div>
                <div class="row q-col-gutter-sm items-start">
                  <div class="col">
                    <q-input
                      v-model="form.iconUrl"
                      dense
                      outlined
                      placeholder="https://flagcdn.com/..."
                      type="url"
                      hint="Contoh: https://flagcdn.com/id.svg"
                    />
                  </div>
                  <div class="col-auto">
                    <div class="preview-frame border-grey flex flex-center rounded-8 bg-light">
                      <q-img
                        v-if="form.iconUrl"
                        :src="form.iconUrl"
                        style="width: 48px; height: 34px"
                        fit="cover"
                      />
                      <q-icon v-else name="hide_image" color="grey-4" size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="text-subtitle2 text-edulang-navy q-mb-xs font-outfit">Deskripsi</div>
                <q-input
                  v-model="form.description"
                  dense
                  outlined
                  type="textarea"
                  placeholder="Tambahkan deskripsi singkat mengenai bahasa ini..."
                  autogrow
                />
              </div>

              <div class="row q-col-gutter-md q-pt-lg">
                <div class="col-12 col-sm-6 order-last order-sm-first">
                  <q-btn
                    label="Batal"
                    flat
                    no-caps
                    class="full-width rounded-12 text-weight-bold text-grey-7"
                    :disable="submitting"
                    @click="handleCancel"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-btn
                    type="submit"
                    color="edulang-blue"
                    unelevated
                    no-caps
                    class="full-width rounded-12 text-weight-bold q-py-sm btn-hover-effect"
                    label="Simpan Perubahan"
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
import { reactive, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
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

const fetchDetail = async () => {
  try {
    const res = await api.get(`/language-types/${route.params.id}`)
    const data = res.data?.languagetype || res.data?.data || res.data
    form.name = data?.name || ''
    form.iconUrl = data?.iconUrl || data?.icon_url || ''
    form.description = data?.description || ''
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memuat detail kategori bahasa.',
    })
    handleCancel()
  }
}

onMounted(fetchDetail)

const handleSubmit = async () => {
  try {
    submitting.value = true
    const payload = {
      name: form.name,
      description: form.description,
    }
    if (form.iconUrl?.trim()) payload.iconUrl = form.iconUrl.trim()

    await api.put(`/language-types/${route.params.id}`, payload)

    $q.notify({ type: 'positive', message: 'Kategori bahasa berhasil diperbarui.', timeout: 1800 })
    router.push('/admin/kategori')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memperbarui kategori bahasa.',
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

/* Warna Brand Edulang */
.bg-edulang-white {
  background-color: #f5f7fa !important;
}
.text-edulang-navy {
  color: #003387 !important;
}
.text-edulang-blue {
  color: #0089ff !important;
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

/* Layouting */
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

.preview-frame {
  width: 64px;
  height: 44px;
  border: 2px dashed #e0e6ed;
  background: #ffffff;
}

/* Hover & Transitions */
.btn-back {
  transition: transform 0.2s ease;
}
.btn-back:hover {
  transform: translateX(-5px);
}

.btn-hover-effect {
  transition: all 0.3s ease;
}
.btn-hover-effect:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 12px rgba(0, 137, 255, 0.3);
}

/* Responsivitas untuk layar kecil */
@media (max-width: 600px) {
  .q-pa-xl {
    padding: 24px !important;
  }
  .text-h5 {
    font-size: 1.25rem;
  }
}
</style>
