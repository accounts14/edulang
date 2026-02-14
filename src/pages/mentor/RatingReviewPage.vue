<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-between items-end q-mb-xl">
      <div class="col-12 col-md-8">
        <div class="text-edulang-blue text-weight-bolder text-uppercase letter-spacing-1">
          #UmpanBalikSiswa
        </div>
        <div class="text-h4 text-weight-bold text-edulang-navy q-mt-sm leading-tight">
          {{ selectedPackage ? 'Detail Review' : 'Evaluasi Pengajaran' }} <br />
          {{ selectedPackage ? selectedPackage.title : 'Program Belajar Anda' }}
        </div>
        <div class="text-subtitle2 text-grey-7 q-mt-md max-width-600">
          {{
            selectedPackage
              ? 'Berikut adalah feedback jujur dari siswa untuk membantu Anda meningkatkan kualitas penyampaian materi.'
              : 'Pilih salah satu program di bawah ini untuk melihat rating dan ulasan mendalam dari peserta kelas Anda.'
          }}
        </div>
      </div>
      <div v-if="selectedPackage" class="col-12 col-md-auto q-mt-lg">
        <q-btn
          outline
          label="Kembali ke Daftar"
          icon="arrow_back"
          no-caps
          color="edulang-navy"
          class="rounded-btn q-px-lg shadow-sm bg-white"
          @click="selectedPackage = null"
        />
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-ios color="primary" size="60px" />
    </div>

    <div v-else-if="packages.length === 0" class="flex flex-center q-pt-xl">
      <q-card flat class="bg-white q-pa-xl text-center shadow-1 rounded-borders-24 border-dashed">
        <q-icon name="rate_review" size="80px" color="grey-3" class="q-mb-lg" />
        <div class="text-h5 text-edulang-navy text-weight-bold">Belum ada data review</div>
        <p class="text-grey-6 q-mt-sm">
          Anda belum memiliki program aktif atau belum ada siswa yang memberikan rating.
        </p>
      </q-card>
    </div>

    <div v-else-if="!selectedPackage" class="row q-col-gutter-xl">
      <div v-for="pkg in packages" :key="pkg._id || pkg.id" class="col-12 col-sm-6 col-lg-4">
        <q-card class="package-card no-shadow border-light rounded-borders-20">
          <q-img
            :src="
              pkg.imageUrl ||
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'
            "
            :ratio="16 / 9"
          >
            <div class="absolute-top-right bg-transparent q-pa-md">
              <q-badge
                color="white"
                text-color="edulang-navy"
                class="q-pa-sm text-weight-bold shadow-1 rounded-borders-8"
              >
                {{ pkg.type || 'Program' }}
              </q-badge>
            </div>
          </q-img>

          <q-card-section class="q-pa-lg">
            <div class="text-edulang-navy text-weight-bolder text-h6 line-clamp-1 q-mb-sm">
              {{ pkg.title }}
            </div>

            <div class="row items-center justify-between q-mt-md">
              <div class="row items-center">
                <q-icon name="star" color="amber" size="20px" />
                <span class="text-weight-bold q-ml-xs text-edulang-navy">
                  {{ getAverageRating(pkg._id || pkg.id) }}
                </span>
                <span class="text-caption text-grey-6 q-ml-xs">
                  ({{ getReviewCount(pkg._id || pkg.id) }} Review)
                </span>
              </div>

              <q-btn
                unelevated
                label="Cek Review"
                no-caps
                color="primary"
                class="rounded-btn q-px-md btn-edulang-primary"
                @click="showReviewsForPackage(pkg)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <!-- Rating Summary Card -->
      <div class="col-12 q-mb-lg">
        <q-card flat class="bg-white q-pa-lg rounded-borders-20 border-light shadow-sm">
          <div class="row items-center">
            <div class="col-auto">
              <div class="text-h2 text-weight-bold text-edulang-navy">
                {{ getAverageRating(selectedPackage._id || selectedPackage.id) }}
              </div>
              <q-rating
                :model-value="
                  parseFloat(getAverageRating(selectedPackage._id || selectedPackage.id))
                "
                readonly
                max="5"
                size="24px"
                color="amber"
                class="q-mt-sm"
              />
              <div class="text-caption text-grey-6 q-mt-xs">
                {{ getReviewCount(selectedPackage._id || selectedPackage.id) }} ulasan
              </div>
            </div>
            <q-separator vertical class="q-mx-lg" />
            <div class="col">
              <div class="text-subtitle1 text-edulang-navy text-weight-bold">Ringkasan Rating</div>
              <div class="text-body2 text-grey-7">
                Berdasarkan feedback dari siswa yang telah menyelesaikan program ini.
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <div v-if="filteredReviews.length === 0" class="col-12 text-center q-pa-xl">
        <div class="text-h6 text-grey-5">Belum ada ulasan untuk program ini.</div>
      </div>

      <div v-for="review in filteredReviews" :key="review.id" class="col-12 col-md-6">
        <q-card
          flat
          class="bg-white q-pa-lg rounded-borders-20 border-light shadow-sm review-item-card"
        >
          <div class="row items-center q-mb-md">
            <q-avatar size="48px" class="shadow-sm">
              <img
                :src="`https://ui-avatars.com/api/?name=${review.studentName}&background=0089ff&color=fff`"
              />
            </q-avatar>
            <div class="q-ml-md">
              <div class="text-weight-bold text-edulang-navy font-outfit">
                {{ review.studentName }}
              </div>
              <div class="text-caption text-grey-6">{{ review.date }}</div>
            </div>
            <q-spacer />
            <q-rating :model-value="review.rating" readonly max="5" size="18px" color="amber" />
          </div>
          <div class="text-body2 text-grey-8 leading-relaxed italic">"{{ review.comment }}"</div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const packages = ref([])
