<template>
  <q-layout view="lHh Lpr lff" class="font-poppins">
    
    <q-header class="bg-white text-dark q-py-sm shadow-1">
      <q-toolbar class="container">
        <q-toolbar-title class="flex items-center cursor-pointer" @click="$router.push('/')">
          <img src="~assets/Edulang.png" style="height: 40px; width: auto;" alt="Edulang Logo" />
        </q-toolbar-title>

        <div class="gt-md row q-gutter-sm text-weight-medium">
          <q-btn flat no-caps label="Kelas Bahasa" class="nav-btn text-primary text-weight-bold" />
          <q-btn flat no-caps label="Berlangganan" class="nav-btn" />
          <q-btn flat no-caps label="Metode Belajar" class="nav-btn" />
          <q-btn flat no-caps label="Alur Belajar" class="nav-btn" />
          <q-btn flat no-caps label="Produk" class="nav-btn" />
        </div>

        <q-space />

        <div class="gt-sm row items-center q-gutter-md">
          <div class="row items-center cursor-pointer text-grey-8">
            <q-icon name="language" size="sm" class="q-mr-xs" />
            <span class="text-weight-bold" id="google_translate_element">IND</span>
          </div>

          <q-btn flat no-caps label="Masuk" class="text-weight-bold text-dark" @click="$router.push('/register')"/>
          <q-btn 
            unelevated 
            no-caps 
            label="Daftar Sekarang" 
            color="warning" 
            text-color="dark" 
            class="text-weight-bold q-px-md rounded-borders" 
            @click="$router.push('/register')"
          />
        </div>

        <q-btn flat dense round icon="menu" aria-label="Menu" class="lt-lg" @click="toggleLeftDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="right" bordered behavior="mobile" class="bg-white">
      <q-list padding>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable v-ripple><q-item-section>Kelas Bahasa</q-item-section></q-item>
        <q-item clickable v-ripple><q-item-section>Berlangganan</q-item-section></q-item>
        <q-item clickable v-ripple><q-item-section>Masuk</q-item-section></q-item>
        <q-item clickable v-ripple class="bg-warning text-dark"><q-item-section>Daftar Sekarang</q-item-section></q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <footer class="bg-white text-dark q-mt-xl">
      <q-separator color="grey-3" />
      <div class="container q-py-xl">
        <div class="row q-col-gutter-xl">
          
          <div class="col-12 col-md-5">
            <div class="q-mb-md flex items-center">
              <img src="~assets/Edulang.png" style="height: 35px; width: auto;" alt="Edulang Logo" />
            </div>
            <p class="text-grey-8 q-mb-md" style="line-height: 1.6; max-width: 400px;">
              Edulang adalah platform pembelajaran bahasa untuk tujuan karir atau pembelajaran masa depan.
            </p>
            
            <div class="q-mb-md">
              <div class="text-weight-bold q-mb-xs">Alamat</div>
              <div class="text-grey-8">
                Jl. ZA. Pagar Alam No.26, Labuhan Ratu, Kec. Kedaton, Kota Bandar Lampung
              </div>
            </div>

            <div>
              <div class="text-weight-bold q-mb-xs">Kontak</div>
              <div class="text-grey-8">+62 822-7950-6450</div>
            </div>
          </div>

          <div class="col-12 col-md-1 gt-sm"></div> 

          <div class="col-12 col-md-3">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Social Media</div>
            <div class="column q-gutter-md text-grey-8">
              <div class="row items-center cursor-pointer hover-text">
                <q-icon name="mail" class="q-mr-sm" size="xs" />
                <span>contactedulang@gmail.com</span>
              </div>
              <div class="row items-center cursor-pointer hover-text">
                <q-icon name="fab fa-tiktok" class="q-mr-sm" size="xs" />
                <span>edulang.id</span>
              </div>
              <div class="row items-center cursor-pointer hover-text">
                <q-icon name="fab fa-instagram" class="q-mr-sm" size="xs" />
                <span>edulang.id</span>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-subtitle1 text-weight-bold q-mb-md">General</div>
            <div class="column q-gutter-sm text-grey-8">
              <a href="#" class="footer-link">tentang kami</a>
              <a href="#" class="footer-link">produk</a>
              <a href="#" class="footer-link">Kelas Bahasa</a>
              <a href="#" class="footer-link">Berlangganan</a>
            </div>
          </div>

        </div>
      </div>

      <div class="bg-blue-10 text-white q-py-md text-center text-caption">
        <div class="container">
          © 2025 All Right Reserved | PT Active Edulang Global
        </div>
      </div>
    </footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
}

.nav-btn {
  font-weight: 500;
  color: #333;
}

.footer-link {
  text-decoration: none;
  color: inherit;
  transition: 0.3s;
  text-transform: capitalize;
}

.footer-link:hover {
  color: #027BE3;
  padding-left: 4px;
}

.hover-text:hover {
  color: #027BE3;
}

.rounded-borders {
  border-radius: 8px;
}

/* Memastikan layout mengambil tinggi penuh agar footer tidak menggantung jika konten sedikit */
q-page-container {
  min-height: 80vh;
}
</style>