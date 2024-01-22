<template>
  <div class="row items-center">
    <q-skeleton v-if="!noDot" id="dot" type="circle" />
    <q-skeleton v-if="!noText" class="q-ml-xs" type="text" width="80px" />
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    noText?: boolean;
    noDot?: boolean;
  }>(),
  { noDot: false, noText: false }
);
</script>

<style scoped>
#dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>
