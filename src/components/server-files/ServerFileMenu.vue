<template>
  <q-menu ref="menu" touch-position context-menu>
    <q-list dense separator>
      <q-item v-if="getType() !== 'none'" clickable @click="deleteFileDialog">
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-trash" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.delete") }}</a>
        </q-item-section>
      </q-item>

      <q-item
        v-if="getType() === 'FILE' && file.isEditable"
        clickable
        @click="handleEdit"
      >
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-edit" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.edit") }}</a>
        </q-item-section>
      </q-item>

      <q-item v-if="getType() === 'FILE'" clickable @click="handleFileRename">
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-pen" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.rename") }}</a>
        </q-item-section>
      </q-item>

      <q-item
        v-if="getType() === 'FOLDER'"
        clickable
        @click="handleFolderRename"
      >
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-pen" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.rename") }}</a>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        @click="
          getType() === 'FILE' ? handleDownload() : handleFolderDownload()
        "
      >
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-download" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.download") }}</a>
        </q-item-section>
      </q-item>

      <q-item clickable @click="handleCopyFilename">
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-clipboard" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.copy-filename") }}</a>
        </q-item-section>
      </q-item>

      <q-item clickable @click="handleFolderCreation">
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-folder-plus" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.create-folder") }}</a>
        </q-item-section>
      </q-item>

      <q-item clickable @click="handleFileCreation">
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-file-medical" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.create-file") }}</a>
        </q-item-section>
      </q-item>

      <q-item clickable @click="handleUpload">
        <q-item-section avatar class="q-pr-none" style="min-width: 32px">
          <q-icon class="col-auto" size="24" name="las la-file-upload" />
        </q-item-section>
        <q-item-section>
          <a class="col-auto">{{ t("userserver.files.upload-file") }}</a>
        </q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script lang="ts" setup>
import { HttpFile, ReturnFileDto } from "@mypvp/userserver-api-client-browser";
import { useFileStore } from "src/stores/fileStore";
import { useServerStore } from "src/stores/serverStore";
import { computed, ref } from "vue";
import { copyToClipboard, QMenu, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import ServerFileCreationDialog from "components/server-files/ServerFileCreationDialog.vue";
import { saveAs } from "file-saver";
import ServerFilesUploadFilesDialog from "components/server-files/ServerFilesUploadFilesDialog.vue";
import { useRouter } from "vue-router";
import { useErrorHandler } from "src/utils/error-handler";

const props = defineProps<{
  file?: ReturnFileDto;
}>();

const quasar = useQuasar();
const { t } = useI18n();
const router = useRouter();
const fileStore = useFileStore();
const serverStore = useServerStore();
const { handleError } = useErrorHandler();

const serverId = computed(() => serverStore.server?.id);
const path = computed(() => fileStore.path);
const menu = ref<QMenu>();

function getType() {
  if (props.file === undefined) return "none";
  return props.file.type;
}

async function handleDelete() {
  if (props.file?.type === "FILE") {
    await deleteFile(props.file);
  } else if (props.file?.type === "FOLDER") {
    await deleteFolder(props.file);
  }
}

async function deleteFolder(file: ReturnFileDto) {
  quasar.loading.show();
  try {
    await fileStore.deleteFolder(file.path);
  } catch (e) {
    quasar.notify({
      message: t("server-files.error.delete-folder").toString(),
      color: "negative",
    });
  } finally {
    quasar.loading.hide();
  }
}

function deleteFileDialog(file: ReturnFileDto) {
  menu.value?.hide();
  quasar
    .dialog({
      title: t(
        `userserver.files.delete-file-dialog.title-${file.type.toLowerCase()}`,
        { name: props.file?.name }
      ).toString(),
      ok: { label: t("yes"), color: "positive", unelevated: true },
      cancel: { label: t("no"), color: "negative", unelevated: true },
    })
    .onOk(() => {
      handleDelete().catch((e) => handleError(e));
    });
}

async function deleteFile(file: ReturnFileDto) {
  quasar.loading.show();
  try {
    await fileStore.deleteFile(file.path);
  } catch (e) {
    quasar.notify({
      message: t("server-files.error.delete-file").toString(),
      color: "negative",
    });
  } finally {
    quasar.loading.hide();
  }
}

function handleFolderCreation() {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ServerFileCreationDialog,
    componentProps: {
      type: "FOLDER",
      action: "CREATE",
    },
  });
}

function handleFileCreation() {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ServerFileCreationDialog,
    componentProps: {
      type: "FILE",
      action: "CREATE",
    },
  });
}

function handleFileRename() {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ServerFileCreationDialog,
    componentProps: {
      type: "FILE",
      action: "RENAME",
      target: props.file,
    },
  });
}

function handleFolderRename() {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ServerFileCreationDialog,
    componentProps: {
      type: "FOLDER",
      action: "RENAME",
      target: props.file,
    },
  });
}

async function handleFolderDownload() {
  if (!props.file) return;

  quasar.loading.show();

  let data: HttpFile;

  try {
    data = await fileStore.getFolder(props.file.path);
    saveAs(data, props.file.name);
  } catch (e) {
    console.error(e);
    quasar.notify({
      message: t("server-files.error.get-file").toString(),
      color: "negative",
    });
  } finally {
    menu.value?.hide();
    quasar.loading.hide();
  }
}

async function handleDownload() {
  if (!props.file) return;

  quasar.loading.show();

  try {
    saveAs(await fileStore.getFile(props.file.path), props.file.name);
  } catch (e) {
    quasar.notify({
      message: t("server-files.error.get-file").toString(),
      color: "negative",
    });
  } finally {
    menu.value?.hide();
    quasar.loading.hide();
  }
}

function handleUpload() {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ServerFilesUploadFilesDialog,
    componentProps: { serverId: serverId.value },
  });
}

async function handleCopyFilename(file: ReturnFileDto) {
  try {
    await copyToClipboard(file.name);
  } catch (e) {
    quasar.notify({
      color: "Negative",
      message: t("filename-could-not-be-copied").toString(),
    });
  } finally {
    menu.value?.hide();
  }
}

async function handleEdit(file: ReturnFileDto) {
  await router.push({
    name: "FileEditor",
    query: { path: path.value + "/" + file.name },
  });
}
</script>

<style scoped></style>
