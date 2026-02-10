<template>
  <q-page class="user-soal-page q-pa-lg bg-grey-2">
    <div class="row">
      <!-- Sidebar: tipe soal + navigasi -->
      <div class="col-12 col-md-3 q-pr-md">
        <q-card flat bordered class="rounded-borders q-pa-md">
          <div class="text-caption text-grey-7 q-mb-sm">Tipe Soal</div>
          <div class="text-subtitle2 text-weight-bold">{{ tipeSoalLabel }}</div>
          <q-separator class="q-my-md" />
          <div class="text-caption text-grey-7 q-mb-sm">Navigasi Soal</div>
          <div class="row">
            <q-btn
              v-for="n in totalSoal"
              :key="n"
              round
              dense
              class="nav-number"
              :class="{ 'nav-number--active': currentIndex === n - 1 }"
              :label="String(n)"
              @click="currentIndex = n - 1"
            />
          </div>
          <q-btn flat no-caps label="&larr; Home" class="q-mt-md" :to="backToLearnRoute" />
        </q-card>
      </div>

      <!-- Konten: soal + opsi / esai / penjelasan AI -->
      <div class="col-12 col-md-9 q-pt-md q-pt-none">
        <q-card flat bordered class="rounded-borders q-pa-lg">
          <template v-if="loadingSoal">
            <q-spinner-dots color="primary" size="32px" class="flex flex-center q-pa-xl" />
          </template>
          <template v-else>
            <div class="text-body1 text-grey-9 q-mb-lg">
              {{ questionText }}
            </div>
            <!-- Pilihan Ganda -->
            <template v-if="isPilihanGanda">
              <div
                v-for="(opt, i) in options"
                :key="i"
                class="option-box q-pa-md q-mb-sm rounded-borders cursor-pointer"
                :class="optionClass(i)"
                @click="selectOption(i)"
              >
                <span class="text-weight-medium">{{ ['A', 'B', 'C', 'D'][i] }}.</span>
                {{ opt.text || opt }}
              </div>
            </template>
            <!-- Esai -->
            <template v-else>
              <q-input
                v-model="jawabanEsai"
                type="textarea"
                outlined
                autogrow
                placeholder="Masukkan jawaban Anda..."
                class="q-mt-sm"
              />
            </template>

            <!-- Penjelasan AI (selalu muncul di bawah soal setelah submit) -->
            <div v-if="penjelasan" class="penjelasan-box q-pa-md q-mt-xl rounded-borders">
              <div class="text-subtitle2 text-weight-bold q-mb-xs">Penjelasan</div>
              <div class="text-body2 text-grey-8" style="white-space: pre-line">
                {{ penjelasan }}
              </div>
            </div>

            <div class="row q-gutter-sm q-mt-xl">
              <q-btn
                flat
                no-caps
                label="Kembali"
                icon="arrow_back"
                :disable="currentIndex === 0"
                @click="currentIndex = Math.max(0, currentIndex - 1)"
              />
              <q-btn
                unelevated
                no-caps
                color="primary"
                :label="
                  penjelasan
                    ? isLastSoal
                      ? 'Selesai'
                      : 'Selanjutnya'
                    : 'Kirim Jawaban & Lihat Penjelasan'
                "
                icon-right="arrow_forward"
                :loading="submitting"
                @click="onNext"
              />
            </div>
          </template>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { submissionEndpoints } from 'src/api/endpoints'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const packageId = computed(() => route.params.packageId)
const lessonOrder = computed(() => route.params.order)

const loadingSoal = ref(true)
const submitting = ref(false)
const soalList = ref([])
const multipleChoiceCount = ref(0)
const currentIndex = ref(0)
const selectedOption = ref(null)
const jawabanEsai = ref('')
const penjelasan = ref('')
const isJawabanBenar = ref(null) // true / false / null
const correctOptionIndex = ref(null)

const totalSoal = computed(() => (soalList.value.length ? soalList.value.length : 1))
const currentSoal = computed(() => soalList.value[currentIndex.value])

const questionText = computed(() => {
  const q = currentSoal.value || {}
  return (
    q.question ||
    q.pertanyaan ||
    q.text ||
    q.title ||
    q.questionText ||
    q.soal ||
    'Lorem ipsum question...'
  )
})

const isPilihanGanda = computed(() => {
  const t = currentSoal.value?.type ?? currentSoal.value?.tipe ?? currentSoal.value?.questionType
  const lower = String(t || '').toLowerCase()
  if (!lower) return true // default ke pilihan ganda
  return (
    lower.includes('pilihan') ||
    lower.includes('ganda') ||
    lower.includes('mcq') ||
    lower.includes('multiple') ||
    lower === 'pg'
  )
})

const tipeSoalLabel = computed(() => (isPilihanGanda.value ? 'Pilihan Ganda' : 'Pilihan Essai'))

