<template>
  <q-tr
    :class="{
      'cursor-pointer':
        props.row.isEditable ||
        props.row.type === 'FOLDER' ||
        props.row.name.endsWith('.gz'),
    }"
    :props="props"
    @click="openFile()"
  >
    <q-td>
      <q-checkbox :model-value="props.selected" dense @click="emit('select')" />
    </q-td>
    <server-file-menu :file="props.row" />
    <q-td>
      <q-icon size="25px" :name="getIcon()" />
    </q-td>
    <q-td key="name" :props="props">
      {{ props.row.name }}
    </q-td>
    <q-td key="size" :props="props">
      {{ getFormattedSize(props.row.size) }}
    </q-td>
    <q-td key="created" :props="props">
      {{ getFormattedDate(props.row.created) }}
    </q-td>
    <q-td key="changed" :props="props">
      {{ getFormattedDate(props.row.changed) }}
    </q-td>
  </q-tr>
</template>

<script lang="ts" setup>
import { format, useQuasar } from "quasar";
import { date } from "quasar";
import ServerFileMenu from "./ServerFileMenu.vue";
import { ReturnFileDto } from "@mypvp/userserver-api-client-browser";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useFileStore } from "src/stores/fileStore";

const { formatDate } = date;
const { humanStorageSize } = format;

const componentProps = defineProps<{
  props: {
    selected: boolean;
    row: ReturnFileDto;
  };
}>();

const emit = defineEmits(["select"]);

const quasar = useQuasar();
const i18n = useI18n();
const router = useRouter();
const fileStore = useFileStore();

const path = computed(() => fileStore.path);

function getIcon(): string {
  return componentProps.props.row.type === "FILE"
    ? "las la-file"
    : "las la-folder";
}

function getFormattedSize(size: number | undefined) {
  if (size === undefined) return "";
  return humanStorageSize(size);
}
function getFormattedDate(date: Date) {
  return formatDate(date, "DD.MM.YYYY HH:mm");
}
async function openFile() {
  if (componentProps.props.row.type === "FOLDER") {
    try {
      await router.push({
        name: "ServerFiles",
        query: { path: path.value + "/" + componentProps.props.row.name },
      });
    } catch (e) {
      quasar.notify({
        message: i18n.t("userserver.files.error.load-files").toString(),
        color: "negative",
      });
    }
  } else if (
    componentProps.props.row.isEditable ||
    componentProps.props.row.name.endsWith(".gz")
  ) {
    await router.push({
      name: "FileEditor",
      query: { path: path.value + "/" + componentProps.props.row.name },
    });
  }
}
</script>

<style scoped></style>
