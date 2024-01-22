<template>
  <div class="row items-center">
    <q-img
      :src="`https://visage.surgeplay.com/face/${uuid}`"
      :height="iconSize"
      :width="iconSize"
      class="q-mr-sm"
    />
    <q-skeleton v-if="!username" type="rect" width="150px" height="25px" />
    <div v-else :class="nameClass">{{ username }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useUsersStore } from "src/stores/usersStore";
import { useErrorHandler } from "src/utils/error-handler";

const props = withDefaults(
  defineProps<{
    uuid: string;
    nameClass?: string;
    iconSize?: string;
  }>(),
  {
    nameClass: "text-subtitle1",
    iconSize: "30px",
  }
);

const usersStore = useUsersStore();
const { handleError } = useErrorHandler();

const username = ref("");

watch(
  () => props.uuid,
  () => {
    username.value = "";
    loadUsername();
  }
);

onMounted(() => {
  loadUsername();
});

function loadUsername() {
  usersStore
    .getUsernameFromUuid(props.uuid)
    .then((fetchedName) => {
      username.value = fetchedName;
    })
    .catch((e) => handleError(e));
}
</script>

<style scoped></style>