const options = computed(() => {
  const s = currentSoal.value || {}
  const opts =
    s.options ?? s.choices ?? s.opsi ?? s.answers ?? s.jawaban ?? s.pilihan ?? s.answerOptions
  return Array.isArray(opts) ? opts : []
})
const isLastSoal = computed(() => currentIndex.value >= totalSoal.value - 1 && totalSoal.value > 0)

const backToLearnRoute = computed(() => ({
  name: 'UserLearnLesson',
  params: { packageId: packageId.value, order: lessonOrder.value },
}))

function optionClass(i) {
  // Sebelum submit: hanya highlight pilihan user
  if (!penjelasan.value) {
    if (selectedOption.value === i) return 'option-selected'
    return 'option-default'
  }

  // Setelah ada penjelasan AI: mirip desain mockup (hijau untuk benar, merah untuk salah)
  if (isJawabanBenar.value === false && selectedOption.value === i) {
    return 'option-wrong'
  }

  if (
    (correctOptionIndex.value !== null && correctOptionIndex.value === i) ||
    (isJawabanBenar.value === true && selectedOption.value === i)
  ) {
    return 'option-correct'
  }

  return 'option-default'
}

function selectOption(i) {
  selectedOption.value = i
}

async function fetchSoal() {
  if (!packageId.value || !lessonOrder.value) return
  loadingSoal.value = true
  try {
    // Ambil dari endpoint User Progress: /userprogress/my-progress/:packageId
    const res = await api.get(`/userprogress/my-progress/${packageId.value}`)
    const body = res.data ?? {}
    const data = body.data ?? body

    let questions = []

    // 1. Coba ambil dari daftar lesson yang dikembalikan oleh my-progress
    const lessons =
      data.lessons ??
      data.package?.lessons ??
      data.packageDetail?.lessons ??
      data.course?.lessons ??
      []

    if (Array.isArray(lessons) && lessons.length) {
      const targetLesson =
        lessons.find(
          (l) =>
            String(l.order ?? l.lessonOrder ?? l.pertemuan ?? l.sequence) ===
            String(lessonOrder.value),
        ) ?? lessons[0]

      if (targetLesson) {
        const assignment =
          targetLesson.assignment ??
          targetLesson.assignments ??
          targetLesson.questions ??
          targetLesson.soal ??
          targetLesson.questionList

        // Struktur baru dari my-progress:
        // assignment: {
        //   multipleChoice: [ { question, options, correctAnswer, ... } ],
        //   essays: [ { question, wordLimit, ... } ],
        //   ...
        // }
        if (assignment && !Array.isArray(assignment) && typeof assignment === 'object') {
          const mc = Array.isArray(assignment.multipleChoice)
            ? assignment.multipleChoice.map((q) => ({
                ...q,
                type: q.type || q.questionType || 'multiple_choice',
              }))
            : []

          const essays = Array.isArray(assignment.essays)
            ? assignment.essays.map((q) => ({
                ...q,
                type: q.type || q.questionType || 'essay',
              }))
            : []

          questions = [...mc, ...essays]
          multipleChoiceCount.value = mc.length
        } else if (Array.isArray(assignment)) {
          questions = assignment
          multipleChoiceCount.value = questions.filter((q) =>
            /pilihan|ganda|mcq|multiple|pg/i.test(String(q?.type ?? q?.questionType ?? '')),
          ).length
        } else if (assignment) {
          questions = [assignment]
          multipleChoiceCount.value = 0
        }
      }
    }

    // 2. Jika belum ketemu, coba dari field tingkat root (mis. currentQuestion)
    if (!questions.length) {
      const q =
        data.currentQuestion ??
        data.current_question ??
        data.question ??
        data.soal ??
        data.assignment

      if (q) {
        questions = Array.isArray(q) ? q : [q]
      }
    }

    soalList.value = questions

    if (!soalList.value.length) {
      multipleChoiceCount.value = 1
      soalList.value = [
        {
          question:
            'Contoh soal (endpoint /userprogress/my-progress/:packageId belum mengembalikan daftar soal).',
          type: 'pilihan_ganda',
          options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
        },
      ]
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Gagal memuat soal.' })
    soalList.value = []
    multipleChoiceCount.value = 0
  } finally {
    loadingSoal.value = false
  }
}

async function onNext() {
  // Pertama kali klik: kirim jawaban & tampilkan penjelasan AI untuk soal saat ini
  if (!penjelasan.value) {
    await submitDanLihatPenjelasan()
    return
  }

  // Kalau penjelasan sudah tampil: pindah ke soal berikutnya / selesai
  if (isLastSoal.value) {
    router.push(backToLearnRoute.value)
    return
  }

  currentIndex.value = Math.min(currentIndex.value + 1, totalSoal.value - 1)
  selectedOption.value = null
  jawabanEsai.value = ''
  penjelasan.value = ''
  isJawabanBenar.value = null
  correctOptionIndex.value = null
}

async function submitDanLihatPenjelasan() {
  submitting.value = true
  try {
    // Validasi jawaban sebelum submit
    if (isPilihanGanda.value && selectedOption.value === null) {
      $q.notify({ type: 'warning', message: 'Silakan pilih salah satu jawaban terlebih dahulu.' })
      submitting.value = false
      return
    }
    if (!isPilihanGanda.value && !jawabanEsai.value.trim()) {
      $q.notify({ type: 'warning', message: 'Silakan isi jawaban esai terlebih dahulu.' })
      submitting.value = false
      return
    }

    const opt = options.value[selectedOption.value]
    const mcqAnswer =
      opt != null
        ? typeof opt === 'object'
          ? (opt.value ?? opt.text ?? selectedOption.value)
          : opt
        : selectedOption.value

    const typeSpecificIndex = isPilihanGanda.value
      ? currentIndex.value
      : currentIndex.value - multipleChoiceCount.value

    const payload = {
      packageId: packageId.value,
      lessonOrder: lessonOrder.value,
      questionIndex: typeSpecificIndex,
      questionType: isPilihanGanda.value ? 'multiple_choice' : 'essay',
      userAnswer: isPilihanGanda.value ? mcqAnswer : jawabanEsai.value,
    }

    const res = await api.post(submissionEndpoints.create, payload)
    const body = res.data ?? {}
    const submission = body.submission ?? body.data?.submission ?? body.data ?? body

    const rawPenjelasan =
      submission?.aiFeedback ??
      submission?.ai_feedback ??
      submission?.explanation ??
      submission?.penjelasan ??
      ''
    const essayGetsMcqFeedback = /jawaban benar[.:]\s*[a-d]/i.test(rawPenjelasan.trim())
    const isInvalid =
      /auto-save success/i.test(rawPenjelasan) ||
      (isPilihanGanda.value === false && essayGetsMcqFeedback) ||
      (isPilihanGanda.value === false &&
        rawPenjelasan.trim().length < 20 &&
        /salah|benar/i.test(rawPenjelasan))
    penjelasan.value =
      rawPenjelasan && !isInvalid ? rawPenjelasan : 'Penjelasan dari AI akan muncul di sini.'

    if (isPilihanGanda.value) {
      const localCorrect =
        currentSoal.value?.correctAnswer ??
        currentSoal.value?.jawabanBenar ??
        currentSoal.value?.correctIndex
      correctOptionIndex.value =
        typeof localCorrect === 'number' && localCorrect >= 0 ? localCorrect : null
      isJawabanBenar.value =
        correctOptionIndex.value !== null && selectedOption.value === correctOptionIndex.value
    } else {
      const explicitCorrect = submission?.isCorrect ?? submission?.benar ?? submission?.correct
      if (typeof explicitCorrect === 'boolean') {
        isJawabanBenar.value = explicitCorrect
      } else if (typeof submission?.aiScore === 'number') {
        const score = submission.aiScore
        isJawabanBenar.value = score >= 60 || score >= 0.6
      } else {
        isJawabanBenar.value = null
      }
      correctOptionIndex.value = null
    }
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e.response?.data?.message || 'Gagal mengirim jawaban.',
    })
    penjelasan.value = 'Terjadi kesalahan saat memuat penjelasan AI.'
  } finally {
    submitting.value = false
  }
}

