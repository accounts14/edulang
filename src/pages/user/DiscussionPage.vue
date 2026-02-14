<template>
  <q-page class="q-pa-lg bg-f5f7fa">
    <div class="max-width-container">
      <div class="row items-center q-mb-lg">
        <q-btn
          flat
          round
          icon="arrow_back"
          color="edulang-navy"
          @click="$router.back()"
          class="bg-white shadow-1 q-mr-md"
        />
        <div>
          <div class="text-h5 text-weight-bolder text-edulang-navy">Forum Diskusi</div>
          <div class="text-caption text-grey-7">
            Berinteraksi langsung dengan peserta program Anda
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <q-card flat class="rounded-borders-20 border-light sticky-card">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold text-edulang-navy q-mb-md">
                Kirim Pesan Baru
              </div>
              <q-input
                v-model="newPost"
                type="textarea"
                outlined
                placeholder="Tulis instruksi atau sapaan baru..."
                class="bg-white"
                :loading="sending"
                rows="4"
              />
              <q-btn
                unelevated
                color="primary"
                label="Kirim Diskusi"
                icon="send"
                class="full-width q-mt-md rounded-btn q-py-sm"
                @click="postDiscussion"
                :disable="!newPost.trim() || sending"
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-8">
          <div
            v-if="discussions.length === 0"
            class="flex flex-center q-pa-xl bg-white rounded-borders-20 border-dashed"
          >
            <div class="text-center">
              <q-icon name="chat_bubble_outline" size="64px" color="grey-3" />
              <div class="text-grey-6 q-mt-sm">Belum ada percakapan dalam paket ini.</div>
            </div>
          </div>

          <div v-else v-for="(post, index) in discussions" :key="index" class="q-mb-xl">
            <q-chat-message
              :name="post.userName || 'Siswa'"
              avatar="https://cdn.quasar.dev/img/avatar.png"
              :text="[post.content]"
              bg-color="white"
              class="text-weight-medium custom-chat"
            />

            <div v-if="post.replies && post.replies.length > 0" class="q-ml-xl q-mt-sm">
              <q-chat-message
                v-for="(reply, rIndex) in post.replies"
                :key="rIndex"
                :name="reply.userName"
                :avatar="
                  reply.role === 'mentor'
                    ? 'https://cdn.quasar.dev/img/avatar2.jpg'
                    : 'https://cdn.quasar.dev/img/avatar1.jpg'
                "
                :text="[reply.content]"
                :sent="reply.userName === mentorName"
                :bg-color="reply.userName === mentorName ? 'edulang-blue-light' : 'grey-2'"
                :color="reply.userName === mentorName ? 'white' : 'black'"
              />
            </div>

            <div class="row justify-end q-mt-xs q-pr-sm">
              <q-btn
                flat
                dense
                no-caps
                label="Balas Pesan"
                color="primary"
                icon="reply"
                size="sm"
                class="rounded-btn"
                @click="openReplyDialog(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="replyDialog.show" position="bottom">
      <q-card style="width: 500px; max-width: 95vw" class="rounded-borders-20">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-weight-bold">Balas Diskusi</div>
          <q-spacer />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="replyDialog.content"
            type="textarea"
            filled
            autofocus
            placeholder="Tulis balasan Anda..."
          />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Batal" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            label="Kirim Balasan"
            color="primary"
            @click="submitReply"
            :loading="sending"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const packageId = route.params.packageId
const discussions = ref([])
const newPost = ref('')
const sending = ref(false)
const mentorName = ref(localStorage.getItem('userName') || 'Mentor')

// State untuk Dialog Balasan
const replyDialog = ref({
  show: false,
  postIndex: null,
  content: '',
})

const fetchDiscussions = async () => {
  try {
    const res = await api.get(`/discuss/${packageId}`) // Endpoint sesuai dokumentasi
    discussions.value = res.data.discussion.posts || []
  } catch (error) {
    console.error('Gagal memuat diskusi', error)
  }
}

const postDiscussion = async () => {
  if (!newPost.value.trim()) return
  sending.value = true
  try {
    await api.post(`/discuss/${packageId}/post`, { content: newPost.value }) // Endpoint
    newPost.value = ''
    $q.notify({ type: 'positive', message: 'Diskusi berhasil diposting' })
    await fetchDiscussions()
  } finally {
    sending.value = false
  }
}

const openReplyDialog = (index) => {
  replyDialog.value.postIndex = index
  replyDialog.value.content = ''
  replyDialog.value.show = true
}

const submitReply = async () => {
  if (!replyDialog.value.content.trim()) return
  sending.value = true
  try {
    // Endpoint reply sesuai dokumentasi
    await api.post(`/discuss/${packageId}/${replyDialog.value.postIndex}/reply`, {
      content: replyDialog.value.content,
    })
    replyDialog.value.show = false
    $q.notify({ type: 'positive', message: 'Balasan terkirim' })
    await fetchDiscussions()
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal membalas' })
  } finally {
    sending.value = false
  }
}

onMounted(fetchDiscussions)
</script>

<style scoped>
.bg-f5f7fa {
  background-color: #f5f7fa;
}
.text-edulang-navy {
  color: #003387;
}
.max-width-container {
  max-width: 1000px;
  margin: 0 auto;
}
.rounded-borders-20 {
  border-radius: 20px;
}
.rounded-btn {
  border-radius: 10px;
}
.border-light {
  border: 1px solid #eef1f6;
}
.border-dashed {
  border: 2px dashed #d1d9e2;
}

.sticky-card {
  position: sticky;
  top: 20px;
}

/* Custom Chat Style */
.custom-chat :deep(.q-message-text) {
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.edulang-blue-light {
  background-color: #003387 !important;
}
</style>
