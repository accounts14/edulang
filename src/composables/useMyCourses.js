/**
 * Composable: useMyCourses
 * Mengambil course yang terdaftar/success untuk user yang login.
 * Hanya menampilkan transaksi dengan status 'success' atau 'terdaftar'.
 * Yang gagal (failed) tidak ditampilkan.
 * Menggunakan endpoint: GET /userprogress/my-progress/:packageId
 */
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios'

const ALLOWED_STATUSES = ['success', 'terdaftar']

function parseProgress(val) {
  if (val == null) return 0
  if (typeof val === 'number') return Math.min(100, Math.max(0, val))
  const m = String(val).match(/(\d+(?:\.\d+)?)/)
  return m ? parseFloat(m[1]) : 0
}

export function useMyCourses() {
  const loading = ref(true)
  const packagesMap = ref({})
  const myPackageIds = ref([])

  const myCourses = computed(() => {
    return myPackageIds.value.map((id) => packagesMap.value[id]).filter(Boolean)
  })

  async function fetchData() {
    loading.value = true
    try {
      // 1. Ambil transaksi user yang login (backend return transaksi milik user)
      const txRes = await api.get('/transactions')
      const txData = txRes.data || {}
      const txList = Array.isArray(txData.transactions)
        ? txData.transactions
        : Array.isArray(txData.data)
          ? txData.data
          : []

      // 2. Filter: hanya terdaftar atau success (gagal tidak ditampilkan)
      const validTx = txList.filter(
        (t) => t.status && ALLOWED_STATUSES.includes(String(t.status).toLowerCase()),
      )

      const ids = [
        ...new Set(
          validTx
            .map((t) => t.packageId ?? t.package_id ?? t.package?._id ?? t.package?.id ?? t.package)
            .filter(Boolean),
        ),
      ]
      myPackageIds.value = ids

      if (ids.length === 0) {
        packagesMap.value = {}
        return
      }

      // 3. Untuk tiap packageId, panggil GET /userprogress/my-progress/:packageId
      const map = {}
      const results = await Promise.allSettled(
        ids.map((packageId) => api.get(`/userprogress/my-progress/${packageId}`)),
      )

      for (let i = 0; i < ids.length; i++) {
        const packageId = ids[i]
        const result = results[i]
        if (result.status === 'fulfilled' && result.value?.data) {
          const responseBody = result.value.data
          const data = responseBody.data ?? responseBody
          const pkg = data.package ?? data.packageDetail
          const progress = parseProgress(data.percentage ?? data.progress ?? data.progressPercent)
          if (pkg && (pkg._id || pkg.id || packageId)) {
            map[packageId] = {
              ...(typeof pkg === 'object' ? pkg : {}),
              _id: pkg._id ?? pkg.id ?? packageId,
              id: pkg.id ?? pkg._id ?? packageId,
              progress,
            }
          }
        }
      }

      // 4. Jika my-progress tidak mengembalikan detail package, fallback ke /packages/:id
      for (const id of ids) {
        if (map[id]) continue
        try {
          const pRes = await api.get(`/packages/${id}`)
          const p = pRes.data?.package ?? pRes.data?.data ?? pRes.data
          if (p) map[id] = { ...p, progress: 0 }
        } catch {
          // skip
        }
      }
      packagesMap.value = map
    } catch (e) {
      if (e.response?.status === 404 || e.response?.status === 501) {
        // Backend mungkin belum punya /transactions, fallback kosong
        myPackageIds.value = []
        packagesMap.value = {}
      } else {
        throw e
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    packagesMap,
    myPackageIds,
    myCourses,
    fetchData,
  }
}
