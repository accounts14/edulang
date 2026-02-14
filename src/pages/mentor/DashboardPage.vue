<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-between items-end q-mb-xl">
      <div class="col-12 col-md-8">
        <div class="text-edulang-blue text-weight-bolder text-uppercase letter-spacing-1">
          #RuangMentor
        </div>
        <div class="text-h4 text-weight-bold text-edulang-navy q-mt-sm leading-tight">
          Pusat Kendali <br />
          Program Belajar Anda
        </div>
        <div class="text-subtitle2 text-grey-7 q-mt-md max-width-600">
          Kelola kurikulum, pantau pertumbuhan peserta, dan hadirkan pengalaman belajar terbaik
          bersama Edulang.
        </div>
      </div>
      <div class="col-12 col-md-auto q-mt-lg">
        <q-btn
          unelevated
          label="Tambahkan Program Baru"
          icon="add"
          no-caps
          class="rounded-btn q-px-xl btn-edulang-primary shadow-2"
          @click="goToAddPackage"
        />
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-ios color="primary" size="60px" />
    </div>

    <div v-else-if="packages.length === 0 && !loading" class="flex flex-center q-pt-xl">
      <q-card flat class="bg-white q-pa-xl text-center shadow-1 rounded-borders-24 border-dashed">
        <q-icon name="auto_stories" size="80px" color="grey-3" class="q-mb-lg" />
        <div class="text-h5 text-edulang-navy text-weight-bold">Belum ada kelas aktif</div>
        <p class="text-grey-6 q-mt-sm">Waktunya berbagi ilmu. Buat program pertamamu sekarang.</p>
        <q-btn
          outline
          color="primary"
          label="Mulai Membuat"
          class="q-mt-md rounded-btn q-px-lg"
          @click="goToAddPackage"
        />
      </q-card>
    </div>

    <div v-else class="row q-col-gutter-xl">
      <div v-for="pkg in packages" :key="pkg._id || pkg.id" class="col-12 col-sm-6 col-lg-4">
        <q-card
          class="package-card no-shadow border-light rounded-borders-20 cursor-pointer"
          @click="goToPackage(pkg)"
        >
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
                {{ pkg.level || 'Umum' }}
              </q-badge>
            </div>
          </q-img>

          <q-card-section class="q-pa-lg">
            <div class="row justify-between items-start no-wrap q-mb-xs">
              <div class="text-edulang-navy text-weight-bolder text-h6 line-clamp-1">
                {{ pkg.title || 'Kelas Tanpa Judul' }}
              </div>
            </div>
            <div class="row items-center text-grey-6 q-mb-md">
              <q-icon name="person" size="16px" class="q-mr-xs" />
              <span class="text-caption">Oleh Mentor: {{ mentorData.name }}</span>
            </div>

            <div class="row items-center justify-between">
              <div class="text-weight-bolder text-h5 text-edulang-blue">
                Rp {{ (pkg.price || 0).toLocaleString('id-ID') }}
              </div>
              <div class="row q-gutter-x-xs">
                <q-btn
                  flat
                  round
                  color="edulang-navy"
                  icon="edit"
                  size="sm"
                  class="bg-grey-1"
                  @click.stop="goEditPackage(pkg)"
                >
                  <q-tooltip>Edit Program</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete_outline"
                  size="sm"
                  class="bg-red-1"
                  @click.stop="confirmDeletePackage(pkg)"
                >
                  <q-tooltip>Hapus</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <q-separator color="grey-1" />

          <q-card-actions class="q-px-lg q-py-sm bg-grey-1 flex justify-between">
            <div class="text-caption text-grey-7">
              Status: <span class="text-positive text-weight-bold">Aktif</span>
            </div>
            <q-btn
              flat
              no-caps
              label="Detail Program"
              color="primary"
              icon-right="chevron_right"
              dense
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const packages = ref([])
const loading = ref(true)
const mentorData = ref({ name: '' })

const goToAddPackage = () => {
  router.push('/mentor/packages/add')
}

