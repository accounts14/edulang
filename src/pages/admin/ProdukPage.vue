<template>
  <q-page class="q-pa-xl bg-accent flex flex-center">
    <div class="text-center" style="max-width: 480px">
      <div class="text-h4 text-weight-bolder text-indigo-10 q-mb-md">Produk</div>
      <p class="text-body1 text-grey-8 q-mb-xl">
        Halaman Produk sedang dalam pengembangan. Akan segera hadir!
      </p>
      <q-btn
        unelevated
        color="primary"
        text-color="white"
        no-caps
        label="Kembali ke Dashboard"
        class="rounded-borders q-px-xl text-weight-bold"
        to="/admin/dashboard"
      />
    </div>
  </q-page>
</template>

<script setup>
//
</script>

<style scoped>
.text-indigo-10 {
  color: #0d2a5c;
}

.rounded-borders {
  border-radius: 8px;
}
</style>
