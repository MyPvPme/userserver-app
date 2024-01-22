<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card>
      <q-card-section class="text-h5">
        {{ t("userserver.archived-dialog.title") }}
      </q-card-section>

      <q-card-actions>
        {{ t("userserver.archived-dialog.message") }}
      </q-card-actions>

      <q-card-actions class="row justify-end">
        <q-btn :label="t('cancel')" color="negative" @click="onDialogCancel" />
        <q-btn
          :loading="
            server.status === 'RESTORING' || server.status === 'ARCHIVING'
          "
          :label="t('userserver.restore')"
          icon="las la-box-open"
          color="positive"
          @click="ok"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent } from "quasar";
import { useServerStore } from "src/stores/serverStore";
import { computed } from "vue";
import { useErrorHandler } from "src/utils/error-handler";
import { useI18n } from "vue-i18n";

defineEmits([...useDialogPluginComponent.emits]);

const serverStore = useServerStore();
const { handleError } = useErrorHandler();
const { t } = useI18n();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const server = computed(() => serverStore.server);

async function restoreServer() {
  if (!server.value) {
    return;
  }

  try {
    await serverStore.restoreServer(server.value.id.toString());
  } catch (e) {
    handleError(e, "Der Server konnte nicht restored werden");
  }
}

async function ok() {
  await restoreServer();
  onDialogOK();
}
</script>

<style scoped></style>
