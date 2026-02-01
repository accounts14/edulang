<template>
  <q-page class="bg-white">
    <section class="container q-py-xl row items-center reverse-wrap-mobile">
      <div class="col-12 col-md-6 q-pr-md-xl">
        <div class="text-warning text-weight-bold q-mb-sm">#MulaiSekarang</div>
        <h1 class="text-h3 text-weight-bold text-dark q-mb-md" style="line-height: 1.2">
          Pimpin Dunia Lewat Bahasa
        </h1>
        <p class="text-grey-7 text-body1 q-mb-lg">
          Platform kursus online terintegrasi untuk meningkatkan skill bahasa asing dengan metode
          interaktif.
        </p>
        <div class="q-gutter-md">
          <q-btn unelevated rounded color="primary" label="Mulai Belajar" class="q-px-lg q-py-sm" />
          <q-btn
            outline
            rounded
            color="primary"
            label="Explore Our Product"
            class="q-px-lg q-py-sm"
          />
        </div>
      </div>
      <div class="col-12 col-md-6 text-center">
        <q-img src="~assets/hero-bg.png" style="max-width: 450px" />
      </div>
    </section>

    <section class="container q-py-xl">
      <div class="text-center q-mb-xl">
        <h2 class="text-h4 text-weight-bold text-primary q-mb-md">
          Lebih Dari Sekadar Nonton Video
        </h2>
        <p class="text-grey-8 text-body1">
          Kami memastikan setiap menit belajar Anda terkonversi menjadi output nyata untuk masa
          depan.
        </p>
      </div>

      <div class="row q-col-gutter-lg justify-center">
        <div class="col-12 col-md-4">
          <q-card flat bordered class="method-card q-pa-lg full-height rounded-borders-16">
            <q-avatar
              color="blue-1"
              text-color="primary"
              icon="play_arrow"
              size="lg"
              class="q-mb-lg"
            />
            <div class="text-h6 text-weight-bold text-dark q-mb-sm">Interactive Course</div>
            <p class="text-body2 text-grey-8" style="line-height: 1.6">
              Materi video berkualitas tinggi yang dirancang agar mudah dipahami, dilengkapi quiz
              interaktif di setiap sesi.
            </p>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card
            flat
            class="method-card bg-primary text-white q-pa-lg full-height rounded-borders-16 shadow-10"
          >
            <q-avatar
              color="white-transparent"
              text-color="warning"
              icon="translate"
              size="lg"
              class="q-mb-lg"
            />
            <div class="text-h6 text-weight-bold q-mb-sm">Real Assessment</div>
            <p class="text-body2 text-blue-1" style="line-height: 1.6">
              Bukan cuma nonton. Ikuti tes simulasi (HSK, TOEFL, JLPT) untuk mengukur kemampuan riil
              kamu sebelum tes asli.
            </p>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat bordered class="method-card q-pa-lg full-height rounded-borders-16">
            <q-avatar
              color="amber-1"
              text-color="warning"
              icon="flight"
              size="lg"
              class="q-mb-lg"
            />
            <div class="text-h6 text-weight-bold text-dark q-mb-sm">Career & Study Path</div>
            <p class="text-body2 text-grey-8" style="line-height: 1.6">
              Output pembelajaran diarahkan langsung untuk persiapan kerja atau kuliah ke China,
              Jepang, Jerman, dll.
            </p>
          </q-card>
        </div>
      </div>
    </section>

    <section class="container q-py-xl">
      <div class="q-mb-xl">
        <div class="text-warning text-weight-bold">Panduan Belajar Bahasa</div>
        <h2 class="text-h4 text-weight-bold text-dark q-mt-xs">Langkah Belajar Kamu</h2>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6 col-md-3" v-for="(step, index) in learningSteps" :key="index">
          <q-card flat class="step-card q-pa-md rounded-borders-16 shadow-1 relative-position">
            <div class="row items-center no-wrap">
              <q-img src="~assets/step-icon.png" style="width: 60px; height: 60px" />
              <div class="q-ml-md">
                <div class="text-subtitle1 text-weight-bold text-primary">{{ step.title }}</div>
                <div class="text-caption text-grey-7">{{ step.desc }}</div>
              </div>
              <q-space />
              <q-icon name="chevron_right" color="grey-5" size="sm" />
            </div>
          </q-card>
        </div>
      </div>
    </section>

    <section class="bg-primary text-white q-py-xl overflow-hidden">
      <div class="container">
        <div class="text-center q-mb-xl">
          <q-chip
            color="warning"
            text-color="dark"
            label="Earn Your Language Certificate"
            class="text-weight-bold"
          />
          <h2 class="text-h4 text-weight-bold q-mt-md">Sertifikasi Resmi Berstandar Global</h2>
        </div>
      </div>

      <div class="scroll-container">
        <div class="scroll-content-left">
          <div
            v-for="(cert, index) in certifications"
            :key="'top-' + index"
            class="cert-card-wrapper"
          >
            <q-card flat class="row no-wrap items-center q-pa-md cert-card">
              <q-img :src="cert.logo" size="40px" class="q-mr-md cert-logo" />
              <div>
                <div class="text-weight-bolder text-dark text-h6">{{ cert.name }}</div>
                <div class="text-caption text-grey-7">{{ cert.desc }}</div>
              </div>
            </q-card>
          </div>
          <div
            v-for="(cert, index) in certifications"
            :key="'top-dup-' + index"
            class="cert-card-wrapper"
          >
            <q-card flat class="row no-wrap items-center q-pa-md cert-card">
              <q-img :src="cert.logo" size="40px" class="q-mr-md cert-logo" />
              <div>
                <div class="text-weight-bolder text-dark text-h6">{{ cert.name }}</div>
                <div class="text-caption text-grey-7">{{ cert.desc }}</div>
              </div>
            </q-card>
          </div>
        </div>
      </div>

      <div class="scroll-container q-mt-lg">
        <div class="scroll-content-right">
          <div
            v-for="(cert, index) in certifications.slice().reverse()"
            :key="'bot-' + index"
            class="cert-card-wrapper"
          >
            <q-card flat class="row no-wrap items-center q-pa-md cert-card">
              <q-img :src="cert.logo" size="40px" class="q-mr-md cert-logo" />
              <div>
                <div class="text-weight-bolder text-dark text-h6">{{ cert.name }}</div>
                <div class="text-caption text-grey-7">{{ cert.desc }}</div>
              </div>
            </q-card>
          </div>
          <div
            v-for="(cert, index) in certifications.slice().reverse()"
            :key="'bot-dup-' + index"
            class="cert-card-wrapper"
          >
            <q-card flat class="row no-wrap items-center q-pa-md cert-card">
              <q-img :src="cert.logo" size="40px" class="q-mr-md cert-logo" />
              <div>
                <div class="text-weight-bolder text-dark text-h6">{{ cert.name }}</div>
                <div class="text-caption text-grey-7">{{ cert.desc }}</div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <section class="container q-py-xl">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-warning text-weight-bold">Kelas Fast-Track</div>
          <h2 class="text-h4 text-weight-bold text-dark">Course Belajar Unggulan Edulang</h2>
        </div>
        <q-btn unelevated color="warning" text-color="dark" label="Lihat Semua Program" rounded />
      </div>

      <div v-if="loading" class="row q-col-gutter-md">
        <div class="col-12 col-md-4" v-for="n in 3" :key="n">
          <q-card flat bordered class="rounded-borders-16">
            <q-skeleton height="200px" square />
            <q-card-section>
              <q-skeleton type="text" class="text-h6" />
              <q-skeleton type="text" width="50%" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-else class="row q-col-gutter-lg">
        <div class="col-12 col-md-4" v-for="pkg in packages" :key="pkg._id">
          <q-card flat bordered class="course-card rounded-borders-16 full-height column">
            <q-img
              :src="pkg.introVideoUrl || 'https://placehold.co/600x400?text=Course+Thumbnail'"
              :ratio="16 / 9"
              class="rounded-borders-16-top"
            >
              <div class="absolute-bottom-right bg-transparent q-pa-sm">
                <q-chip
                  dense
                  color="white"
                  text-color="dark"
                  icon="signal_cellular_alt"
                  class="text-weight-bold"
                >
                  {{ pkg.level }}
                </q-chip>
              </div>
            </q-img>

            <q-card-section class="q-pb-none">
              <div class="text-h6 text-weight-bold ellipsis text-dark">{{ pkg.title }}</div>
              <div class="text-caption text-grey-7 ellipsis-2-lines q-mt-xs">
                {{ pkg.description }}
              </div>
            </q-card-section>

            <q-card-section class="q-pt-md">
              <div class="row items-center q-mb-md">
                <q-avatar size="24px" class="q-mr-sm">
                  <img src="https://cdn.quasar.dev/img/avatar.png" />
                </q-avatar>
                <div class="text-caption text-weight-medium text-grey-9">
                  {{ pkg.mentor?.name || 'Mentor Edulang' }}
                </div>
              </div>

              <div class="row items-center justify-between">
                <div class="text-h6 text-primary text-weight-bolder">
                  Rp {{ formatCurrency(pkg.price) }}
                </div>
                <div class="row items-center text-warning">
                  <q-icon name="star" size="18px" />
                  <span class="text-grey-8 q-ml-xs text-weight-bold">(4.8)</span>
                </div>
              </div>
            </q-card-section>

            <q-space />

            <q-card-actions class="q-pa-md">
              <q-btn
                unelevated
                outline
                color="primary"
                label="LIHAT DETAIL"
                class="full-width text-weight-bold"
                style="border-radius: 8px"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>

    <section class="bg-primary text-white">
      <div class="row">
        <div class="col-12 col-md-5 relative-position">
          <q-img
            src="~assets/lulus.png"
            class="full-height fit"
            style="min-height: 400px; object-fit: cover"
          />
        </div>
        <div class="col-12 col-md-7 q-pa-xl flex flex-center">
          <div>
            <q-chip
              color="warning"
              text-color="dark"
              label="Testimoni Alumni"
              class="q-mb-md"
              align="center"
            />
            <h2 class="text-h4 text-weight-bold q-mb-md">
              Melangkah Lebih Jauh Bersama Jaringan Alumni Kami
            </h2>
            <p class="q-mb-lg text-blue-1">
              Akses eksklusif ke jaringan profesional dan kesempatan karir global.
            </p>

            <div>
              <q-img src="~assets/Logo-affiliate.png" style="max-width: 100%; height: auto" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container q-py-xl">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <div class="text-warning text-weight-bold q-mb-sm">Eksklusif Untukmu</div>
          <h2 class="text-h4 text-weight-bold text-dark q-mb-md">Solusi Tepat Belajar Bahasa</h2>
          <p class="text-grey-7 q-mb-lg">Kuasai bahasa, buka pintu karier lebih lebar</p>

          <q-list class="q-mb-xl">
            <q-item v-for="(benefit, index) in solutions" :key="index" dense class="q-px-none">
              <q-item-section avatar>
                <q-icon name="check_circle" color="primary" />
              </q-item-section>
              <q-item-section class="text-weight-medium text-dark">
                {{ benefit }}
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-gutter-md">
            <q-btn unelevated rounded color="primary" label="Apply Now" class="q-px-lg" />
            <q-btn outline rounded color="primary" label="How It Works" class="q-px-lg" />
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center relative-position">
          <q-img src="~assets/Solusi.png" style="max-width: 500px" />
        </div>
      </div>
    </section>

