<template>
  <q-page class="q-pa-xl" style="background-color: #f5f7fa">
    <div class="row justify-between items-end q-mb-xl">
      <div class="col-12 col-md-8">
        <div class="text-edulang-blue text-weight-bolder text-uppercase letter-spacing-1">
          #DiskusiMentor
        </div>
        <div class="text-h4 text-weight-bold text-edulang-navy q-mt-sm leading-tight">
          Diskusi User <br />
          Kelola Pertanyaan Siswa
        </div>
        <div class="text-subtitle2 text-grey-7 q-mt-md max-width-600">
          Pilih paket kelas di bawah ini untuk melihat dan membalas diskusi dari para siswa Anda.
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-ios color="primary" size="60px" />
    </div>

    <div v-else-if="packages.length === 0" class="flex flex-center q-pt-xl">
      <q-card flat class="bg-white q-pa-xl text-center shadow-1 rounded-borders-24 border-dashed">
        <q-icon name="forum" size="80px" color="grey-3" class="q-mb-lg" />
        <div class="text-h5 text-edulang-navy text-weight-bold">Belum ada diskusi</div>
        <p class="text-grey-6 q-mt-sm">
          Paket kelas Anda belum memiliki aktivitas diskusi saat ini.
        </p>
      </q-card>
    </div>

    <div v-else class="row q-col-gutter-xl">
      <div v-for="pkg in packages" :key="pkg._id" class="col-12 col-sm-6 col-lg-4">
        <q-card
          class="package-card no-shadow border-light rounded-borders-20 cursor-pointer"
          @click="goToDiscuss(pkg._id)"
        >
          <q-img
            :src="
              pkg.imageUrl ||
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'
            "
            :ratio="16 / 9"
          />

          <q-card-section class="q-pa-lg">
            <div class="text-edulang-navy text-weight-bolder text-h6 line-clamp-1 q-mb-xs">
              {{ pkg.title || 'Kelas Tanpa Judul' }}
            </div>

            <div class="row items-center text-grey-6 q-mb-md">
              <q-icon name="person" size="16px" class="q-mr-xs" />
              <span class="text-caption">Oleh Mentor: {{ mentorName }}</span>
            </div>

            <div class="row items-center justify-between">
              <div class="text-weight-bolder text-h5 text-edulang-blue">
                Rp {{ (pkg.price || 0).toLocaleString('id-ID') }}
              </div>
              <div class="text-caption text-grey-6">{{ pkg.lessonCount || 0 }} Materi</div>
            </div>
          </q-card-section>

          <q-separator color="grey-1" />

          <q-card-actions class="q-px-lg q-py-md bg-grey-1 flex justify-between items-center">
            <div class="text-caption text-grey-7">
              Status: <span class="text-positive text-weight-bold">Aktif</span>
            </div>
            <q-btn
              unelevated
              no-caps
              label="Buka Forum Diskusi"
              color="primary"
              icon="chat"
              class="rounded-btn q-px-md text-weight-bold"
              style="background-color: #003387 !important"
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
import { useRouter } from 'vue-router'

const router = useRouter()
const packages = ref([])
const loading = ref(true)
const mentorName = ref(localStorage.getItem('userName') || 'Mentor')

const fetchMentorPackages = async () => {
  try {
    loading.value = true
    // Mengambil data khusus milik mentor yang login
    const response = await api.get('/packages/mentor/packages')

    // Berdasarkan log: data array ada di response.data.packages
    if (response.data && response.data.packages) {
      packages.value = response.data.packages
    }
  } catch (error) {
    console.error('Gagal mengambil data:', error)
  } finally {
    loading.value = false
  }
}

const goToDiscuss = (id) => {
  router.push({ name: 'MentorDiscussDetail', params: { packageId: id } })
}

onMounted(fetchMentorPackages)
</script>

<style scoped>
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
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
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
