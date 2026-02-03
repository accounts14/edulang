<!-- src/components/landing/LearningMethodSection.vue -->
<template>
  <section class="container q-py-xl">
    <div class="text-center q-mb-xl">
      <h2 class="text-h4 text-weight-bold text-primary q-mb-md">
        Lebih Dari Sekadar Nonton Video
      </h2>
      <p class="text-grey-8 text-body1">
        Kami memastikan setiap menit belajar Anda terkonversi menjadi output nyata untuk masa
        depan.
      </p>
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="method-card q-pa-lg full-height rounded-borders-16">
          <q-avatar
            color="blue-1"
            text-color="primary"
            icon="play_arrow"
            size="lg"
            class="q-mb-lg"
          />
          <div class="text-h6 text-weight-bold text-dark q-mb-sm">Interactive Course</div>
          <p class="text-body2 text-grey-8" style="line-height: 1.6">
            Materi video berkualitas tinggi yang dirancang agar mudah dipahami, dilengkapi quiz
            interaktif di setiap sesi.
          </p>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card
          flat
          class="method-card bg-primary text-white q-pa-lg full-height rounded-borders-16 shadow-10"
        >
          <q-avatar
            color="white-transparent"
            text-color="warning"
            icon="translate"
            size="lg"
            class="q-mb-lg"
          />
          <div class="text-h6 text-weight-bold q-mb-sm">Real Assessment</div>
          <p class="text-body2 text-blue-1" style="line-height: 1.6">
            Bukan cuma nonton. Ikuti tes simulasi (HSK, TOEFL, JLPT) untuk mengukur kemampuan riil
            kamu sebelum tes asli.
          </p>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="method-card q-pa-lg full-height rounded-borders-16">
          <q-avatar
            color="amber-1"
            text-color="warning"
            icon="flight"
            size="lg"
            class="q-mb-lg"
          />
          <div class="text-h6 text-weight-bold text-dark q-mb-sm">Career & Study Path</div>
          <p class="text-body2 text-grey-8" style="line-height: 1.6">
            Output pembelajaran diarahkan langsung untuk persiapan kerja atau kuliah ke China,
            Jepang, Jerman, dll.
          </p>
        </q-card>
      </div>
    </div>
  </section>
</template>

<script setup></script>