<template>
  <div id="file-list">
    <q-table
      v-model:selected="selectedFiles"
      v-model:pagination="pagination"
      :rows="files"
      :columns="columns"
      :sort-method="sort"
      :binary-state-sort="true"
      row-key="path"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      flat
      :loading="loading"
      @update:pagination="setPagination"
      @drop="dropUpload"
      @dragover="dragOver"
    >
      <template #header="props">
        <q-tr :props="props">
          <q-th id="table-select" auto-width>
            <q-checkbox v-model="props.selected" dense />
          </q-th>
          <q-th id="table-icon-header" />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-if="path && path !== '/'" #top-row>
        <q-tr class="cursor-pointer" @click="goBack">
          <server-file-menu />
          <q-td>
            <q-icon
              size="25px"
              name="las la-level-up-alt"
              class="icon-flipped"
            />
          </q-td>
          <q-td> ..</q-td>
          <q-td />
          <q-td />
          <q-td />
        </q-tr>
      </template>
      <template #body="props">
        <server-file
          :props="props"
          @select="props.selected = !props.selected"
        />

        <div id="drop-message" class="text-center absolute-center z-max">
          <q-icon name="las la-file" size="3em" />
          <br />
          {{ t("userserver.files.drop-file") }}
        </div>
      </template>
      <template #no-data>
        <q-item class="full-width">
          <server-file-menu />
          <q-item-section avatar>
            <q-icon name="las la-exclamation-triangle" />
          </q-item-section>
          <q-item-section>
            {{ t("userserver.files.no-files") }}
          </q-item-section>
        </q-item>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts" setup>
import ServerFilesUploadFilesDialog from "components/server-files/ServerFilesUploadFilesDialog.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { QTable, useQuasar } from "quasar";
import { useFileStore } from "src/stores/fileStore";
import { useServerStore } from "src/stores/serverStore";
import { useRouter } from "vue-router";
import { ReturnFileDto } from "@mypvp/userserver-api-client-browser";
import ServerFileMenu from "components/server-files/ServerFileMenu.vue";
import ServerFile from "components/server-files/ServerFile.vue";

const componentProps = withDefaults(
  defineProps<{
    loading: boolean;
    selectedFiles: ReturnFileDto[];
  }>(),
  { loading: false }
);

const emit = defineEmits(["update:selectedFiles"]);

const { t } = useI18n();
const quasar = useQuasar();
const fileStore = useFileStore();
const serverStore = useServerStore();
const router = useRouter();

const selectedFiles = computed({
  set: (files) => emit("update:selectedFiles", files),
  get: () => componentProps.selectedFiles,
});
const pagination = ref<NonNullable<QTable["pagination"]>>({
  sortBy:
    quasar.localStorage.getItem<string>("server-files-table-sort-by") ?? "name",
  rowsPerPage:
    quasar.localStorage.getItem<number>("server-files-table-rows-per-page") ??
    10,
  descending:
    quasar.localStorage.getItem<boolean>("server-files-table-descending") ??
    undefined,
});

const columns: NonNullable<QTable["columns"]> = [
  {
    name: "name",
    label: t("userserver.files.file-name"),
    sortable: true,
    field: "name",
    align: "left",
  },
  {
    name: "size",
    label: t("userserver.files.file-size"),
    sortable: true,
    field: "size",
    align: "right",
  },
  {
    name: "created",
    label: t("userserver.files.file-created"),
    sortable: true,
    field: "created",
    align: "right",
  },
  {
    name: "changed",
    label: t("userserver.files.file-changed"),
    sortable: true,
    field: "changed",
    align: "right",
  },
];

function setPagination() {
  quasar.localStorage.set(
    "server-files-table-sort-by",
    pagination.value.sortBy
  );
  quasar.localStorage.set(
    "server-files-table-rows-per-page",
    pagination.value.rowsPerPage
  );
  quasar.localStorage.set(
    "server-files-table-descending",
    pagination.value.descending
  );
}

onMounted(() => {
  loadTableSettings();
  document.addEventListener("dragover", addDragClass);
  document.addEventListener("dragleave", removeDragClass);
});

