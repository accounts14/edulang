<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div class="text-h5 text-weight-bolder text-indigo-10">Generate Soal</div>
    <div class="text-grey-7 q-mt-xs">
      Masukkan prompt untuk generate soal secara otomatis dengan AI (Pertemuan {{ lessonOrder }})
    </div>

    <q-form class="q-mt-lg" @submit.prevent="handleSubmit">
      <div class="row q-col-gutter-lg">
        <div class="col-12">
          <div class="text-grey-8 text-caption q-mb-xs">Prompt untuk Generate Soal</div>
          <q-input
            v-model="form.prompt"
            dense
            outlined
            type="textarea"
            autogrow
            bg-color="white"
            placeholder="Contoh: Buat soal tentang pengenalan bahasa Mandarin untuk pemula..."
            :rules="[(v) => !!v?.trim() || 'Prompt wajib diisi']"
          />
        </div>
      </div>

      <div class="q-mt-xl">
        <q-btn
          unelevated
          color="primary"
          label="Generate Soal"
          no-caps
          class="q-px-lg q-mr-sm rounded-borders"
          type="submit"
          :loading="submitting"
          :disable="submitting"
        />
        <q-btn
          unelevated
          color="grey-7"
          outline
          label="Batal"
          no-caps
          type="button"
          class="q-px-lg rounded-borders"
          :disable="submitting"
          @click="handleCancel"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { lessonEndpoints } from 'src/api/endpoints'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const submitting = ref(false)

const packageId = computed(() => route.params.id)
const lessonOrder = computed(() => route.params.order)

const form = reactive({
  prompt: '',
})

// Validasi parameter saat component mounted
onMounted(() => {
  if (!packageId.value || !lessonOrder.value) {
    $q.notify({
      type: 'negative',
      message: 'Parameter tidak valid. Package ID atau Lesson Order tidak ditemukan.',
    })
    router.push({ name: 'MentorKelasku' })
  }
})

function handleCancel() {
  router.push({ name: 'MentorPackageDetail', params: { id: packageId.value } })
}

async function handleSubmit() {
  // Validasi ulang sebelum submit
  if (!packageId.value || !lessonOrder.value) {
    $q.notify({
      type: 'negative',
      message: 'Parameter tidak lengkap.',
    })
    return
  }

  if (!form.prompt.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Prompt tidak boleh kosong.',
    })
    return
  }

  try {
    submitting.value = true

    const url = lessonEndpoints.generateAi(packageId.value, lessonOrder.value)
    await api.post(url, {
      prompt: form.prompt.trim(),
    })

    $q.notify({
      type: 'positive',
      message: 'Soal berhasil digenerate dengan AI.',
      timeout: 2000,
    })

    router.push({ name: 'MentorPackageDetail', params: { id: packageId.value } })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal generate soal.',
      caption: error.response?.status === 404 ? 'Endpoint tidak ditemukan' : undefined,
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.text-indigo-10 {
  color: #0d2a5c;
}
</style>
