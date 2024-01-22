<template>
  <q-form @submit="onOKClick">
    <q-dialog ref="dialogRef" @hide="onDialogHide">
      <q-card class="q-dialog-plugin">
        <q-card-section class="q-dialog__title"
          >{{ getTitle() }}
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="fileName"
            :rules="[
              (val) =>
                !val.includes('..') ||
                t('userserver.files.error.file-includes-double-point'),
              (val) =>
                !val.includes('/') ||
                t('userserver.files.error.file-includes-slash'),
              (val) =>
                !files.some((file) => file.name === val) ||
                t('userserver.files.error.file-already-exists'),
              checkFileExtensions,
            ]"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            :label="getOkButtonText()"
            type="submit"
            unelevated
          />
          <q-btn
            color="primary"
            :label="t('cancel')"
            unelevated
            @click="onDialogCancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useFileStore } from "src/stores/fileStore";
import { ReturnFileDto } from "@mypvp/userserver-api-client-browser";
import { useI18n } from "vue-i18n";
import { useDialogPluginComponent, useQuasar } from "quasar";

const props = defineProps<{
  type: string;
  action: string;
  target?: ReturnFileDto;
}>();
defineEmits([...useDialogPluginComponent.emits]);

const fileStore = useFileStore();
const i18n = useI18n();
const quasar = useQuasar();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const { t } = useI18n();

const fileName = ref<string>("");
const files = computed(() => fileStore.files);
const path = computed(() => fileStore.path);
const allowedExtensions = computed(() => fileStore.getAllowedFilesToCreate());

onMounted(() => {
  if (props.action === "RENAME" && props.target) {
    fileName.value = props.target.name;
  }
});

function getTitle() {
  if (props.action == "CREATE") {
    if (props.type == "FOLDER") {
      return i18n.t("userserver.files.new-folder");
    } else {
      return i18n.t("userserver.files.new-file");
    }
  } else {
    if (props.type == "FOLDER") {
      return i18n.t("userserver.files.rename-folder");
    } else {
      return i18n.t("userserver.files.rename-file");
    }
  }
}

function getOkButtonText() {
  switch (props.action) {
    case "CREATE":
      return i18n.t("userserver.files.create");
    case "RENAME":
      return i18n.t("userserver.files.rename");
  }
}

function checkFileExtensions(value: string) {
  if (props.type !== "FILE") {
    return true;
  }

  if (allowedExtensions.value.includes("*")) {
    return true;
  }

  for (const fileExtension of allowedExtensions.value) {
    if (value.endsWith(fileExtension)) {
      return true;
    }
  }

  return i18n.t("userserver.files.error.file-extension-not-allowed", {
    allowedExtensions: allowedExtensions.value.join(", "),
  });
}

async function onOKClick() {
  switch (props.action) {
    case "CREATE":
      await handleActionCreate();
      break;
    case "RENAME":
      await handleActionRename();
      break;
  }
  onDialogOK();
}

async function handleActionCreate() {
  if (props.type == "FOLDER") {
    try {
      await fileStore.createFolder(path.value + "/" + fileName.value);
    } catch (e) {
      quasar.notify({
        message: i18n
          .t("userserver.server-files.error.create-folder")
          .toString(),
        color: "negative",
      });
    }
  } else if (props.type === "FILE") {
    try {
      await fileStore.createFile(path.value + "/" + fileName.value);
    } catch (e) {
      quasar.notify({
        message: i18n.t("userserver.server-files.error.create-file").toString(),
        color: "negative",
      });
    }
  }
}

async function handleActionRename() {
  if (props.type == "FOLDER" && props.target) {
    try {
      await fileStore.renameFolder(props.target.path, fileName.value);
    } catch (e) {
      quasar.notify({
        message: i18n
          .t("userserver.server-files.error.rename-folder")
          .toString(),
        color: "negative",
      });
    }
  } else if (props.type === "FILE" && props.target) {
    try {
      await fileStore.renameFile(props.target.path, fileName.value);
    } catch (e) {
      quasar.notify({
        message: i18n.t("userserver.server-files.error.rename-file").toString(),
        color: "negative",
      });
    }
  }
}
</script>

<style scoped></style>
