<template>
  <q-page padding class="mypvp-layout-boundary">
    <page-title />

    <q-card flat>
      <q-list v-if="settings" separator bordered>
        <q-item
          v-for="setting in settings"
          :key="setting.name"
          clickable
          :to="setting.to"
        >
          <q-item-section avatar>
            <q-icon :name="setting.icon" />
          </q-item-section>

          <q-item-section>
            {{ setting.name }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-list v-else separator bordered>
        <q-item v-for="i in [0, 1, 2, 3]" :key="i" clickable>
          <q-item-section avatar>
            <q-skeleton type="rect" height="24px" width="24px" />
          </q-item-section>

          <q-item-section>
            <q-skeleton
              type="text"
              :width="`${Math.floor(Math.random() * 250)}px`"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { getDefinitionsForServerVersion } from "src/config-json-definitions";
import { useServerStore } from "src/stores/serverStore";
import { Server } from "@mypvp/userserver-api-client-browser";
import { RouterLinkProps } from "vue-router";
import PageTitle from "components/layout/PageTitle.vue";
import { useLayoutStore } from "stores/layoutStore";

const layoutStore = useLayoutStore();
const serverStore = useServerStore();

const settings = ref<
  { icon: string; name: string; to: RouterLinkProps["to"] }[] | undefined
>(undefined);

const setSettings = (server: Server) => {
  const definitions = getDefinitionsForServerVersion(server.versionName);
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
    if (serverStore.server) setSettings(serverStore.server);
  }
);

onMounted(() => {
  if (serverStore.server) {
    setSettings(serverStore.server);
  }
});

onMounted(() => {
  layoutStore.pageTitle = "userserver.settings";
});
</script>

<style scoped></style>
