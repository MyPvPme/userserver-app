<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ path.split(".").pop() }}</q-item-label>
    </q-item-section>
    <q-item-section>
      <q-toggle v-model="model" @update:model-value="emitNewValue()" />
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
  path: string;
  value: boolean;
}>();

const emit = defineEmits(["newValue"]);

const model = ref(false);

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