<section class="bg-primary text-white q-py-xl overflow-hidden" style="min-height: 600px; display: flex; align-items: center;">
      <div class="container">
        <div class="row items-center q-col-gutter-xl">
          
          <div class="col-12 col-md-5">
            <div class="text-warning text-weight-bold q-mb-sm">
              500k Orang Sudah Melaju. Kamu Kapan?
            </div>
            <h2 class="text-h3 text-weight-bold q-mb-md" style="line-height: 1.2">
              Temukan Standar Baru dalam Berkarier
            </h2>
            <p class="text-white opacity-80 q-mb-xl text-body1">
              Bergabunglah dengan ekosistem belajar yang menjembatani ambisi Anda menuju karier di kancah global.
            </p>
            <div class="q-gutter-md">
              <q-btn unelevated rounded color="warning" text-color="dark" label="Alur Belajar" class="q-px-xl q-py-md text-weight-bold" />
              <q-btn outline rounded color="white" label="Update Student" class="q-px-xl q-py-md text-weight-bold" />
            </div>
          </div>

          <div class="col-12 col-md-7">
            <div class="testimonial-grid-wrapper">
              
              <div class="marquee-column">
                <div class="marquee-vertical down">
                  <div v-for="n in 2" :key="'group1-'+n" class="marquee-content">
                    <q-card v-for="(testi, i) in testimonials.slice(0, 3)" :key="i" class="q-mb-lg testimonial-card">
                      <q-card-section class="q-pa-lg">
                        <div class="row items-center no-wrap q-mb-md">
                          <q-avatar size="45px" class="q-mr-md">
                            <img :src="testi.avatar">
                          </q-avatar>
                          <div class="column">
                            <span class="text-weight-bold text-dark text-subtitle1">{{ testi.name }}</span>
                            <q-badge color="blue-1" text-color="primary" class="q-py-xs q-px-sm text-weight-bold">
                              {{ testi.course }}
                            </q-badge>
                          </div>
                        </div>
                        <div class="text-weight-bold text-dark q-mb-xs">{{ testi.title }}</div>
                        <div class="text-body2 text-grey-8 line-height-1-5">{{ testi.comment }}</div>
                        <q-rating :model-value="5" readonly size="16px" color="orange" class="q-mt-md" />
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>

              <div class="marquee-column">
                <div class="marquee-vertical up">
                  <div v-for="n in 2" :key="'group2-'+n" class="marquee-content">
                    <q-card v-for="(testi, i) in testimonials.slice(3, 6)" :key="i" class="q-mb-lg testimonial-card">
                      <q-card-section class="q-pa-lg">
                        <div class="row items-center no-wrap q-mb-md">
                          <q-avatar size="45px" class="q-mr-md">
                            <img :src="testi.avatar">
                          </q-avatar>
                          <div class="column">
                            <span class="text-weight-bold text-dark text-subtitle1">{{ testi.name }}</span>
                            <q-badge color="blue-1" text-color="primary" class="q-py-xs q-px-sm text-weight-bold">
                              {{ testi.course }}
                            </q-badge>
                          </div>
                        </div>
                        <div class="text-weight-bold text-dark q-mb-xs">{{ testi.title }}</div>
                        <div class="text-body2 text-grey-8 line-height-1-5">{{ testi.comment }}</div>
                        <q-rating :model-value="5" readonly size="16px" color="orange" class="q-mt-md" />
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>


