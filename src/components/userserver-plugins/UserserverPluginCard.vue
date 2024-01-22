<template>
  <q-card class="column justify-between">
    <q-card-section>
      {{ plugin.serverExtension.name }}
    </q-card-section>

    <q-card-actions class="extension-actions">
      <q-btn icon="las la-plus" flat color="positive" />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import { ServerExtensionVersion } from "@mypvp/userserver-api-client-browser";

defineProps<{ plugin: ServerExtensionVersion }>();
</script>

<style scoped>
.extension-actions {
  bottom: 0;
}
</style>
