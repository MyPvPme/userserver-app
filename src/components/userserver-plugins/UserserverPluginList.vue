<template>
  <div class="row q-col-gutter-md">
    <div class="col-xs-12 col-md-2">
      <q-tabs
        id="nav"
        v-model="currentTab"
        vertical
        active-color="primary"
        indicator-color="transparent"
      >
        <q-card class="q-mb-md" flat>
          <q-tab
            name="installed"
            icon="las la-download"
            :label="t('userserver.extensions.installed')"
            no-caps
          />
        </q-card>

        <q-card flat>
          <q-tab name="all" icon="las la-box" :label="t('all')" no-caps />
          <!--Categories -->
          <q-tab
            v-for="category in allCategories"
            :key="category"
            :name="category"
            :label="t('userserver.extensions.types.' + category.toLowerCase())"
            :icon="categoryIcons[category]"
            no-caps
          >
          </q-tab>
        </q-card>
      </q-tabs>
    </div>

    <div class="col-xs-12 col-md">
      <div
        v-if="isLoadingPlugins"
        class="full-height column justify-center items-center"
        style="min-height: 100%"
      >
        <q-spinner color="primary" size="3em" />
      </div>

      <div v-else id="extension-gallery">
        <q-table
          v-model:pagination="pagination"
          :columns="tableRows"
          :rows="filteredExtensions(currentTab)"
          :filter="filter"
          flat
          row-key="fileName"
          @update:pagination="setPagination"
        >
          <template #top-right>
            <q-input v-model="filter" dense placeholder="Search">
              <template #append>
                <q-icon name="las la-search" />
              </template>
            </q-input>
          </template>

          <template #header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
              <q-th auto-width />
            </q-tr>
          </template>

          <template #body="props">
            <q-tr>
              <q-td>
                <rank-patch
                  v-if="
                    props.row?.serverExtension &&
                    props.row?.serverExtension?.permission !==
                      'userserver.default'
                  "
                  :rank-from-permission="props.row?.serverExtension?.permission"
                />
              </q-td>
              <q-td>
                <q-img
                  v-if="props.row?.serverExtension"
                  height="32px"
                  width="32px"
                  :src="
                    'https://cdn.mypvp.me/minecraft-items/' +
                    props.row?.serverExtension.menuItem.toLowerCase() +
                    '.png'
                  "
                  :alt="props.row?.serverExtension.menuItem"
                >
                  <template #error>
                    <q-img
                      height="32px"
                      width="32px"
                      style="background: transparent"
                      :src="'https://cdn.mypvp.me/minecraft-items/chain_command_block.png'"
                    />
                  </template>
                </q-img>
              </q-td>
              <q-td key="name" :props="props">
                {{ props.row?.serverExtension?.name || props.row?.name }}
              </q-td>
              <q-td key="version" :props="props">
                {{ props.row.version }}
              </q-td>
              <q-td>
                <q-btn
                  v-if="
                    installedExtensions?.find(
                      (plugin) => plugin.extensionVersionId === props.row.id
                    )
                  "
                  flat
                  icon="las la-trash"
                  color="negative"
                  :loading="
                    uninstallingExtensions.includes(
                      props.row.id || props.row.fileName
                    )
                  "
                  @click="
                    removeExtensionVersion(props.row.id || props.row.fileName)
                  "
                />

                <q-btn
                  v-else
                  flat
                  icon="las la-download"
                  color="positive"
                  :disable="
                    hasPermission(props.row?.serverExtension?.permission)
                  "
                  :loading="installingExtensions.includes(props.row.id)"
                  @click="installExtensionVersion(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ServerExtensionsApi,
  ServerExtensionVersion,
  SpigotPlugin,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import RankPatch from "components/common/RankPatch.vue";

import { computed, onMounted, ref, watch } from "vue";
import { useServerStore } from "src/stores/serverStore";
import { QTab, QTable, useQuasar } from "quasar";
import { useErrorHandler } from "src/utils/error-handler";
import { useHasePermission } from "src/mixins/has-permission";
import { useFileStore } from "stores/fileStore";
import { useI18n } from "vue-i18n";

const quasar = useQuasar();
const { t } = useI18n();
const serverStore = useServerStore();
const fileStore = useFileStore();
const { handleError } = useErrorHandler();
const { hasPermission } = useHasePermission();