const goEditPackage = (pkg) => {
  const id = pkg?._id || pkg?.id
  if (!id) return
  router.push(`/mentor/packages/${id}/edit`)
}

const confirmDeletePackage = (pkg) => {
  const id = pkg?._id || pkg?.id
  if (!id) return

  $q.dialog({
    title: 'Hapus Program',
    message: `Yakin ingin menghapus program "${pkg.title}"?`,
    ok: { label: 'Hapus', color: 'negative', unelevated: true },
    cancel: { label: 'Batal', flat: true },
  }).onOk(async () => {
    try {
      await api.delete(`/packages/${id}`)
      $q.notify({ type: 'positive', message: 'Program berhasil dihapus.' })
      // hapus dari list lokal supaya UI langsung ter-update
      packages.value = packages.value.filter((p) => (p._id || p.id) !== id)
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Gagal menghapus program.',
      })
    }
  })
}

const goToPackage = (pkg) => {
  const id = pkg?._id || pkg?.id
  if (!id) return
  router.push(`/mentor/packages/${id}`)
}

// Ekstrak array dari berbagai struktur respons
const extractPackagesArray = (data) => {
  if (Array.isArray(data)) return data

  // Kasus 1: { data: [...] }
  if (data.data && Array.isArray(data.data)) return data.data

  // Kasus 2: { packages: [...] }
  if (data.packages && Array.isArray(data.packages)) return data.packages

  // Kasus 3: { result: [...] }
  if (data.result && Array.isArray(data.result)) return data.result

  // Kasus 4: object tunggal → jadikan array 1 item
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    console.warn('Respons bukan array, diubah jadi [obj]:', data)
    return [data]
  }

  return []
}

// Utility untuk memastikan hanya paket milik mentor yang login yang ditampilkan,
// walaupun backend masih mengembalikan semua data.
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

    if (userId && mentorUserId && String(mentorUserId) === String(userId)) {
      return true
    }

    const mentorEmail = mentor.email || (mentor.user && mentor.user.email) || ''
    if (
      userEmail &&
      mentorEmail &&
      String(mentorEmail).toLowerCase() === String(userEmail).toLowerCase()
    ) {
      return true
    }

    return false
  })
}

const fetchMentorPackages = async () => {
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const userEmail = localStorage.getItem('userEmail')

  if (!token) {
    $q.notify({
      type: 'negative',
      message: 'Sesi tidak valid. Silakan login ulang.',
      timeout: 3000,
    })
    setTimeout(() => {
      window.location.href = '/login'
    }, 3000)
    return
  }

  try {
    loading.value = true

    // Gunakan query parameter untuk filter di backend (jika backend mendukung)
    const response = await api.get('/packages', {
      params: {
        mentorId: userId,
      },
    })

    console.log('[RAW PACKAGES RESP]', response.data)

    const rawData = response.data
    const pkgArray = extractPackagesArray(rawData)

    // Filter lagi di frontend berdasarkan mentor yang sedang login,
    // agar mentor tidak bisa melihat paket milik mentor lain.
    packages.value = filterPackagesForCurrentMentor(pkgArray, { userId, userEmail })
    mentorData.value.name = localStorage.getItem('userName') || 'Mentor'

    if (pkgArray.length === 0) {
      console.warn('Tidak ada paket ditemukan untuk mentor ini')
    }
  } catch (error) {
    console.error('[FETCH ERROR]', error.response?.data || error.message)
    // ... error handling sama seperti sebelumnya
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMentorPackages()
})
</script>

<style scoped>
/* Color Palette from Edulang Brand Guideline */
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

/* Typography */
.letter-spacing-1 {
  letter-spacing: 2px;
}
.leading-tight {
  line-height: 1.1;
}
.max-width-600 {
  max-width: 600px;
}

/* Card & Borders */
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

.package-card {
  background: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.package-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 51, 135, 0.08) !important;
  border-color: #0089ff;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Badge styling */
.q-badge {
  border: 1px solid #eef1f6;
}
</style>
