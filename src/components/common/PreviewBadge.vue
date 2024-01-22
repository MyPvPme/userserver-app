<template>
  <div
    class="q-badge flex inline items-center no-wrap q-badge--single-line q-badge--outline preview-badge mypvp-text-color"
    role="status"
    :style="`font-size: ${fontSize || '10px'}`"
    aria-label="Preview"
  >
    Preview
  </div>
</template>

<script lang="ts" setup>
defineProps<{ fontSize: string }>();
</script>

<style>
.preview-badge {
  font-size: 10px;
  position: relative;
  border: none;
}

.preview-badge:before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 10px;
  padding: 2px;
  background: radial-gradient(
    circle,
    rgba(63, 94, 251, 1) 0%,
    rgba(80, 252, 70, 1) 100%
  );
  background-size: 400% 400%;
  border-image-slice: 1;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
