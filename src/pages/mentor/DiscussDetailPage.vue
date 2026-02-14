<template>
  <q-page class="q-pa-lg bg-edulang-white">
    <div class="row items-center q-mb-lg">
      <q-btn
        icon="arrow_back"
        flat
        round
        color="edulang-navy"
        @click="$router.back()"
        class="q-mr-md"
      />
      <h1 class="text-h5 text-weight-bolder text-edulang-navy q-my-none">Forum Diskusi</h1>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else class="max-width-800 mx-auto">
      <q-card
        v-for="(post, index) in discussionPosts"
        :key="index"
        flat
        class="q-mb-md rounded-20 border-light shadow-sm"
      >
        <q-card-section class="q-pa-lg">
          <div class="row items-center justify-between q-mb-md">
            <div class="row items-center">
              <q-avatar color="primary" text-color="white" size="40px">
                {{ post.author?.charAt(0) || 'U' }}
              </q-avatar>
              <div class="q-ml-md">
                <div class="text-weight-bold text-edulang-navy">{{ post.author || 'User' }}</div>
                <div class="text-caption text-grey-6">Menanyakan di forum kelas</div>
              </div>
            </div>
            <q-btn icon="more_vert" flat round dense color="grey-6">
              <q-menu auto-close>
                <q-list style="min-width: 100px">
                  <q-item clickable class="text-negative" @click="confirmDelete(index)">
                    <q-item-section avatar><q-icon name="delete" /></q-item-section>
                    <q-item-section>Hapus</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <div class="text-body1 q-mb-lg text-grey-9 lh-relaxed">{{ post.content }}</div>

          <div v-if="post.replies?.length" class="q-pl-lg q-mt-md border-left-blue">
            <div
              v-for="(reply, rIdx) in post.replies"
              :key="rIdx"
              :class="[
                'q-pa-md q-mb-sm rounded-12',
                reply.role === 'mentor' ? 'bg-blue-50' : 'bg-grey-1',
              ]"
            >
              <div class="row items-center q-mb-xs">
                <q-icon
                  :name="reply.role === 'mentor' ? 'verified' : 'person'"
                  :color="reply.role === 'mentor' ? 'primary' : 'grey-7'"
                  size="16px"
                  class="q-mr-xs"
                />
                <span class="text-caption text-weight-bold uppercase">
                  {{ reply.role === 'mentor' ? 'Anda (Mentor)' : 'User' }}
                </span>
              </div>
              <div class="text-body2">{{ reply.content }}</div>
            </div>
          </div>

          <div class="q-mt-xl row q-gutter-x-sm items-end">
            <q-input
              v-model="replyTexts[index]"
              placeholder="Tulis balasan edukatif Anda..."
              outlined
              dense
              autogrow
              class="col rounded-12"
              bg-color="white"
            />
            <q-btn
              unelevated
              color="primary"
              icon="send"
              class="rounded-12 q-pa-sm"
              :loading="submitting === index"
              @click="submitReply(index)"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const discussionPosts = ref([])
const loading = ref(true)
const replyTexts = ref({})
const submitting = ref(null)

const fetchDiscussions = async () => {
  try {
    const res = await api.get(`/discuss/${route.params.packageId}`) //
    discussionPosts.value = res.data.discussion?.posts || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const submitReply = async (postIndex) => {
  const content = replyTexts.value[postIndex]
  if (!content) return

  submitting.value = postIndex
  try {
    // Endpoint: POST /api/discuss/:packageId/:postIndex/reply
    await api.post(`/discuss/${route.params.packageId}/${postIndex}/reply`, {
      content: content,
    })
    $q.notify({ type: 'positive', message: 'Balasan terkirim' })
    replyTexts.value[postIndex] = ''
    fetchDiscussions()
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal mengirim balasan' })
  } finally {
    submitting.value = null
  }
}

const confirmDelete = (postIndex) => {
  $q.dialog({
    title: 'Hapus Postingan',
    message: 'Apakah Anda yakin ingin menghapus diskusi ini?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      // Endpoint: DELETE /api/discuss/:packageId/:postIndex
      await api.delete(`/discuss/${route.params.packageId}/${postIndex}`)
      $q.notify({ type: 'info', message: 'Postingan dihapus' })
      fetchDiscussions()
    } catch {
      $q.notify({ type: 'negative', message: 'Gagal menghapus' })
    }
  })
}

onMounted(fetchDiscussions)
</script>

<style scoped>
.max-width-800 {
  max-width: 800px;
  margin: 0 auto;
}
.border-light {
  border: 1px solid #edf2f7;
}
.border-left-blue {
  border-left: 3px solid #0089ff;
}
.bg-blue-50 {
  background-color: #f0f7ff;
}
.lh-relaxed {
  line-height: 1.6;
}
.rounded-20 {
  border-radius: 20px;
}
.rounded-12 {
  border-radius: 12px;
}
</style>
