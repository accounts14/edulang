<template>
  <q-page class="produk-page bg-accent flex flex-center">
    <section class="container text-center">
      <div class="produk-page-content">
        <h1 class="text-h4 text-weight-bolder text-primary q-mb-md">
          {{ $t('produk.title') }}
        </h1>
        <p class="text-h6 text-grey-8 q-mb-none" style="max-width: 400px; margin: 0 auto">
          {{ $t('produk.comingSoon') }}
        </p>
        <q-btn
          unelevated
          class="rounded-borders q-px-xl text-weight-bold q-mt-xl"
          color="primary"
          text-color="white"
          no-caps
          :label="$t('produk.backHome')"
          :to="'/'"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
//
</script>

<style scoped>
.produk-page {
  min-height: 60vh;
  padding: 2rem 1rem;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
}

.produk-page-content {
  padding: 2rem 0;
}

.rounded-borders {
  border-radius: 8px;
}
</style>
