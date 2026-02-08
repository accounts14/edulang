<template>
  <q-page class="q-pa-lg bg-blue-1">
    <div class="text-h5 text-weight-bolder text-indigo-10">Tambah Lesson</div>
    <div class="text-grey-7 q-mt-xs">Sesuai endpoint: order, videoUrl.</div>

    <q-form class="q-mt-lg" @submit.prevent="handleSubmit">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <div class="text-grey-8 text-caption q-mb-xs">Order (1-16)</div>
          <q-input
            v-model.number="form.order"
            dense
            outlined
            type="number"
            bg-color="white"
            placeholder="Urutan lesson (1-16)"
            :rules="[
              (v) => (v !== null && v !== '') || 'Order wajib diisi',
              (v) => Number(v) >= 1 || 'Minimal 1',
              (v) => Number(v) <= 16 || 'Maksimal 16',
            ]"
          />
        </div>

        <div class="col-12 col-md-6">
          <div class="text-grey-8 text-caption q-mb-xs">Video URL</div>
          <q-input
            v-model="form.videoUrl"
            dense
            outlined
            bg-color="white"
            placeholder="https://youtube.com/..."
            :rules="[(v) => !!v || 'Video URL wajib diisi']"
          />
        </div>
      </div>

      <div class="q-mt-xl">
        <q-btn
          unelevated
          color="primary"
          label="Tambah"
          no-caps
          class="q-px-lg q-mr-sm rounded-borders"
          type="submit"
          :loading="submitting"
          :disable="submitting"
        />
        <q-btn
          unelevated
          color="negative"
          label="Cancel"
          no-caps
          class="q-px-lg rounded-borders"
          :disable="submitting"
          @click="handleCancel"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const submitting = ref(false)

const form = reactive({
  order: null,
  videoUrl: '',
})

function handleCancel() {
  router.push(`/mentor/packages/${route.params.id}`)
}

async function handleSubmit() {
  try {
    submitting.value = true

    const payload = {
      order: Number(form.order),
      videoUrl: form.videoUrl,
    }

    await api.post(`/packages/${route.params.id}/lessons`, payload)
    $q.notify({ type: 'positive', message: 'Materi berhasil ditambahkan.', timeout: 1600 })
    router.push(`/mentor/packages/${route.params.id}`)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal menambahkan materi.',
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
