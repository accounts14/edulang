<template>
  <q-page class="q-pa-lg bg-edulang-white">
    <div class="max-width-container">
      <div class="row items-center q-mb-xl">
        <q-btn
          flat
          round
          icon="arrow_back"
          color="edulang-navy"
          @click="$router.back()"
          class="bg-white shadow-soft q-mr-md back-btn"
        />
        <div>
          <h1 class="text-h4 text-weight-bold text-edulang-navy header-font q-ma-none">
            Forum Diskusi
          </h1>
          <p class="text-body1 text-edulang-grey body-font q-mt-xs">
            Berinteraksi langsung dengan peserta secara
            <span class="text-edulang-blue text-weight-medium">aktif dan personal.</span>
          </p>
        </div>
      </div>

      <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-4">
          <q-card
            flat
            class="rounded-20 border-light sticky-card bg-white shadow-soft overflow-hidden"
          >
            <div class="bg-edulang-navy q-pa-sm"></div>
            <q-card-section class="q-pa-lg">
              <div
                class="text-subtitle1 text-weight-bold text-edulang-navy q-mb-md header-font flex items-center"
              >
                <q-icon name="edit_note" size="24px" class="q-mr-sm" />
                Kirim Pesan Baru
              </div>
              <q-input
                v-model="newPost"
                type="textarea"
                outlined
                placeholder="Tulis instruksi atau sapaan baru untuk siswa..."
                class="bg-white input-custom body-font"
                :loading="sending"
                rows="5"
                color="edulang-blue"
              />
              <q-btn
                unelevated
                color="edulang-yellow"
                text-color="edulang-navy"
                label="Kirim Diskusi"
                icon="send"
                class="full-width q-mt-md rounded-12 q-py-md text-weight-bold cta-font shadow-yellow"
                @click="postDiscussion"
                :disable="!newPost.trim() || sending"
              />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-8">
          <div
            v-if="discussions.length === 0"
            class="flex flex-center q-pa-xl bg-white rounded-20 border-dashed empty-state"
          >
            <div class="text-center">
              <q-icon name="forum" size="100px" color="grey-3" />
              <div class="text-edulang-navy q-mt-md header-font text-h6">Belum Ada Diskusi</div>
              <p class="text-grey-6 body-font">Mulai percakapan pertama Anda hari ini.</p>
            </div>
          </div>

          <div
            v-else
            v-for="(post, index) in discussions"
            :key="index"
            class="discussion-wrapper q-mb-xl"
          >
            <q-chat-message
              :name="post.userName || 'Siswa'"
              :avatar="post.avatar || 'https://cdn.quasar.dev/img/avatar.png'"
              :text="[post.content]"
              bg-color="white"
              text-color="edulang-black"
              class="body-font custom-chat main-post"
              :sent="false"
            />

            <div
              v-if="post.replies && post.replies.length > 0"
              class="replies-section q-ml-xl q-mt-md q-pl-md"
            >
              <div class="thread-line"></div>
              <q-chat-message
                v-for="(reply, rIndex) in getSortedReplies(post.replies)"
                :key="rIndex"
                :name="reply.userName"
                :avatar="
                  reply.avatar ||
                  (reply.role === 'mentor'
                    ? 'https://cdn.quasar.dev/img/avatar2.jpg'
                    : 'https://cdn.quasar.dev/img/avatar1.jpg')
                "
                :text="[reply.content]"
                :sent="reply.role === 'mentor' || reply.userName === mentorName"
                :bg-color="
                  reply.role === 'mentor' || reply.userName === mentorName
                    ? 'edulang-navy'
                    : 'edulang-blue-light'
                "
                :text-color="
                  reply.role === 'mentor' || reply.userName === mentorName
                    ? 'white'
                    : 'edulang-navy'
                "
                class="reply-chat q-mb-sm body-font"
              />
            </div>

            <div class="row justify-end q-mt-sm q-pr-sm">
              <q-btn
                flat
                no-caps
                label="Balas Pesan"
                color="edulang-blue"
                icon="add_comment"
                class="rounded-8 reply-btn body-font text-weight-bold"
                @click="openReplyDialog(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="replyDialog.show" position="bottom" transition-show="slide-up">
      <q-card style="width: 550px; max-width: 95vw" class="rounded-t-24 shadow-up-20">
        <q-card-section class="row items-center q-pb-none q-pa-lg">
          <div class="text-h6 text-weight-bold text-edulang-navy header-font">
            <q-icon name="reply" class="q-mr-sm" />Balas Diskusi
          </div>
          <q-spacer />
          <q-btn icon="close" flat round dense v-close-popup color="grey-5" />
        </q-card-section>

        <q-card-section class="q-pa-lg q-pt-none">
          <q-input
            v-model="replyDialog.content"
            type="textarea"
            outlined
            autofocus
            placeholder="Berikan arahan atau jawaban terbaik Anda..."
            color="edulang-blue"
            class="body-font bg-edulang-white rounded-12"
            rows="4"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-lg q-pt-none">
          <q-btn flat label="Batal" color="grey-7" v-close-popup class="rounded-8 q-px-md" />
          <q-btn
            unelevated
            label="Kirim Balasan"
            color="edulang-navy"
            @click="submitReply"
            :loading="sending"
            class="rounded-12 q-px-xl text-weight-bold cta-font"
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

