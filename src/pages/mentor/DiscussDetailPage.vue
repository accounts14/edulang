<template>
  <q-page class="q-pa-md bg-edulang-white">
    <div class="max-width-900 mx-auto">
      <div class="row items-center justify-between q-mb-xl q-mt-md">
        <div class="row items-center">
          <q-btn
            icon="chevron_left"
            unelevated
            color="white"
            text-color="edulang-navy"
            @click="$router.back()"
            class="rounded-12 q-mr-md shadow-sm"
          />
          <div>
            <div class="text-h5 text-weight-bolder text-edulang-navy header-font">
              Ruang Konsultasi
            </div>
            <div class="text-caption text-edulang-grey body-font">
              Kelola interaksi dan bimbingan belajar siswa
            </div>
          </div>
        </div>

        <q-badge outline color="edulang-blue" class="q-pa-sm rounded-8 body-font">
          <q-icon name="analytics" class="q-mr-xs" />
          {{ discussionPosts.length }} Diskusi Aktif
        </q-badge>
      </div>

      <div v-if="loading" class="flex flex-center q-pa-xl">
        <q-spinner-ios color="edulang-blue" size="50px" />
      </div>

      <div v-else class="q-gutter-y-xl">
        <div v-for="(post, index) in discussionPosts" :key="index" class="discussion-container">
          <div class="row items-center q-mb-sm q-px-md">
            <q-icon name="tag" color="edulang-blue" size="xs" />
            <span class="text-overline text-weight-bold text-edulang-blue q-ml-xs"
              >Topik #{{ index + 1 }}</span
            >
            <q-spacer />
            <q-btn
              flat
              round
              dense
              icon="delete_sweep"
              color="grey-4"
              @click="confirmDelete(index)"
            >
              <q-tooltip>Tutup Diskusi</q-tooltip>
            </q-btn>
          </div>

          <q-card flat class="rounded-24 shadow-brand bg-white border-subtle">
            <q-card-section class="q-pa-lg">
              <div class="row q-mb-lg">
                <q-avatar size="40px" class="q-mr-md shadow-sm">
                  <img
                    :src="`https://ui-avatars.com/api/?name=${post.author}&background=0089FF&color=fff`"
                  />
                </q-avatar>
                <div class="col">
                  <div class="student-bubble q-pa-md">
                    <div class="text-weight-bold text-edulang-navy body-font q-mb-xs">
                      {{ post.author }}
                    </div>
                    <div class="text-body1 body-font">{{ post.content }}</div>
                  </div>
                  <div class="text-caption text-grey-5 q-mt-xs q-ml-sm">Siswa • Baru saja</div>
                </div>
              </div>

              <!-- Replies Section - Urutan dari lama ke baru -->
              <div v-if="post.replies?.length" class="q-mt-md column items-end">
                <div
                  v-for="(reply, rIdx) in getSortedReplies(post.replies)"
                  :key="rIdx"
                  :class="[
                    'reply-box q-mb-md',
                    reply.role === 'mentor' ? 'mentor-align' : 'student-align',
                  ]"
                >
                  <div
                    :class="[
                      'bubble q-pa-md shadow-sm',
                      reply.role === 'mentor' ? 'bg-edulang-navy text-white' : 'bg-grey-2',
                    ]"
                  >
                    <div v-if="reply.role === 'mentor'" class="row items-center q-mb-xs">
                      <q-icon name="verified" size="14px" class="q-mr-xs text-edulang-yellow" />
                      <span class="text-caption text-weight-bold uppercase opacity-80"
                        >Mentor (Anda)</span
                      >
                    </div>
                    <div class="text-body2 body-font">{{ reply.content }}</div>
                  </div>
                </div>
              </div>

              <div
                class="reply-action-area q-mt-lg q-pa-sm rounded-16 bg-edulang-white border-light"
              >
                <div class="row items-center">
                  <q-input
                    v-model="replyTexts[index]"
                    placeholder="Tulis pesan edukatif..."
                    borderless
                    dense
                    autogrow
                    class="col q-px-md body-font"
                    @keypress.enter.ctrl="submitReply(index)"
                  />
                  <q-btn
                    unelevated
                    round
                    icon="send"
                    class="btn-send-modern shadow-blue bg-edulang-blue text-white"
                    :loading="submitting === index"
                    @click="submitReply(index)"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
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

// Fungsi untuk mengurutkan replies dari lama ke baru (atas ke bawah)
const getSortedReplies = (replies) => {
  if (!replies || replies.length === 0) return []
  return [...replies].reverse()
}

const fetchDiscussions = async () => {
  try {
    const res = await api.get(`/discuss/${route.params.packageId}`)
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
/* Brands & Layout */
.bg-edulang-white {
  background-color: #f8fafc !important;
}
.text-edulang-navy {
  color: #003387 !important;
}
.text-edulang-blue {
  color: #0089ff !important;
}
.text-edulang-grey {
  color: #64748b !important;
}
.bg-edulang-navy {
  background-color: #003387 !important;
}
.bg-edulang-blue {
  background-color: #0089ff !important;
}
.text-edulang-yellow {
  color: #ffc42c !important;
}

.header-font {
  font-family: 'Outfit', sans-serif;
}
.body-font {
  font-family: 'Poppins', sans-serif;
}

.max-width-900 {
  max-width: 900px;
  margin: 0 auto;
}
.rounded-24 {
  border-radius: 24px;
}
.rounded-16 {
  border-radius: 16px;
}
.rounded-12 {
  border-radius: 12px;
}
.rounded-8 {
  border-radius: 8px;
}

/* Dashboard Card Style */
.shadow-brand {
  box-shadow: 0 20px 50px -12px rgba(0, 51, 135, 0.08) !important;
}
.border-subtle {
  border: 1px solid rgba(226, 232, 240, 0.8);
}
.border-light {
  border: 1px solid #e2e8f0;
}

/* Bubble Styles */
.student-bubble {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 0 20px 20px 20px;
  max-width: 85%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.reply-box {
  max-width: 80%;
}
.mentor-align {
  align-self: flex-end;
}
.student-align {
  align-self: flex-start;
}

.bubble {
  border-radius: 20px 20px 0 20px;
}
.student-align .bubble {
  border-radius: 20px 20px 20px 0;
}

/* Input Styling */
.reply-action-area {
  transition: all 0.3s ease;
}
.reply-action-area:focus-within {
  background: #ffffff;
  border-color: #0089ff;
  box-shadow: 0 0 0 4px rgba(0, 137, 255, 0.1);
}

.btn-send-modern {
  width: 44px;
  height: 44px;
  font-size: 18px;
}
.shadow-blue {
  box-shadow: 0 4px 14px rgba(0, 137, 255, 0.4);
}

.opacity-80 {
  opacity: 0.8;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
