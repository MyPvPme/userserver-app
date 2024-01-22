<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <uploader
        :url="uploadUrl.replace('__server_id__', serverId)"
        :relative-path="path"
        :allowed-attributes="allowedFileExtensions"
        :disable-directory="
          !hasPermission(ownerPermissions, 'userserver.panel.folder')
        "
        :data-transfer="dataTransfer"
        @complete="reloadFiles"
      />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import Uploader from "../uploader/Uploader.vue";
import { useDialogPluginComponent, useQuasar } from "quasar";
import { computed } from "vue";
import { useConfigStore } from "src/stores/configStore";
import { useFileStore } from "src/stores/fileStore";
import { useI18n } from "vue-i18n";
import { useHasePermission } from "src/mixins/has-permission";
import { useServerStore } from "src/stores/serverStore";

defineProps<{
  serverId: string;
  dataTransfer?: DataTransfer;
}>();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const quasar = useQuasar();
const i18n = useI18n();
const { hasPermission } = useHasePermission();
const configStore = useConfigStore();
const fileStore = useFileStore();
const serverStore = useServerStore();

const uploadUrl = configStore.getConfig().API_UPLOAD_URL;

const path = computed(() => fileStore.path);
const ownerPermissions = computed(() => serverStore.server?.owner.permissions);
const allowedFilesToCreate = computed(() =>
  fileStore.getAllowedFilesToCreate()
);

const allowedFileExtensions = computed(() => {
  if (allowedFilesToCreate.value.includes("*")) {
    return ["*.*"];
  }
  return allowedFilesToCreate.value;
});

async function reloadFiles() {
  try {
    await fileStore.loadFiles(path.value);
  } catch (e) {
    quasar.notify({
      message: i18n.t("userserver.files.error.load-files").toString(),
      color: "negative",
    });
  } finally {
    onDialogOK();
  }
}
</script>

<style scoped></style>
