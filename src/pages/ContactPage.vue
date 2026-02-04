<template>
  <q-page class="contact-page" style="min-height: auto; padding-top: 20px">
    <div class="contact-wrapper">
      <!-- Bagian atas: judul + phone/address + gambar kanan -->
      <div class="row q-col-gutter-xl items-start q-mb-xl">
        <div class="col-12 col-md-7">
          <div class="q-mb-lg">
            <div class="text-h4 text-weight-bolder text-indigo-10">Contact us</div>
            <div class="text-body1 text-grey-7 q-mt-xs">
              Our operational time is Monday to Friday starting from 08.30 WIB to 21.30 WIB.
            </div>
          </div>

          <div class="row q-col-gutter-xl">
            <div class="col-12 col-sm-6">
              <div class="text-subtitle2 text-weight-bold q-mb-sm">Phone Number &amp; Whatsapp</div>
              <div class="text-body1 text-weight-bold q-mb-md">+62 822-7950-6450</div>
              <q-btn
                class="chat-admin-btn"
                color="amber-7"
                text-color="black"
                no-caps
                unelevated
                rounded
                label="Chat Admin"
                @click="openWhatsapp"
              />
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-subtitle2 text-weight-bold q-mb-sm">Address</div>
              <div class="text-body2 text-grey-8">
                Jl. ZA. Pagar Alam No.26, Labuhan Ratu, Kec. Kedaton, Kota Bandar Lampung
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-5 flex justify-end">
          <img
            src="~assets/contact.png"
            alt="Edulang Customer Support"
            class="contact-hero-image"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
function openWhatsapp() {
  const phone = '6282279506450'
  const text = encodeURIComponent('Halo Admin Edulang, saya ingin konsultasi mengenai kelas.')
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
}
</script>

<style scoped>
.contact-page {
  font-family: 'Poppins', sans-serif;
}

.contact-wrapper {
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 16px 56px;
}

.contact-hero-image {
  max-width: 360px;
  border-radius: 18px;
  display: block;
}

.chat-admin-btn {
  padding: 8px 22px;
}

@media (max-width: 1023px) {
  .contact-wrapper {
    padding-top: 24px;
  }

  .contact-hero-image {
    max-width: 100%;
    margin-top: 24px;
  }
}
</style>
