<template>
  <span id="command" @click="copy()">
    <q-tooltip class="text-body2">
      {{ i18n.t("command-suggestion.click-to-copy") }}
    </q-tooltip>
    {{ suggest }}
  </span>
</template>

<script lang="ts" setup>
import { copyToClipboard, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  suggest: string;
}>();

const i18n = useI18n();
const quasar = useQuasar();

async function copy() {
  await copyToClipboard(props.suggest).then(() => {
    quasar.notify({
      message: i18n.t("command-suggestion.copied"),
      color: "blue",
      icon: "las la-copy",
    });
  });
}
</script>

<style scoped>
#command {
  font-family: "Minecraft Regular";
  background-color: #2a2a2a;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
}
</style>
