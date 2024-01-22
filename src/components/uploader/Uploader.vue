<template>
  <q-card>
    <q-card-section id="header" class="row">
      <div class="col">
        <h5>{{ t("userserver.files.upload-file") }}</h5>
      </div>
      <q-btn
        id="add-file"
        dense
        flat
        icon="las la-file-medical"
        class="mypvp-text-color"
      >
        <q-tooltip>
          {{ t("userserver.files.file", 1) }}
        </q-tooltip>
      </q-btn>
      <q-btn
        id="add-folder"
        dense
        flat
        icon="las la-folder-plus"
        class="mypvp-text-color"
      >
        <q-tooltip>
          {{ t("userserver.files.folder", 1) }}
        </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-separator />
    <q-card-section id="drop">
      <q-virtual-scroll
        id="file-list"
        :items="fileList"
        separator
        class="full-width"
      >
        <template #default="{ item, index }">
          <div :key="index">
            <q-item>
              <q-item-section avatar>
                <q-btn
                  icon="las la-times"
                  dense
                  flat
                  color="negative"
                  @click="uploader.removeFile(item)"
                />
              </q-item-section>
              <q-item-section avatar>
                <q-icon
                  :name="
                    item.error ? 'las la-exclamation-triangle' : 'las la-file'
                  "
                  :color="item.error ? 'negative' : undefined"
                />
              </q-item-section>
              <q-item-label class="self-center">
                {{ item.name }}
              </q-item-label>
              <q-space />
              <q-item-section side>
                {{ format.humanStorageSize(item.size || 0) }}
              </q-item-section>
            </q-item>
            <q-linear-progress
              :value="item._prevUploadedSize"
              class="q-mt-sm progress"
              :color="item.error ? 'negative' : undefined"
            />
          </div>
        </template>
      </q-virtual-scroll>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import Uploader from "simple-uploader.js";
import { format, useQuasar } from "quasar";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["complete"]);

const props = withDefaults(
  defineProps<{
    allowedAttributes: string[];
    url: string;
    relativePath: string;
    disableDirectory: boolean;
    dataTransfer?: DataTransfer;
  }>(),
  {
    allowedAttributes: () => [""],
    dataTransfer: undefined,
  }
);

const quasar = useQuasar();
const { t } = useI18n();

const fileList = ref<{ name: string; size: number }[]>([]);
const uploader = ref<Uploader | undefined>();
const supportDirectory = ref<boolean>(false);

watch(
  () => uploader.value?.files,
  () => {
    if (uploader.value?.fileList) {
      fileList.value = uploader.value.fileList;
    }
  }
);

onMounted(() => {
  const instanceId = Math.round(Math.random() * 1000).toString(16);

  uploader.value = new Uploader({
    target: props.url,
    testChunks: false,
    withCredentials: true,
    chunkSize: 1024 * 1024 * 20,
    forceChunkSize: true,
    generateUniqueIdentifier: (file) => {
      const relativePath =
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        file.relativePath ??
        file.webkitRelativePath ??
        file.fileName ??
        file.name;

      return `${instanceId}${relativePath.replace(/[^0-9A-Z-]/gim, "")}`;
    },
    headers: {
      Authorization: `Bearer ${
        quasar.localStorage.getItem<string>("api_key") ??
        quasar.localStorage.getItem<string>("oauth_access_token") ??
        ""
      }`,
    },
    initFileFn: (file) => {
      file.relativePath = props.relativePath + "/" + file.relativePath;
    },
  });

  const dropElement = document.getElementById("drop");

  if (dropElement) {
    uploader.value.assignDrop(dropElement);
  }

  uploader.value.on("fileSuccess", (rootFile, file: File) => {
    uploader.value?.removeFile(file);
  });
  uploader.value.on("complete", () => {
    emit("complete");
  });
  uploader.value.on("filesSubmitted", () => {
    upload();
  });
  supportDirectory.value =
    uploader.value.supportDirectory && !props.disableDirectory;
  if (props.dataTransfer) {
    if (props.dataTransfer.items[0].webkitGetAsEntry()) {
      uploader.value.webkitReadDataTransfer(props.dataTransfer);
    } else {
      uploader.value.addFiles(props.dataTransfer.files);
    }
  }

  setButtons();
});

function upload() {
  if (!uploader.value) return;
  uploader.value.upload();
}

function setButtons() {
  if (!uploader.value) return;

  const addFile = document.getElementById("add-file");
  const addFolder = document.getElementById("add-folder");

  if (!addFile || !addFolder) {
    return;
  }

  uploader.value.assignBrowse(addFile, false, false, {
    accept: props.allowedAttributes.join(", "),
  });
  if (supportDirectory.value) {
    uploader.value.assignBrowse(addFolder, true, false);
  }
}
</script>

<style scoped lang="scss">
.body--dark #header {
  background-color: $dark;
}
#drop {
  min-height: 80px;
  margin: 0 !important;
  padding: 0;
}
.body--dark #drop {
  background-color: $dark-page;
}
#drop:drop {
  border: 1px dashed black;
}
#file-list {
  max-height: 100px;
  margin: 0 !important;
}
.file-item {
  border: #1f1f1f;
  height: 45px;
  width: 100px;
}
.progress {
}
</style>