<section class="bg-light-blue-1 q-py-xl overflow-hidden">
  <div class="container q-py-lg">
    <div class="row items-center q-col-gutter-xl">
      
      <div class="col-12 col-md-6">
        <div class="text-warning text-weight-bold q-mb-sm">Berbagi Skill, Bangun Dampak Untukmu</div>
        <h2 class="text-h4 text-weight-bold text-dark q-mb-md">
          Jadilah Mentor di Edulang <br>
          Bantu Peserta Melangkah ke <br>
          Masa Depan Nyata
        </h2>
        <p class="text-grey-8 q-mb-lg">
          Berkontribusi dalam sistem pembelajaran bahasa berbasis tujuan, sambil membangun peran profesional yang berkelanjutan.
        </p>

        <q-list class="q-mb-xl">
          <q-item v-for="(item, index) in mentorBenefits" :key="index" dense class="q-px-none q-mb-sm">
            <q-item-section avatar size="24px">
              <q-icon name="check_circle" color="primary" />
            </q-item-section>
            <q-item-section class="text-dark text-weight-medium">
              {{ item }}
            </q-item-section>
          </q-item>
        </q-list>

        <div class="q-gutter-md">
          <q-btn unelevated rounded color="primary" label="Daftar sebagai mentor" class="q-px-xl" />
          <q-btn outline rounded color="primary" label="Pelajari peran mentor" class="q-px-xl" />
        </div>
      </div>

      <div class="col-12 col-md-6 flex flex-center relative-position">
        <q-img 
          src="~assets/MENTOR.png" 
          style="max-width: 550px; width: 100%"
          class="drop-shadow"
        />
      </div>

    </div>
  </div>
