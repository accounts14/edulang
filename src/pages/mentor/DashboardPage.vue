<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center q-mb-xl">
      <div class="col-12 col-md-8">
        <div class="text-orange-9 text-weight-bold">#Kelas</div>
        <div class="text-h4 text-weight-bolder text-indigo-10 q-mt-sm">
          Ruang Berkarya para Mentor Edulang
        </div>
        <div class="text-grey-7 q-mt-xs">
          Kelola jalur pembelajaran yang kamu dampingi, pantau progress peserta, dan pastikan setiap
          langkah terarah.
        </div>
      </div>
      <div class="col-12 col-md-auto q-mt-md">
        <q-btn
          unelevated
          color="primary"
          label="Tambahkan Program Baru"
          no-caps
          class="rounded-borders q-px-lg"
          @click="goToAddPackage"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="packages.length === 0 && !loading">
      <div class="text-center q-pt-xl">
        <q-icon name="folder_open" size="64px" color="grey-5" class="q-mb-md" />
        <div class="text-h6 text-grey-8">Belum ada kelas</div>
        <p class="text-grey-6 q-mt-sm">Mulailah dengan membuat program baru.</p>
      </div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div v-for="pkg in packages" :key="pkg._id || pkg.id" class="col-12 col-sm-6 col-md-4">
        <q-card
          class="my-card no-shadow border-light rounded-borders-16 cursor-pointer"
          @click="goToPackage(pkg)"
        >
          <q-img :src="pkg.imageUrl || 'https://cdn.quasar.dev/img/parallax2.jpg'" :ratio="16 / 9">
            <div class="absolute-bottom-right bg-transparent q-pa-xs">
              <q-icon name="flag" color="negative" size="sm" />
            </div>
          </q-img>

          <q-card-section>
            <div class="text-indigo-10 text-weight-bold text-subtitle1">
              {{ pkg.title || pkg.name || 'Kelas Tanpa Judul' }}
            </div>
            <div class="text-grey-6 text-caption">Trainer : {{ mentorData.name }}</div>
            <div class="text-weight-bolder text-h6 q-mt-sm text-dark">
              Rp {{ (pkg.price || 0).toLocaleString('id-ID') }}
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pb-md q-pr-md">
            <q-btn
              flat
              round
              color="orange-5"
              icon="edit_note"
              size="sm"
              @click.stop="goEditPackage(pkg)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete_outline"
              size="sm"
              @click.stop="confirmDeletePackage(pkg)"
            />
            <q-btn flat round color="primary" icon="filter_list" size="sm" />
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
.rounded-borders-16 {
  border-radius: 16px;
  overflow: hidden;
}
.border-light {
  border: 1px solid #edf2f7;
}
.my-card {
  transition: transform 0.2s;
}
.my-card:hover {
  transform: translateY(-5px);
}
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