// Fungsi untuk mengurutkan replies dari lama ke baru (atas ke bawah)
// API mengembalikan terbaru di index 0, jadi perlu di-reverse
const getSortedReplies = (replies) => {
  if (!replies || replies.length === 0) return []
  return [...replies].reverse()
}

const fetchDiscussions = async () => {
  try {
    const res = await api.get(`/discuss/${packageId}`)
    discussions.value = res.data.discussion.posts || []
  } catch (error) {
    console.error('Gagal memuat diskusi', error)
    $q.notify({ type: 'negative', message: 'Gagal memuat diskusi' })
  }
}

const postDiscussion = async () => {
  if (!newPost.value.trim()) return
  sending.value = true
  try {
    await api.post(`/discuss/${packageId}/post`, { content: newPost.value })
    newPost.value = ''
    $q.notify({ type: 'positive', message: 'Diskusi berhasil diposting', color: 'edulang-navy' })
    await fetchDiscussions()
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal memposting diskusi' })
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
    await api.post(`/discuss/${packageId}/${replyDialog.value.postIndex}/reply`, {
      content: replyDialog.value.content,
    })
    replyDialog.value.show = false
    $q.notify({ type: 'positive', message: 'Balasan terkirim', color: 'edulang-navy' })
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
/* Typography & Colors based on Guideline */
.bg-edulang-white {
  background-color: #f5f7fa;
}
.text-edulang-navy {
  color: #003387;
}
.text-edulang-blue {
  color: #0089ff;
}
.text-edulang-grey {
  color: #64748b;
}
.text-edulang-black {
  color: #2d2d2d;
}
.bg-edulang-navy {
  background-color: #003387 !important;
}
.bg-edulang-blue-light {
  background-color: #e6f3ff !important;
}

.header-font {
  font-family: 'Outfit', sans-serif;
}
.body-font {
  font-family: 'Poppins', sans-serif;
}
.cta-font {
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.5px;
}

/* Styles */
.max-width-container {
  max-width: 1100px;
  margin: 0 auto;
}
.rounded-20 {
  border-radius: 20px;
}
.rounded-t-24 {
  border-radius: 24px 24px 0 0;
}
.rounded-12 {
  border-radius: 12px;
}
.rounded-8 {
  border-radius: 8px;
}

.shadow-soft {
  box-shadow: 0 12px 30px rgba(0, 51, 135, 0.06);
}
.shadow-yellow {
  box-shadow: 0 4px 14px rgba(255, 196, 44, 0.4);
}
.border-light {
  border: 1px solid #e2e8f0;
}

.thread-line {
  position: absolute;
  left: -20px;
  top: 0;
  bottom: 40px;
  width: 2px;
  background: #e2e8f0;
}
.replies-section {
  position: relative;
}

/* Chat Customization */
.custom-chat :deep(.q-message-text) {
  border-radius: 16px;
  padding: 16px 20px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}
.main-post :deep(.q-message-text--received) {
  border-top-left-radius: 0;
}

.reply-chat :deep(.q-message-text) {
  border-radius: 14px;
  padding: 12px 18px;
}
.reply-chat :deep(.q-message-text--sent) {
  border-top-right-radius: 0;
}

.sticky-card {
  position: sticky;
  top: 24px;
  z-index: 10;
}

.back-btn:hover {
  background-color: #003387 !important;
  color: white !important;
}

.input-custom :deep(.q-field__control) {
  border-radius: 12px;
}
</style>
