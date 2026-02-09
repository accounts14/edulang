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
          <div class="row q-gutter-xs">
            <q-btn
              v-for="n in totalSoal"
              :key="n"
              round
              dense
              :color="currentIndex === n - 1 ? 'primary' : 'grey-5'"
              :text-color="currentIndex === n - 1 ? 'white' : 'grey-9'"
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
          <template v-else-if="showPenjelasan && penjelasan">
            <div class="text-h6 text-weight-bold q-mb-md">Penjelasan</div>
            <div class="text-body1 text-grey-8" style="white-space: pre-line">
              {{ penjelasan }}
            </div>
            <q-btn
              unelevated
              no-caps
              color="primary"
              label="Selanjutnya"
              class="q-mt-md"
              @click="nextAfterPenjelasan"
            />
          </template>
          <template v-else>
            <div class="text-body1 text-grey-9 q-mb-lg">
              {{ currentSoal?.question || currentSoal?.pertanyaan || 'Lorem ipsum question...' }}
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
                :label="isLastSoal ? 'Selesai & Lihat Penjelasan' : 'Selanjutnya'"
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
import { assignmentEndpoints } from 'src/api/endpoints'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const packageId = computed(() => route.params.packageId)
const lessonOrder = computed(() => route.params.order)

const loadingSoal = ref(true)
const submitting = ref(false)
const soalList = ref([])
const currentIndex = ref(0)
const selectedOption = ref(null)
const jawabanEsai = ref('')
const showPenjelasan = ref(false)
const penjelasan = ref('')

const totalSoal = computed(() => soalList.value.length || 5)
const currentSoal = computed(() => soalList.value[currentIndex.value])
const isPilihanGanda = computed(() => {
  const t = currentSoal.value?.type ?? currentSoal.value?.tipe ?? 'pilihan_ganda'
  return String(t).toLowerCase().includes('pilihan') || String(t).toLowerCase().includes('ganda')
})
const tipeSoalLabel = computed(() => (isPilihanGanda.value ? 'Pilihan Ganda' : 'Pilihan Essai'))
const options = computed(() => {
  const s = currentSoal.value
  const opts = s?.options ?? s?.choices ?? []
  return Array.isArray(opts) ? opts : []
})
const isLastSoal = computed(() => currentIndex.value >= totalSoal.value - 1 && totalSoal.value > 0)

const backToLearnRoute = computed(() => ({
  name: 'UserLearnLesson',
  params: { packageId: packageId.value, order: lessonOrder.value },
}))

function optionClass(i) {
  if (selectedOption.value !== i) return 'bg-grey-1'
  return 'bg-primary text-white'
}

function selectOption(i) {
  selectedOption.value = i
}

async function fetchSoal() {
  if (!packageId.value || !lessonOrder.value) return
  loadingSoal.value = true
  try {
    const res = await api.get(assignmentEndpoints.get(packageId.value, lessonOrder.value))
    const data = res.data?.data ?? res.data
    soalList.value = Array.isArray(data?.questions)
      ? data.questions
      : Array.isArray(data)
        ? data
        : []
    if (soalList.value.length === 0) {
      soalList.value = [
        {
          question: 'Contoh soal (data dari API belum tersedia)',
          type: 'pilihan_ganda',
          options: ['A', 'B', 'C', 'D'],
        },
      ]
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: e.response?.data?.message || 'Gagal memuat soal.' })
    soalList.value = []
  } finally {
    loadingSoal.value = false
  }
}

async function onNext() {
  if (isLastSoal.value) {
    await submitDanLihatPenjelasan()
    return
  }
  currentIndex.value = Math.min(currentIndex.value + 1, totalSoal.value - 1)
  selectedOption.value = null
  jawabanEsai.value = ''
  showPenjelasan.value = false
  penjelasan.value = ''
}

async function submitDanLihatPenjelasan() {
  submitting.value = true
  try {
    const payload = {
      questionIndex: currentIndex.value,
      answer: isPilihanGanda.value
        ? (options.value[selectedOption.value]?.value ?? selectedOption.value)
        : jawabanEsai.value,
    }
    const res = await api.post(
      assignmentEndpoints.submit(packageId.value, lessonOrder.value),
      payload,
    )
    const data = res.data?.data ?? res.data
    penjelasan.value =
      data?.explanation ?? data?.penjelasan ?? 'Penjelasan dari AI akan muncul di sini.'
    showPenjelasan.value = true
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: e.response?.data?.message || 'Gagal mengirim jawaban.',
    })
    penjelasan.value = 'Terjadi kesalahan saat memuat penjelasan AI.'
    showPenjelasan.value = true
  } finally {
    submitting.value = false
  }
}

function nextAfterPenjelasan() {
  showPenjelasan.value = false
  penjelasan.value = ''
  if (currentIndex.value < totalSoal.value - 1) {
    currentIndex.value++
  } else {
    router.push(backToLearnRoute.value)
  }
}

watch(
  () => [packageId.value, lessonOrder.value],
  () => fetchSoal(),
  { immediate: true },
)
</script>

<style scoped>
.option-box {
  border: 2px solid rgba(0, 0, 0, 0.08);
}
.option-box.bg-primary {
  border-color: var(--q-primary);
}
</style>