</section>

  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

onMounted(() => {
  fetchPackages()

  // 1. Matikan Klik Kanan
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 2. Matikan Shortcut Keyboard (Ctrl+C, Ctrl+U, Ctrl+S, F12)
  document.addEventListener('keydown', (e) => {
    if (
      e.ctrlKey && 
      (e.keyCode === 67 || // C
       e.keyCode === 85 || // U
       e.keyCode === 83 || // S
       e.keyCode === 123)  // F12
    ) {
      e.preventDefault();
      return false;
    }
    
    // Matikan F12 secara langsung
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
  });
})

// Bersihkan listener saat user pindah halaman agar tidak mempengaruhi page lain
onUnmounted(() => {
  document.removeEventListener('contextmenu', (e) => e.preventDefault());
  document.removeEventListener('keydown', (e) => e.preventDefault());
})

const $q = useQuasar()
const packages = ref([])
const loading = ref(true)

const learningSteps = [
  { title: 'Learn Basics', desc: 'fondasi, awal belajar' },
  { title: 'Learn Basics', desc: 'fondasi, awal belajar' },
  { title: 'Learn Basics', desc: 'fondasi, awal belajar' },
  { title: 'Learn Basics', desc: 'fondasi, awal belajar' },
]

const certifications = [
  {
    name: 'IELTS',
    desc: 'International Certification',
    logo: 'https://www.liblogo.com/img-logo/ie4461j5da-ielts-logo-jpbt-tech.png',
  },
  {
    name: 'TOEFL',
    desc: 'International Certification',
    logo: 'https://live.staticflickr.com/4642/24612532147_c3b8d93bd2_z.jpg',
  },
  {
    name: 'JLPT',
    desc: 'Language Proficiency Exam',
    logo: 'https://picx.zhimg.com/v2-cc64f379c6cacb6fc5439c18ac3137d6_720w.jpg?source=172ae18b',
  },
  {
    name: 'HSK',
    desc: 'Official Language Test',
    logo: 'https://testingcenter.spbu.ru/images/HSK-logo-centered.png',
  },
  {
    name: 'ALPT',
    desc: 'Arabic Proficiency Test',
    logo: 'https://www.arabacademy.com/wp-content/uploads/2020/10/logo_primary.png',
  },
  {
    name: 'TestDaF',
    desc: 'European Certification',
    logo: 'https://seeklogo.com/images/T/testdaf-logo-7837511494-seeklogo.com.png',
  },
]

