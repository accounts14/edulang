<template>
  <q-page class="user-review-page q-pa-lg q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <q-btn
        flat
        round
        icon="arrow_back"
        color="primary"
        @click="$router.push({ name: 'UserProgres' })"
        class="q-mr-sm"
      />
      <div class="accent-bar q-mr-md"></div>
      <div>
        <h1 class="text-h4 text-weight-bolder text-edulang-navy q-my-none">Rating & Ulasan</h1>
        <p class="text-body2 text-grey-6 q-mt-xs">
          Lihat ulasan pengguna lain dan bagikan pengalamanmu.
        </p>
      </div>
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-5">
        <q-card flat class="rounded-20 bg-white shadow-soft q-pa-lg sticky-card">
          <div class="text-h6 text-weight-bold text-edulang-navy q-mb-md">
            {{ isEditing ? 'Edit Ulasan Anda' : 'Tulis Ulasan' }}
          </div>

          <q-form @submit="handleFormSubmit" class="column q-gutter-y-md">
            <div class="text-center bg-grey-1 q-pa-sm rounded-12">
              <q-rating
                v-model="form.rating"
                size="3em"
                color="orange"
                icon="star_border"
                icon-selected="star"
                no-dimming
              />
              <div class="text-caption text-primary text-weight-bold">{{ ratingLabel }}</div>
            </div>

            <q-input
              v-model="form.comment"
              type="textarea"
              outlined
              dense
              placeholder="Tulis ulasan belajar Anda di sini..."
              class="rounded-12"
              :rules="[(val) => !!val || 'Ulasan tidak boleh kosong']"
            />

            <div class="row q-gutter-x-sm">
              <q-btn
                type="submit"
                :color="isEditing ? 'orange-8' : 'primary'"
                :label="isEditing ? 'Perbarui' : 'Kirim Ulasan'"
                class="col rounded-12 text-weight-bold"
                :loading="submitting"
                unelevated
                no-caps
              />
              <q-btn
                v-if="isEditing"
                outline
                color="grey-7"
                label="Batal"
                class="col rounded-12"
                @click="resetForm"
                no-caps
              />
            </div>
          </q-form>
        </q-card>
      </div>

      <div class="col-12 col-md-7">
        <div class="column q-gutter-y-md">
          <div class="row items-center justify-between bg-white q-pa-md rounded-20 shadow-soft">
            <div class="row items-center">
              <div class="text-h4 text-weight-bolder text-orange q-mr-sm">
                {{ currentRatingInfo.avgRating }}
              </div>
              <div>
                <q-rating
                  :model-value="currentRatingInfo.avgRating"
                  size="18px"
                  color="orange"
                  readonly
                />
                <div class="text-caption text-grey-7">
                  {{ currentRatingInfo.totalRatings }} Ulasan
                </div>
              </div>
            </div>
          </div>

          <div v-if="allRatings.length > 0" class="column q-gutter-y-sm">
            <q-card
              v-for="rev in allRatings"
              :key="rev._id"
              flat
              class="rounded-12 border-light q-pa-md"
            >
              <div class="row justify-between items-start">
                <div class="row items-center">
                  <q-avatar color="primary" text-color="white" size="32px" class="q-mr-sm">
                    {{ rev.user?.name?.charAt(0) || 'U' }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold text-edulang-navy">
                      {{ rev.user?.name || 'User Edulang' }}
                      <q-badge
                        v-if="checkIfMyReview(rev)"
                        color="blue-1"
                        text-color="blue-8"
                        label="Ulasan Anda"
                        class="q-ml-xs"
                      />
                    </div>
                    <q-rating :model-value="rev.rating" size="12px" color="orange" readonly />
                  </div>
                </div>

                <!-- 🔹 TOMBOL EDIT SAJA (Delete dihapus) -->
                <div v-if="checkIfMyReview(rev)">
                  <q-btn flat round size="sm" color="blue" icon="edit" @click="prepareEdit(rev)" />
                </div>
              </div>
              <div class="text-body2 text-grey-8 q-mt-sm">{{ rev.comment }}</div>
            </q-card>
          </div>

          <div v-else class="text-center q-pa-xl bg-white rounded-20 shadow-soft">
            <q-icon name="chat_bubble_outline" size="48px" color="grey-4" />
            <div class="text-grey-6 q-mt-md">Belum ada ulasan untuk kelas ini.</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

const packageId = route.params.packageId
const submitting = ref(false)
const isEditing = ref(false)
const allRatings = ref([])
const currentRatingInfo = ref({ avgRating: 0, totalRatings: 0 })

// ID User saat ini (untuk deteksi ulasan sendiri)
const currentUserId = ref(localStorage.getItem('userId') || null)

const form = ref({
  package: packageId,
  rating: 5,
  comment: '',
})

const ratingLabel = computed(() => {
  const labels = ['Sangat Buruk', 'Kurang', 'Cukup Baik', 'Sangat Baik', 'Luar Biasa!']
  return labels[form.value.rating - 1] || 'Pilih Rating'
})

// Helper untuk cek apakah ini ulasan user
const checkIfMyReview = (rev) => {
  if (rev.isMyReview === true) return true
  return rev.user && rev.user._id === currentUserId.value
}

// 1. Ambil Data Ulasan
const fetchRatingData = async () => {
  try {
    const res = await api.get(`/ratings/packages/${packageId}`)
    const rawData = res.data.data || res.data

    currentRatingInfo.value = {
      avgRating: rawData.avgRating || 0,
      totalRatings: rawData.totalRatings || 0,
    }

    allRatings.value = rawData.ratings || []

    // Cek apakah user sudah punya ulasan
    const myReview = allRatings.value.find((r) => checkIfMyReview(r))
    if (myReview) {
      isEditing.value = true
      form.value.rating = myReview.rating
      form.value.comment = myReview.comment
    } else {
      isEditing.value = false
    }
  } catch (error) {
    console.error('Error fetching rating:', error)
  }
}

// 2. Masuk ke mode edit
const prepareEdit = (review) => {
  isEditing.value = true
  form.value.rating = review.rating
  form.value.comment = review.comment
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 3. Reset Form
const resetForm = () => {
  isEditing.value = false
  form.value.rating = 5
  form.value.comment = ''
}

// 4. Submit Form (POST atau PUT)
const handleFormSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      // 🔹 UPDATE: Gunakan endpoint yang benar sesuai gambar
      await api.put(`/ratings/packages/${packageId}`, {
        rating: form.value.rating,
        comment: form.value.comment,
      })
      $q.notify({ type: 'positive', message: 'Ulasan diperbarui!' })
    } else {
      // CREATE: Gunakan endpoint create biasa
      await api.post('/ratings/', form.value)
      $q.notify({ type: 'positive', message: 'Ulasan terkirim!' })
    }
    await fetchRatingData()
  } catch (error) {
    const msg = error.response?.data?.message || 'Gagal menyimpan ulasan'
    $q.notify({ type: 'negative', message: msg })
  } finally {
    submitting.value = false
  }
}

// 🔹 FUNGSI DELETE DIHAPUS

onMounted(() => {
  fetchRatingData()
})
</script>

<style scoped>
.text-edulang-navy {
  color: #003387;
}
.user-review-page {
  background: #f8fafc;
  min-height: 100vh;
}
.accent-bar {
  width: 6px;
  height: 45px;
  background: linear-gradient(to bottom, #0089ff, #003387);
  border-radius: 10px;
}
.rounded-20 {
  border-radius: 20px;
}
.rounded-12 {
  border-radius: 12px;
}
.shadow-soft {
  box-shadow: 0 10px 30px rgba(0, 51, 135, 0.05);
}
.border-light {
  border: 1px solid #edf2f7;
}
.sticky-card {
  position: sticky;
  top: 100px;
  z-index: 10;
}

@media (max-width: 960px) {
  .sticky-card {
    position: relative;
    top: 0;
  }
}
</style>
