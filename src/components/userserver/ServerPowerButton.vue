<template>
  <q-btn
    v-if="server.status !== 'ONLINE'"
    icon="las la-power-off"
    :loading="isLoading"
    :color="buttonColor"
    :disable="isButtonDisabled"
    @click="handlePowerButton"
  />

  <q-btn-dropdown
    v-else
    icon="las la-power-off"
    :loading="isLoading"
    :color="buttonColor"
    :disable="isButtonDisabled"
  >
    <q-list dense>
      <q-item v-close-popup clickable @click="handlePowerButton">
        <q-item-section>
          <q-item-label>{{ t("userserver.shutdown") }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-close-popup clickable @click="handlePowerButton(true)">
        <q-item-section>
          <q-item-label>{{ t("userserver.restart") }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useServerStore } from "stores/serverStore";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const serverStore = useServerStore();
const { t } = useI18n();

const { server } = storeToRefs(serverStore);

const isLoading = computed(() => {
  if (!server.value) return true;

  if (server.value.status === "STOPPING") return true;
  if (server.value.status === "STARTING") return true;

  return false;
});

const buttonColor = computed(() => {
  switch (serverStore.server?.status) {
    case "OFFLINE":
      return "positive";
    default:
      return "negative";
  }
});

const isButtonDisabled = computed(() => {
  if (!server.value) {
    return true;
  }
  if (server.value.status === "ONLINE" || server.value.status === "OFFLINE")
    return false;

  return true;
});

async function handlePowerButton(restart: boolean) {
  if (!server.value) return;

  if (server.value.status === "ONLINE")
    await serverStore.stopServer(server.value.id, restart);
  if (server.value.status === "OFFLINE")
    await serverStore.startServer(server.value.id);
}
</script>

<style scoped></style>