const solutions = [
  'Bimbingan Langsung dari Ahlinya',
  'Akses Materi Terupdate Selamanya',
  'Kurikulum dinamis yang terus berkembang',
]

const testimonials = [
  { name: 'Satrial lip', course: 'Japan Course', title: 'Comprehensive Materials', comment: 'Active Mandarin Indonesia provides a premium learning experience with advanced audio-visual support.', avatar: 'https://cdn.quasar.dev/img/avatar1.jpg' },
  { name: 'Susanty', course: 'Chinese Course', title: 'Easy to understand', comment: 'Great learning experience with patient teachers, starting from the basics!', avatar: 'https://cdn.quasar.dev/img/avatar2.jpg' },
  { name: 'Asyrofuddin', course: 'English Course', title: 'High Quality Tutors', comment: 'I am very satisfied learning here because the tutors are friendly and communicative.', avatar: 'https://cdn.quasar.dev/img/avatar3.jpg' },
  { name: 'Rina Wijaya', course: 'Germany Course', title: 'Best Experience', comment: 'Kurikulumnya sangat dinamis dan selalu update dengan kebutuhan industri.', avatar: 'https://cdn.quasar.dev/img/avatar4.jpg' },
  { name: 'Budi Santoso', course: 'TOEFL Prep', title: 'Highly Recommended', comment: 'Materi pembelajarannya terstruktur dan sangat membantu persiapan tes saya.', avatar: 'https://cdn.quasar.dev/img/avatar5.jpg' },
  { name: 'Lia Amina', course: 'IELTS Prep', title: 'Excellent Support', comment: 'Dukungan mentor sangat luar biasa dalam membimbing setiap progres saya.', avatar: 'https://cdn.quasar.dev/img/avatar6.jpg' }
]

const mentorBenefits = [
  'Membangun kredibilitas sebagai mentor profesional',
  'Mendapatkan penghasilan dari sistem pembelajaran terstruktur',
  'Terhubung dengan ekosistem edukasi dan jalur global',
  'Berpeluang terlibat dalam kolaborasi edukasi jangka panjang',
  'Akses ke sistem, data progres peserta, dan peluang lanjutan'
]

// Format Mata Uang Rupiah (Tanpa Desimal)
const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('id-ID').format(value)
}

