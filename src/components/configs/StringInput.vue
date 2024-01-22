<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ path.split(".").pop() }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-input v-model="model" @blur="emitNewValue()" />
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
    path: string;
    value: string;
  }>(),
  model = ref("");

const emit = defineEmits(["newValue"]);

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
