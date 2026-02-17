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
            Forum Diskusi (Mentor)
          </h1>
          <p class="text-body1 text-edulang-grey body-font q-mt-xs">
            Berinteraksi langsung dengan peserta secara
            <span class="text-edulang-blue text-weight-medium">aktif dan personal.</span>
          </p>
        </div>
      </div>

      <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-4">
          <div class="sticky-card">
            <q-card
              flat
              class="rounded-20 border-light bg-white shadow-soft overflow-hidden q-mb-lg"
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
                  :loading="sending"
                  :disable="!newPost.trim() || sending"
                />
              </q-card-section>
            </q-card>

            <q-card flat class="rounded-20 border-light bg-white shadow-soft">
              <q-card-section class="q-pa-md">
                <div class="text-caption text-grey-7 q-mb-sm body-font text-weight-bold">
                  URUTKAN BERDASARKAN
                </div>
                <q-btn-toggle
                  v-model="sortBy"
                  spread
                  no-caps
                  unelevated
                  toggle-color="edulang-navy"
                  color="grey-2"
                  text-color="grey-7"
                  class="rounded-12 overflow-hidden border-light"
                  :options="[
                    { label: 'Terbaru', value: 'newest', icon: 'history' },
                    { label: 'Terlama', value: 'oldest', icon: 'schedule' },
                  ]"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="col-12 col-md-8">
          <div v-if="loading" class="flex flex-center q-pa-xl">
            <q-spinner-tail color="edulang-blue" size="50px" />
          </div>

          <div
            v-else-if="sortedDiscussions.length === 0"
            class="flex flex-center q-pa-xl bg-white rounded-20 border-dashed empty-state"
          >
            <div class="text-center">
              <q-icon name="forum" size="100px" color="grey-3" />
              <div class="text-edulang-navy q-mt-md header-font text-h6">Belum Ada Diskusi</div>
              <p class="text-grey-6 body-font">Siswa belum memulai percakapan apa pun.</p>
            </div>
          </div>

          <div
            v-else
            v-for="post in sortedDiscussions"
            :key="post.originalIndex"
            class="discussion-wrapper q-mb-xl"
          >
            <div class="row items-center justify-between q-mb-sm">
              <div
                class="discussion-tag bg-edulang-blue-light text-edulang-blue text-weight-bold px-md py-xs rounded-8"
              >
                Diskusi #{{ post.originalNumber }}
              </div>
              <div class="row items-center">
                <div class="text-caption text-grey-6 body-font q-mr-md">
                  {{ formatDate(post.createdAt) }}
                </div>
                <q-btn
                  flat
                  round
                  dense
                  color="red-4"
                  icon="delete_sweep"
                  size="sm"
                  @click="confirmDelete(post.originalIndex)"
                >
                  <q-tooltip class="bg-red">Hapus Seluruh Rangkaian</q-tooltip>
                </q-btn>
              </div>
            </div>

            <q-chat-message
              :name="post.role === 'mentor' ? 'Anda (Mentor)' : post.username || 'Siswa'"
              :avatar="
                post.role === 'mentor'
                  ? 'https://cdn.quasar.dev/img/avatar2.jpg'
                  : `https://ui-avatars.com/api/?name=${post.username || 'User'}&background=0089FF&color=fff`
              "
              :text="[post.content]"
              :bg-color="post.role === 'mentor' ? 'edulang-navy' : 'white'"
              :text-color="post.role === 'mentor' ? 'white' : 'edulang-black'"
              :sent="post.role === 'mentor'"
              class="body-font custom-chat main-post"
            />

            <div
              v-if="post.replies && post.replies.length > 0"
              class="replies-section q-ml-xl q-mt-md q-pl-md"
            >
              <div class="thread-line"></div>
              <q-chat-message
                v-for="(reply, rIndex) in post.replies"
                :key="rIndex"
                :name="reply.role === 'mentor' ? 'Anda (Mentor)' : reply.username || 'Siswa'"
                :avatar="
                  reply.role === 'mentor'
                    ? 'https://cdn.quasar.dev/img/avatar2.jpg'
                    : `https://ui-avatars.com/api/?name=${reply.username || 'User'}&background=0089FF&color=fff`
                "
                :text="[reply.content]"
                :sent="reply.role === 'mentor'"
                :bg-color="reply.role === 'mentor' ? 'edulang-navy' : 'edulang-blue-light'"
                :text-color="reply.role === 'mentor' ? 'white' : 'edulang-navy'"
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
                @click="openReplyDialog(post.originalIndex)"
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
          <q-btn
            flat
            label="Batal"
            color="grey-7"
            v-close-popup
            class="rounded-8 q-px-md body-font"
          />
          <q-btn
            unelevated
            label="Kirim Balasan"
            color="blue"
            @click="submitReply"
            :loading="sending"
            class="rounded-12 q-px-xl text-weight-bold cta-font"
            style="min-width: 150px"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const packageId = route.params.packageId

