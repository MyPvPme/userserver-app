<template>
  <q-page>
    <div class="row justify-between">
      <h4 class="q-pb-sm">{{ t("extensions") }}</h4>

      <q-btn
        icon="las la-plus"
        flat
        color="positive"
        @click="createExtension"
      />
    </div>
    <q-table
      :loading="!extensions"
      :columns="columns"
      :rows="extensions"
      flat
      square
      bordered
    >
      <template #header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              round
              flat
              dense
              :icon="props.expand ? 'las la-angle-up' : 'las la-angle-down'"
              @click="props.expand = !props.expand"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <q-list separator>
              <q-item
                v-for="extensionVersion in props.row.extensionVersions"
                :key="extensionVersion.id"
                class="justify-around"
              >
                <q-item-section>
                  {{ extensionVersion.version }}
                </q-item-section>
                <q-item-section>
                  <div class="row justify-end">
                    <q-btn
                      icon="las la-file-upload"
                      flat
                      @click="
                        createExtensionFile(
                          props.row.id,
                          extensionVersion.id,
                          extensionVersion,
                          props.row
                        )
                      "
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { QTable, useQuasar } from "quasar";
import ExtensionFileFormDialog from "components/extensions/ExtensionFileFormDialog.vue";
import ExtensionFormDialog from "components/extensions/ExtensionFormDialog.vue";
import {
  ServerExtension,
  ServerExtensionVersion,
} from "@mypvp/userserver-api-client-browser";
import { useAdminStore } from "src/stores/adminStore";
import { useErrorHandler } from "src/utils/error-handler";
import { useI18n } from "vue-i18n";

const quasar = useQuasar();
const adminStore = useAdminStore();
const { handleError } = useErrorHandler();
const { t } = useI18n();

const columns: QTable["columns"] = [
  {
    name: "id",
    label: "ID",
    field: "id",
    align: "left",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
  },
  {
    name: "isPublic",
    label: "isPublic",
    field: (row: ServerExtension) => row.isPublic,
    align: "left",
  },
];

const extensions = computed(() => adminStore.extensions);

if (!extensions.value) {
  adminStore.loadExtensions().catch(handleError);
}

function createExtensionFile(
  extensionId: number,
  extensionVersionId: number,
  extensionVersion: ServerExtensionVersion,
  extension: ServerExtension
) {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ExtensionFileFormDialog,
    componentProps: {
      extensionId,
      extensionVersionId,
      fileNameSuggestion:
        extension.name + "-" + extensionVersion.version + ".jar",
    },
  });
}

function createExtension() {
  quasar.dialog({
    component: ExtensionFormDialog,
  });
}
</script>

<style scoped></style>