const fetchPackages = async () => {
  loading.value = true
  try {
    const response = await api.get('/packages')

    console.log('API RESPONSE:', response.data)

    // 🔥 FIX UTAMA DI SINI
    if (response.data && Array.isArray(response.data.packages)) {
      packages.value = response.data.packages
    } else {
      packages.value = []
    }
  } catch (error) {
    console.error('API Error:', error)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat daftar kursus unggulan.',
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPackages()
})
</script>

<style scoped>

/* Mencegah seleksi teks di seluruh halaman */
.q-page {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none;    /* Firefox */
  -ms-user-select: none;     /* IE10+/Edge */
  user-select: none;         /* Standard */
}

/* Jika ada bagian tertentu yang BOLEH di-copy (misal: kode promo atau alamat) */
/* Tambahkan class .allow-copy pada elemen tersebut */
.allow-copy {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

/* Responsiveness helper */
@media (max-width: 1023px) {
  .reverse-wrap-mobile {
    flex-direction: column-reverse;
  }
}

.rounded-borders {
  border-radius: 12px;
}

.method-card {
  transition: transform 0.3s ease;
  border: 1px solid #edf2f7;
}

.method-card:hover {
  transform: translateY(-10px);
}

.white-transparent {
  background-color: rgba(255, 255, 255, 0.15);
}

.bg-primary {
  background-color: #003366 !important; /* Biru tua sesuai gambar */
}

/* Mengatur baris teks agar rapi */
.text-body2 {
  font-size: 0.95rem;
}

/* Sertifikasi Animasi Scroll */
.scroll-container {
  width: 100%;
  overflow: hidden;
  display: flex;
}

.cert-card-wrapper {
  padding: 0 10px;
  flex: 0 0 auto;
}

.cert-card {
  width: 350px; /* Lebar card disesuaikan */
  border-radius: 16px;
  color: #333;
}

.cert-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

/* Animasi Ke Kiri */
.scroll-content-left {
  display: flex;
  animation: scrollLeft 30s linear infinite;
}

@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Animasi Ke Kanan */
.scroll-content-right {
  display: flex;
  animation: scrollRight 30s linear infinite;
}

@keyframes scrollRight {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

/* Pause animasi saat hover agar user bisa baca */
.scroll-container:hover .scroll-content-left,
.scroll-container:hover .scroll-content-right {
  animation-play-state: paused;
}

.rounded-borders-32 {
  border-radius: 32px;
}

.mentor-banner {
  /* Warna biru muda transparan sesuai image_5e841e */
  background-color: #eef5ff !important;
}

.z-top {
  z-index: 10;
}

/* Penyesuaian responsif untuk mobile */
@media (max-width: 1023px) {
  .mentor-banner {
    padding: 32px 16px;
    text-align: center;
  }
  .mentor-banner .q-list {
    display: inline-block;
    text-align: left;
  }
}

/* Container Utama untuk Grid Marquee */
.testimonial-grid-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Membagi 2 kolom sama rata */
  gap: 24px; /* Jarak antar kolom */
  height: 600px;
  overflow: hidden;
  /* Efek Fade di atas dan bawah */
  mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
}

.marquee-column {
  position: relative;
  height: 100%;
}

.marquee-vertical {
  display: flex;
  flex-direction: column;
}

.marquee-content {
  flex-shrink: 0;
}

/* Animasi Turun (Kolom Kiri) */
.down {
  animation: scrollDown 30s linear infinite;
}

/* Animasi Naik (Kolom Kanan) */
.up {
  animation: scrollUp 30s linear infinite;
}

@keyframes scrollDown {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}

@keyframes scrollUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}

/* Memastikan Card rapi */
.testimonial-card {
  border-radius: 16px;
  background: white;
  border: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}

.line-height-1-5 {
  line-height: 1.5;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .testimonial-grid-wrapper {
    grid-template-columns: 1fr; /* Jadi 1 kolom di HP agar tidak sempit */
    height: 400px;
  }
}

.opacity-80 {
  opacity: 0.8;
}

.bg-light-blue-1 {
  background-color: #f0f7ff; /* Warna latar biru muda sesuai desain */
}

.drop-shadow {
  filter: drop-shadow(0px 10px 30px rgba(0,0,0,0.1));
}

/* Penyesuaian teks untuk heading agar tidak terlalu rapat */
h2 {
  line-height: 1.2;
}
</style>
