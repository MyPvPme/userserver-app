<template>
  <q-card id="card" class="text-center" flat bordered>
    <q-img
      id="background"
      src="slots-background.png"
      height="135%"
      style="z-index: -1"
    />
    <div class="absolute-center">
      <q-card-section class="text-white column">
        <a class="text-h2 text-white">{{ slots }}</a>
        <a class="text-uppercase text-subtitle2 text-white">Slots</a>
      </q-card-section>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
defineProps<{
  slots: number;
}>();
</script>

<style scoped>
#card {
  display: grid;
  grid-auto-rows: max-content;
  grid-auto-flow: row;
  z-index: 1;
  overflow: hidden;
  background-color: #505050;
}
#background {
  position: absolute;
  top: -17.5%;
  filter: blur(5px);
  opacity: 0.5;
}
</style>
