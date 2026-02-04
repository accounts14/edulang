// src/router/index.js
import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('userRole')

    // Jika user sudah login dan mencoba akses halaman auth, redirect ke dashboard
    if (token && (to.path === '/login' || to.path === '/register')) {
      if (role === 'admin') {
        next('/admin/dashboard')
      } else if (role === 'mentor') {
        next('/mentor/dashboard')
      } else {
        next('/dashboard')
      }
      return
    }

    // Proteksi route yang butuh autentikasi
    if (to.meta.requiresAuth) {
      if (!token) {
        next('/login')
        return
      }

      // Cek izin role
      if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(role)) {
        // Jika role tidak diizinkan, kembalikan ke halaman sesuai rolenya
        if (role === 'admin') {
          next('/admin/dashboard')
        } else if (role === 'mentor') {
          next('/mentor/dashboard')
        } else {
          next('/dashboard')
        }
        return
      }
    }

    next()
  })

  return Router
})