watch(
  () => [packageId.value, lessonOrder.value],
  () => fetchSoal(),
  { immediate: true },
)

// Reset state ketika pindah nomor soal
watch(currentIndex, () => {
  selectedOption.value = null
  jawabanEsai.value = ''
  penjelasan.value = ''
  isJawabanBenar.value = null
  correctOptionIndex.value = null
})
</script>

<style scoped>
.option-box {
  border-radius: 16px;
  border: 1.5px solid #e2e8f0;
  background: #f9fafb;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.option-default:hover {
  border-color: #cbd5f5;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
}
.option-selected {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4);
}
.option-correct {
  border-color: #16a34a;
  background: #ecfdf3;
  box-shadow: 0 0 0 1px rgba(22, 163, 74, 0.5);
}
.option-wrong {
  border-color: #dc2626;
  background: #fef2f2;
  box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.5);
}

.penjelasan-box {
  border-radius: 16px;
  border: 1.5px solid #16a34a;
  background: #f0fdf4;
}

.nav-number {
  background: #e5e7eb;
  color: #111827;
  margin-right: 4px;
  margin-bottom: 4px;
}
.nav-number--active {
  background: #2563eb;
  color: #ffffff;
}

.user-soal-page {
  min-height: calc(100vh - 50px);
}

:deep(.q-card.rounded-borders) {
  border-radius: 16px;
}

:deep(.q-field--textarea textarea) {
  min-height: 180px;
}
</style>