const server = computed(() => serverStore.server);
const installedExtensions = computed(() => serverStore.serverPlugins);
const isServerLoaded = computed(() => serverStore.isServerLoaded());
const filter = ref<string>("");
const pagination = ref<NonNullable<QTable["pagination"]>>({
  sortBy:
    quasar.localStorage.getItem<string>("plugin-list-table-sort-by") ?? "name",
  rowsPerPage:
    quasar.localStorage.getItem<number>("plugin-list-table-rows-per-page") ??
    10,
  descending:
    quasar.localStorage.getItem<boolean>("plugin-list-table-descending") ??
    undefined,
});
const currentTab = ref<string>("installed");
const isLoadingPlugins = ref<boolean>(false);
const allCategories = ref<string[]>([
  "SYSTEM",
  "WORLDEDITING",
  "SKRIPT",
  "MINI_GAME",
]);

const versions = ref<ServerExtensionVersion[]>([]);
const allVersions = ref<ServerExtensionVersion[]>([]);

const installingExtensions = ref<number[]>([]);
const uninstallingExtensions = ref<(number | string)[]>([]);
const tableRows: QTable["columns"] = [
  {
    name: "name",
    label: "Name",
    field: (row: ServerExtensionVersion) => row.serverExtension?.name,
    sortable: true,
    align: "left",
  },
  {
    name: "version",
    label: "Version",
    field: "version",
    align: "left",
  },
];
const categoryIcons = {
  SYSTEM: "las la-cogs",
  WORLDEDITING: "las la-tree",
  SKRIPT: "las la-code",
  MINI_GAME: "las la-gamepad",
};

watch(isServerLoaded, () => loadExtensionData());

onMounted(() => {
  if (isServerLoaded.value) {
    onServerLoaded();
  }
});

function onServerLoaded() {
  loadExtensionData()
    .then(() => {
      isLoadingPlugins.value = false;
    })
    .catch(handleError);
}

async function loadExtensionData() {
  if (!server.value) throw new Error("Sever is not loaded");

  versions.value = await new ServerExtensionsApi(apiConfig).getAllVersions(
    [server.value.versionName],
    true
  );

  allVersions.value = await new ServerExtensionsApi(apiConfig).getAllVersions(
    undefined,
    true
  );

  await serverStore.loadServerPlugins(server.value.id);
}

function filteredExtensions(
  tab: string
): (ServerExtensionVersion | SpigotPlugin)[] {
  if (tab === "installed") {
    if (!installedExtensions.value) return [];
    const extensionVersions: (ServerExtensionVersion | SpigotPlugin)[] =
      installedExtensions.value
        .map<ServerExtensionVersion | undefined>((plugin) =>
          allVersions.value.find(
            (version) => version.id === plugin.extensionVersionId
          )
        )
        .filter((plugin) => plugin) as ServerExtensionVersion[];

    extensionVersions.push(
      ...installedExtensions.value.filter((extension) => !extension.isInSystem)
    );

    return extensionVersions;
  }

  if (tab === "all") {
    return versions.value;
  }

  return versions.value.filter(
    (version: ServerExtensionVersion) =>
      version.serverExtension?.type === tab.toUpperCase()
  );
}

function installExtensionVersion(id: number) {
  if (!server.value) throw new Error("Sever is not loaded");

  installingExtensions.value.push(id);
  serverStore.installExtension(server.value.id, id).finally(() => {
    installingExtensions.value.splice(
      installingExtensions.value.indexOf(id),
      1
    );
  });
}

function removeExtensionVersion(id: number | string) {
  if (!server.value) throw new Error("Sever is not loaded");

  uninstallingExtensions.value.push(id);

  if (typeof id === "string") {
    fileStore.deleteFile(`plugins/${id}`).finally(() => {
      uninstallingExtensions.value.splice(
        uninstallingExtensions.value.indexOf(id),
        1
      );
    });
  } else {
    serverStore.deleteExtension(id, server.value.id).finally(() => {
      uninstallingExtensions.value.splice(
        uninstallingExtensions.value.indexOf(id),
        1
      );
    });
  }
}

function setPagination() {
  quasar.localStorage.set("plugin-list-table-sort-by", pagination.value.sortBy);
  quasar.localStorage.set(
    "plugin-list-table-rows-per-page",
    pagination.value.rowsPerPage
  );
  quasar.localStorage.set(
    "plugin-list-table-descending",
    pagination.value.descending
  );
}
</script>

<style scoped>
#nav .q-card .q-tab__indicator {
  display: none;
}
</style>
