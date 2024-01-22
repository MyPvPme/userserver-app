<template>
  <q-select
    v-model="currentItem"
    use-input
    :options="filteredMaterials"
    @filter="filterMaterials"
    @blur="emit('blur', $event)"
  >
    <template #prepend>
      <q-img height="32px" width="32px" :src="getImageUrl(currentItem)" />
    </template>
    <template #option="selectProps">
      <q-item
        role="option"
        :active="false"
        :manual-focus="true"
        :focused="false"
        clickable
        class="justify-center"
        @click="selectProps.toggleOption(selectProps.opt)"
      >
        <q-item-section avatar>
          <q-img
            height="32px"
            width="32px"
            :src="getImageUrl(selectProps.opt)"
          ></q-img>
        </q-item-section>
        <q-item-section>
          {{ selectProps.opt }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useMaterialStore } from "stores/materialStore";
import { useErrorHandler } from "src/utils/error-handler";

const props = defineProps<{
  modelValue: string | null;
}>();

const currentItem = computed<string | null>({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const emit = defineEmits(["update:modelValue", "blur"]);

const materialStore = useMaterialStore();
const { handleError } = useErrorHandler();

const materials = computed(() => materialStore.materials);
const filteredMaterials = ref<string[]>([]);

watch(materials, () => {
  if (materials.value) filteredMaterials.value = materials.value;
});

onMounted(() => {
  materialStore.loadMaterials().catch(handleError);
});

function getImageUrl(item: string): string {
  if (typeof item !== "string") return "";

  return `https://cdn.mypvp.me/minecraft-items/${item.toLowerCase()}.png`;
}

function filterMaterials(val: string, update: (update: () => void) => void) {
  if (val === "") {
    update(() => {
      filteredMaterials.value = materials.value ?? [];
    });
    return;
  }

  update(() => {
    const needle = val.toUpperCase();
    filteredMaterials.value =
      materials.value?.filter((v) => v.startsWith(needle)) ?? [];
  });
}
</script>

<style scoped></style>
