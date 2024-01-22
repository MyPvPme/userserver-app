<template>
  <q-btn
    icon="las la-box-open"
    color="warning"
    :loading="isLoading"
    @click="restoreServer"
  />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useServerStore } from "stores/serverStore";
import { computed } from "vue";
import { useErrorHandler } from "src/utils/error-handler";
import { useI18n } from "vue-i18n";

const { server } = storeToRefs(useServerStore());
const serverStore = useServerStore();
const { handleError } = useErrorHandler();
const { t } = useI18n();

const isLoading = computed(() =>
  ["RESTORING", "ARCHIVING"].includes(server.value?.status ?? "")
);

async function restoreServer() {
  if (!server.value) return;

  try {
    await serverStore.restoreServer(server.value.id);
  } catch (e) {
    handleError(e, t(""));
  }
}
</script>

<style scoped></style>
