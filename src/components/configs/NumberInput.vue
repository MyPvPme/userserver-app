<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ path.split(".").pop() }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-input v-model.number="model" type="number" @blur="emitNewValue()" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  path: {
    type: String,
    required: true,
  },

  value: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["newValue"]);

const model = ref(0);

watch(
  () => props.value,
  (value) => {
    model.value = value;
  }
);

const emitNewValue = () => {
  if (model.value !== props.value) {
    emit("newValue", model.value);
  }
};
</script>

<style scoped></style>
