<template>
  <q-page>
    <page-title />
    <div class="row justify-between items-center">
      <q-breadcrumbs class="q-mb-sm">
        <q-breadcrumbs-el
          class="cursor-pointer"
          :label="t('userserver.server')"
          @click="gotoFile('')"
        />
        <q-breadcrumbs-el
          v-for="i in paths"
          :key="i.path"
          class="cursor-pointer"
          :label="i.name"
          @click="gotoFile(i.path)"
        />
      </q-breadcrumbs>

      <div class="row">
        <q-btn
          v-if="selectedFiles.length > 0"
          icon="las la-trash"
          unelevated
          round
          @click="deleteSelectedFiles"
        />

        <q-separator
          v-if="selectedFiles.length > 0"
          inset
          vertical
          class="mypvp-separator"
        />

        <q-btn
          icon="las la-file-medical"
          unelevated
          round
          @click="handleFileCreation"
        >
          <q-tooltip> {{ t("userserver.files.new-file") }}</q-tooltip>
        </q-btn>
        <q-btn
          icon="las la-folder-plus"
          unelevated
          round
          @click="handleFolderCreation"
        >
          <q-tooltip>
            {{ t("userserver.files.new-folder") }}
          </q-tooltip>
        </q-btn>
        <q-btn icon="las la-file-upload" unelevated round @click="handleUpload">
          <q-tooltip>
            {{ t("userserver.files.upload-file") }}
          </q-tooltip>
        </q-btn>
        <q-btn
          icon="las la-sync"
          unelevated
          round
          @click="handleFilesLoad(path)"
        >
          <q-tooltip>
            {{ t("userserver.files.reload-files") }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <server-file-list
      v-model:selected-files="selectedFiles"
      :loading="isLoading"
    />
  </q-page>
</template>

<script lang="ts" setup>
import ServerFileList from "../../components/server-files/ServerFileList.vue";
import ServerFilesUploadFilesDialog from "components/server-files/ServerFilesUploadFilesDialog.vue";
import ServerFileCreationDialog from "components/server-files/ServerFileCreationDialog.vue";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useFileStore } from "src/stores/fileStore";
import { useServerStore } from "src/stores/serverStore";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useErrorHandler } from "src/utils/error-handler";
import { useLayoutStore } from "stores/layoutStore";
import PageTitle from "components/layout/PageTitle.vue";
import { ReturnFileDto } from "@mypvp/userserver-api-client-browser";

const router = useRouter();
const fileStore = useFileStore();
const serverStore = useServerStore();
const layoutStore = useLayoutStore();
const quasar = useQuasar();
const i18n = useI18n();
const { handleError } = useErrorHandler();
const { t } = useI18n();

const serverId = computed(() => serverStore.server?.id);
const path = computed(() => fileStore.path);
const isLoading = ref(true);
const selectedFiles = ref<ReturnFileDto[]>([]);

onBeforeRouteUpdate((to, from, next) => {
  handleFilesLoad((to.query.path as string | null) ?? "/").catch(handleError);
  next();
});

onMounted(() => {
  layoutStore.pageTitle = "userserver.files.title";
});

onMounted(() => {
  handleFilesLoad(
    (router.currentRoute.value.query.path as string | null) ?? "/"
  ).catch(handleError);
});

const paths = computed(() => {
  const paths = path.value.split("/");

  const returnPaths = [];

  for (let i = 0; i < paths.length; i++) {
    if (paths[i] !== "")
      returnPaths.push({
        name: paths[i],
        path: paths.slice(0, i + 1).join("/"),
      });
  }

  return returnPaths;
});

async function gotoFile(path: string) {
  await router.push({
    name: "ServerFiles",
    query: {
      path,
    },
  });
}

async function handleFilesLoad(path: string) {
  isLoading.value = true;
  try {
    await fileStore.loadFiles(path);
  } catch (e) {
    handleError(e, i18n.t("userserver.files.error.load-files"));
  } finally {
    isLoading.value = false;
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

function deleteSelectedFiles() {
  quasar
    .dialog({
      title: t("userserver.files.delete-files-dialog.title", {
        count: selectedFiles.value.length,
      }),
      message: t("userserver.files.delete-files-dialog.message"),
      cancel: t("cancel"),
      ok: t("userserver.files.delete"),
    })
    .onOk(() => {
      Promise.all(
        selectedFiles.value.map((value) =>
          value.type === "FILE"
            ? fileStore.deleteFile(value.path)
            : fileStore.deleteFolder(value.path)
        )
      )
        .then(() => {
          quasar.notify({
            color: "positive",
            message: t("userserver.files.delete-files-dialog.success"),
          });
        })
        .catch(handleError);
    });
}

function handleUpload() {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ServerFilesUploadFilesDialog,
    componentProps: {
      serverId: serverId.value,
    },
  });
}
</script>

<style scoped></style>