const discussions = ref([])
const newPost = ref('')
const loading = ref(true)
const sending = ref(false)
const sortBy = ref('newest')

const replyDialog = ref({
  show: false,
  postIndex: null,
  content: '',
})

const formatDate = (timeStamp) => {
  if (!timeStamp) return ''
  return date.formatDate(timeStamp, 'DD MMM YYYY, HH:mm')
}

// Logic Mapping & Sorting
const sortedDiscussions = computed(() => {
  if (!discussions.value) return []
  const mapped = discussions.value.map((post, index) => ({
    ...post,
    originalIndex: index,
    originalNumber: index + 1,
  }))

  return [...mapped].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime()
    const dateB = new Date(b.createdAt || 0).getTime()
    return sortBy.value === 'newest' ? dateB - dateA : dateA - dateB
  })
})

const fetchDiscussions = async () => {
  loading.value = true
  try {
    const res = await api.get(`/discuss/${packageId}`)
    discussions.value = res.data.discussion?.posts || []
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal memuat diskusi' })
  } finally {
    loading.value = false
  }
}

const postDiscussion = async () => {
  if (!newPost.value.trim()) return
  sending.value = true
  try {
    await api.post(`/discuss/${packageId}/post`, { content: newPost.value })
    newPost.value = ''
    $q.notify({ type: 'positive', message: 'Berhasil dikirim', color: 'edulang-navy' })
    await fetchDiscussions()
  } catch {
    $q.notify({ type: 'negative', message: 'Gagal mengirim' })
  } finally {
    sending.value = false
  }
}

const openReplyDialog = (originalIndex) => {
  replyDialog.value.postIndex = originalIndex // Samakan dengan versi user
  replyDialog.value.content = ''
  replyDialog.value.show = true
}

const submitReply = async () => {
  if (!replyDialog.value.content.trim()) return
  sending.value = true
  try {
    // URL sekarang nembak ID asli postingan tersebut
    await api.post(`/discuss/${packageId}/${replyDialog.value.postIndex}/reply`, {
      content: replyDialog.value.content,
    })
    replyDialog.value.show = false
    $q.notify({ type: 'positive', message: 'Balasan terkirim', color: 'edulang-navy' })
    await fetchDiscussions()
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Gagal membalas' })
  } finally {
    sending.value = false
  }
}

const confirmDelete = (originalIndex) => {
  $q.dialog({
    title: 'Hapus Diskusi',
    message: 'Apakah Anda yakin? Seluruh percakapan di topik ini akan dihapus permanen.',
    cancel: true,
    ok: { color: 'red-6', label: 'Hapus' },
  }).onOk(async () => {
    try {
      await api.delete(`/discuss/${packageId}/${originalIndex}`)
      $q.notify({ type: 'info', message: 'Terhapus' })
      await fetchDiscussions()
    } catch {
      $q.notify({ type: 'negative', message: 'Gagal menghapus' })
    }
  })
}

onMounted(fetchDiscussions)
</script>

<style scoped>
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
.discussion-tag {
  font-size: 12px;
  padding: 4px 12px;
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
.custom-chat :deep(.q-message-text) {
  border-radius: 16px;
  padding: 16px 20px;
  border: 1px solid #f1f5f9;
}
.custom-chat :deep(.q-message-text--sent),
.reply-chat :deep(.q-message-text--sent) {
  background-color: #003387 !important;
  color: white !important;
}
.main-post :deep(.q-message-text--received) {
  background-color: white !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.reply-chat :deep(.q-message-text--received) {
  background-color: #e6f3ff !important;
  color: #003387 !important;
}
.sticky-card {
  position: sticky;
  top: 24px;
  z-index: 10;
}
</style>