onUnmounted(() => {
  document.removeEventListener("dragover", addDragClass);
  document.removeEventListener("dragleave", removeDragClass);
});

const files = computed(() => fileStore.files);
const path = computed(() => fileStore.path);
const serverId = computed(() => serverStore.server?.id);

async function goBack() {
  await router.push({
    name: "ServerFiles",
    query: {
      path: path.value.split("/").slice(0, -1).join("/"),
    },
  });
}

function dropUpload(event: DragEvent) {
  event.preventDefault();
  removeDragClass();

  const files = [];

  if (!event.dataTransfer) return;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < event.dataTransfer.items.length; i++) {
    if (event.dataTransfer.items[i].kind === "file") {
      files.push(event.dataTransfer.items[i].getAsFile());
    }
  }

  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ServerFilesUploadFilesDialog,
    componentProps: {
      serverId: serverId.value,
      dataTransfer: event.dataTransfer,
    },
  });
}

function dragOver(event: DragEvent) {
  event.preventDefault();
}

function addDragClass(event: DragEvent) {
  if (!event.dataTransfer?.items) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < event.dataTransfer.items.length; i++) {
    // If dropped items aren't files, reject them
    if (event.dataTransfer.items[i].kind !== "file") {
      return;
    }
  }

  document.getElementById("file-list")?.classList.add("drag");
}

function removeDragClass(event?: DragEvent) {
  if (event && event.clientY !== 0 && event.clientX !== 0) return;
  document.getElementById("file-list")?.classList.remove("drag");
}

function loadTableSettings() {
  pagination.value.sortBy =
    quasar.localStorage.getItem<string>("server-files-table-sort-by") ?? "name";
  pagination.value.rowsPerPage =
    quasar.localStorage.getItem<number>("server-files-table-rows-per-page") ??
    5;
  pagination.value.descending =
    quasar.localStorage.getItem<boolean>("server-files-table-descending") ??
    false;
}

function getSelectedString(): string {
  return selectedFiles.value.length === 0
    ? ""
    : `${selectedFiles.value.length} ${
        selectedFiles.value.length === 1
          ? t("userserver.files.file", 1)
          : t("userserver.files.file", 2)
      } ${t("selected")}`;
}

function isDate(v: unknown) {
  return Object.prototype.toString.call(v) === "[object Date]";
}

function isNumber(v: unknown): v is number {
  return typeof v === "number" && isFinite(v);
}

function sort(
  data: ReturnFileDto[],
  sortBy: string,
  descending: boolean
): ReturnFileDto[] {
  const col = columns.find((def) => def.name === sortBy);
  if (col === void 0) {
    return data;
  }

  const dir = descending ? -1 : 1;

  const val =
    col.field instanceof Function
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
        (val: any) => (col.field as (any: any) => any)(val)
      : // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
        (val: Record<string, any>) => val[col.field as string];

  return data.sort((a, b) => {
    if (a.type === "FOLDER" && b.type === "FILE") {
      return -1;
    }

    if (a.type === "FILE" && b.type === "FOLDER") {
      return 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let A = val(a);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let B = val(b);

    if (A === null || A === void 0) {
      return -1 * dir;
    }
    if (B === null || B === void 0) {
      return 1 * dir;
    }
    if (col.sort !== void 0) {
      return col.sort(A, B, a, b) * dir;
    }
    if (isNumber(A) && isNumber(B)) {
      return (A - B) * dir;
    }
    if (isDate(A) && isDate(B)) {
      return A - B * dir;
    }

    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    [A, B] = [A, B].map((s) => (s + "").toLocaleString().toLowerCase());

    return A < B ? -1 * dir : A === B ? 0 : dir;
  });
}
</script>

<style scoped>
#table-icon-header {
  width: 25px;
}

.icon-flipped {
  transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -ms-transform: scaleX(-1);
}

.drag div:is(:first-child) {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='black' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='21' stroke-linecap='square'/%3e%3c/svg%3e");
}

.drag div:is(:first-child):after {
  position: absolute;
  content: "";
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  margin-left: 1px;
  margin-top: 1px;
  backdrop-filter: blur(5px);
}

.drag #drop-message {
  display: block;
  filter: none;
}

#drop-message {
  display: none;
}
</style>
