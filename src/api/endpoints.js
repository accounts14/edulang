/**
 * Referensi path API backend (baseURL /api sudah di-set di src/boot/axios.js).
 * Full URL = baseURL + path di bawah.
 *
 * Package & Lessons (Mentor):
 * - GET    /packages                    → list packages
 * - GET    /packages/:packageId         → detail package
 * - POST   /packages                   → buat package
 * - PUT    /packages/:packageId        → update package
 * - DELETE /packages/:packageId        → hapus package
 * - POST   /packages/:packageId/lessons              → tambah lesson
 * - PUT    /packages/:packageId/lessons/:lessonOrder → update lesson
 * - DELETE /packages/:packageId/lessons/:lessonOrder  → hapus lesson
 * - POST   /packages/:packageId/lessons/:lessonOrder/generate-ai → generate soal dengan AI
 *
 * User Learn (Langganan → Mulai Belajar → video + pertemuan + Soal + Penjelasan AI):
 * - GET    /userprogress/my-progress/:packageId  → narik soal (lessons + assignment)
 * - POST   /submissions                          → jawab soal (packageId, lessonOrder, questionIndex, userAnswer)
 * - GET    /submissions/my/subs                  → history jawaban user (grouped by Lesson Q1, Q2, ...)
 */

export const packageEndpoints = {
  list: '/packages',
  detail: (packageId) => `/packages/${packageId}`,
  create: '/packages',
  update: (packageId) => `/packages/${packageId}`,
  delete: (packageId) => `/packages/${packageId}`,
}

export const lessonEndpoints = {
  create: (packageId) => `/packages/${packageId}/lessons`,
  update: (packageId, lessonOrder) => `/packages/${packageId}/lessons/${lessonOrder}`,
  delete: (packageId, lessonOrder) => `/packages/${packageId}/lessons/${lessonOrder}`,
  /** Generate soal (assignment) dengan AI. Body: { prompt } */
  generateAi: (packageId, lessonOrder) =>
    `/packages/${packageId}/lessons/${lessonOrder}/generate-ai`,
}

/** User: ambil soal & submit jawaban untuk dapat penjelasan AI */
export const assignmentEndpoints = {
  /** GET: daftar soal (pilihan ganda + esai) untuk lesson */
  get: (packageId, lessonOrder) => `/packages/${packageId}/lessons/${lessonOrder}/assignment`,
}

/** User submissions (jawaban + feedback AI) */
export const submissionEndpoints = {
  /** POST: kirim jawaban 1 soal (langsung dinilai AI) */
  create: '/submissions',
  /** GET: history submissions milik user */
  mySubs: '/submissions/my/subs',
}