const ratingsData = ref({}) // Menyimpan data ratings per package { packageId: { avgRating, totalRatings, ratings[] } }
const loading = ref(true)
const selectedPackage = ref(null)

const fetchData = async () => {
  const userId = localStorage.getItem('userId')
  const userEmail = localStorage.getItem('userEmail')

  try {
    loading.value = true

    // 1. Fetch Packages (Sama seperti Dashboard)
    const resPkg = await api.get('/packages', { params: { mentorId: userId } })
    const pkgArray = extractPackagesArray(resPkg.data)
    packages.value = filterPackagesForCurrentMentor(pkgArray, { userId, userEmail })

    // 2. Fetch Ratings untuk setiap package
    for (const pkg of packages.value) {
      const pkgId = pkg._id || pkg.id
      await fetchRatingsForPackage(pkgId)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    $q.notify({ type: 'negative', message: 'Gagal memuat data review.' })
  } finally {
    loading.value = false
  }
}

// Fetch ratings untuk satu package menggunakan endpoint yang benar
const fetchRatingsForPackage = async (packageId) => {
  try {
    // Endpoint sesuai dokumentasi: GET /api/ratings/packages/:packageId
    const res = await api.get(`/ratings/packages/${packageId}`)
    ratingsData.value[packageId] = res.data
  } catch (error) {
    console.error(`Error fetching ratings for package ${packageId}:`, error)
    ratingsData.value[packageId] = { avgRating: 0, totalRatings: 0, ratings: [] }
  }
}

// Logic Utils (Diambil dari DashboardPage Anda)
const extractPackagesArray = (data) => {
  if (Array.isArray(data)) return data
  if (data.data && Array.isArray(data.data)) return data.data
  if (data.packages && Array.isArray(data.packages)) return data.packages
  return []
}

const filterPackagesForCurrentMentor = (list, { userId, userEmail }) => {
  if (!Array.isArray(list)) return []
  return list.filter((pkg) => {
    const mentor = pkg.mentor || pkg.trainer || pkg.owner || pkg.createdBy || null
    if (!mentor) return false
    const mentorUserId =
      mentor.userId ||
      mentor.user_id ||
      (mentor.user && (mentor.user._id || mentor.user.id)) ||
      mentor._id ||
      mentor.id
    return (
      (userId && String(mentorUserId) === String(userId)) ||
      (userEmail && String(mentor.email).toLowerCase() === String(userEmail).toLowerCase())
    )
  })
}

// Review Helpers - menggunakan data dari ratingsData
const getReviewCount = (pkgId) => {
  const data = ratingsData.value[pkgId]
  return data ? data.totalRatings || 0 : 0
}

const getAverageRating = (pkgId) => {
  const data = ratingsData.value[pkgId]
  return data && data.avgRating ? data.avgRating.toFixed(1) : '0.0'
}

const showReviewsForPackage = (pkg) => {
  selectedPackage.value = pkg
}

const filteredReviews = computed(() => {
  if (!selectedPackage.value) return []
  const pkgId = selectedPackage.value._id || selectedPackage.value.id
  const data = ratingsData.value[pkgId]

  if (!data || !data.ratings) return []

  return data.ratings.map((r) => ({
    id: r._id || r.id,
    studentName: r.user?.name || r.userName || 'Siswa Edulang',
    rating: r.rating || 5,
    comment: r.comment || 'Memberikan rating tanpa komentar.',
    date: new Date(r.createdAt || r.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }))
})

onMounted(fetchData)
</script>

<style scoped>
/* Color Palette & Typography */
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.btn-edulang-primary {
  background-color: #003387;
  color: white;
}
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.letter-spacing-1 {
  letter-spacing: 2px;
}
.leading-tight {
  line-height: 1.1;
}
.max-width-600 {
  max-width: 600px;
}
.rounded-borders-20 {
  border-radius: 20px;
}
.rounded-borders-24 {
  border-radius: 24px;
}
.rounded-borders-8 {
  border-radius: 8px;
}
.rounded-btn {
  border-radius: 12px;
}
.border-light {
  border: 1px solid #eef1f6;
}
.border-dashed {
  border: 2px dashed #d1d9e2;
  background: white;
}

/* Dashboard Card Style */
.package-card {
  background: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.package-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 51, 135, 0.08) !important;
  border-color: #0089ff;
}

.review-item-card {
  transition: all 0.3s ease;
  border-left: 4px solid #0089ff;
}
.review-item-card:hover {
  background-color: #f0f7ff;
}

.leading-relaxed {
  line-height: 1.6;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
