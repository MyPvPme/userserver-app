<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="q-dialog__title">{{
        t("userserver.extensions.create-extension-file")
      }}</q-card-section>

      <q-card-section>
        <q-input v-model="name" :label="t('userserver.files.file-name')" />
        <q-input v-model="path" :label="t('userserver.files.path')" />
        <q-file v-model="file" :label="t('userserver.files.file')" />
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" :label="t('create')" @click="onOKClick" />
        <q-btn color="primary" :label="t('cancel')" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import {
  HttpFile,
  ServerExtensionsApi,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  extensionId: number;
  extensionVersionId: number;
  fileNameSuggestion: string;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const $q = useQuasar();
const { t } = useI18n();

const path = ref<string | null>("plugins/");
const file = ref<HttpFile | null>(null);
const name = ref<string | null>(props.fileNameSuggestion);

const api = new ServerExtensionsApi(apiConfig);

async function onOKClick() {
  if (!file.value || !path.value || !name.value) return;

  try {
    $q.loading.show();

    await api.createServerExtensionFile(
      props.extensionVersionId,
      props.extensionId,
      undefined,
      file.value,
      path.value,
      name.value
    );
  } finally {
    $q.loading.hide();
  }

  onDialogOK();
}
</script>
