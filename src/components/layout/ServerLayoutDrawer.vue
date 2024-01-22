<template>
  <q-drawer
    :model-value="!$q.screen.lt.md || drawer"
    show-if-above
    :mini="miniState"
    :width="220"
    :behavior="!$q.screen.lt.md ? 'desktop' : 'mobile'"
    elevated
    @update:model-value="(value) => (drawer = value)"
  >
    <div class="column justify-between fit">
      <q-list padding>
        <drawer-item
          v-for="item in items"
          :key="item.name"
          :item="item"
          :show-tooltip="miniState"
        />
      </q-list>

      <q-btn
        class="q-py-md"
        :icon="
          $q.screen.lt.md
            ? 'la la-angle-double-left'
            : miniState
            ? 'la la-angle-double-right'
            : 'la la-angle-double-left'
        "
        flat
        @click="toggleDrawer"
      />
    </div>
  </q-drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { getDefinitionsForServerVersion } from "src/config-json-definitions";
import { useServerStore } from "src/stores/serverStore";
import DrawerItem, { DrawerItemProp } from "components/layout/DrawerItem.vue";
import { Server } from "@mypvp/userserver-api-client-browser";
import { useLayoutStore } from "stores/layoutStore";
import { storeToRefs } from "pinia";
import PreviewBadge from "components/common/PreviewBadge.vue";

const i18n = useI18n();
const serverStore = useServerStore();
const layoutStore = useLayoutStore();

const settings = ref<DrawerItemProp[]>([]);
const items = ref<DrawerItemProp[]>([
  {
    icon: "las la-home",
    name: i18n.t("overview"),
    to: { name: "ServerOverview" },
  },
  {
    icon: "las la-cog",
    name: i18n.t("config"),
    to: { name: "ServerSettingsOverview" },
    serverPermission: "PLUGINS",
    children: settings.value,
    ableToView: (server: Server) =>
      !serverStore.archivedStatusList.includes(server.status),
  },
  {
    icon: "las la-users-cog",
    name: i18n.t("permissions"),
    serverPermission: "PERMISSIONS",
    to: { name: "ServerPermissions" },
    ableToView: (server: Server) =>
      !serverStore.archivedStatusList.includes(server.status),
  },
  {
    icon: "las la-chart-line",
    name: i18n.t("userserver.server-stats.stats"),
    to: { name: "ServerStats" },
    badge: PreviewBadge,
    preview: true,
    ableToView: (server: Server) =>
      !serverStore.archivedStatusList.includes(server.status),
  },
  {
    icon: "las la-terminal",
    name: i18n.t("console"),
    to: { name: "ServerConsole" },
    serverPermission: "TERMINAL",
    ableToView: (server: Server) =>
      server.status === "ONLINE" || server.status === "STARTING",
  },
  {
    icon: "las la-plug",
    name: i18n.t("userserver.plugins"),
    to: { name: "ServerPlugins" },
    serverPermission: "PLUGINS",
    ableToView: (server: Server) =>
      !serverStore.archivedStatusList.includes(server.status),
  },
  {
    icon: "las la-folder",
    name: i18n.t("userserver.files.file", 2),
    to: { name: "ServerFiles" },
    serverPermission: "FILES",
    ableToView: (server: Server) =>
      !serverStore.archivedStatusList.includes(server.status),
  },
]);
const miniState = ref(false);
const { drawer } = storeToRefs(layoutStore);

const setSettings = () => {
  if (!serverStore.server) {
    return;
  }

  const definitions = getDefinitionsForServerVersion(
    serverStore.server.versionName
  );
  settings.value = definitions.map((definition) => ({
    icon: "las la-file",
    name: definition.file,
    to: {
      name: "ServerSettings",
      params: {
        filename: definition.file,
        versionIndex: definition.definitionIndex,
      },
    },
  }));
};

watch(
  () => serverStore.server?.versionName,
  () => {
    setSettings();
  }
);

onMounted(() => {
  if (serverStore.server?.versionName) {
    setSettings();
  }
});

function toggleDrawer() {
  drawer.value = !drawer.value;
  miniState.value = !miniState.value;
}
</script>

<style scoped></style>
