<template>
  <div id="nav" class="q-mr-md z-max">
    <q-list dense class="fixed">
      <q-item
        v-for="item in items"
        :key="item.__index"
        :to="item.to"
        :disable="!isAbleToView(item)"
        active-class="nav-active"
        class="mypvp-text-color"
      >
        <q-item-section class="nav-avatar" avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
          {{ item.name }}
        </q-item-section>
      </q-item>
    </q-list>
    <div id="place-holder"></div>
  </div>
</template>

<script lang="ts" setup>
import { useServerStore } from "src/stores/serverStore";
import { useUserStore } from "src/stores/userStore";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Server } from "@mypvp/userserver-api-client-browser";
import { DrawerItemProp } from "components/layout/DrawerItem.vue";

const i18n = useI18n();
const serverStore = useServerStore();
const userStore = useUserStore();

const server = computed(() => serverStore.server);
const user = computed(() => userStore.user);
const items = ref<DrawerItemProp[]>([
  {
    icon: "las la-home",
    name: i18n.t("overview"),
    to: { name: "ServerOverview" },
  },
  {
    icon: "las la-terminal",
    name: i18n.t("console"),
    to: { name: "ServerConsole" },
    permission: "runcommand",
    ableToView: (server: Server) =>
      server.status === "ONLINE" || server.status === "STARTING",
  },
  {
    icon: "las la-plug",
    name: i18n.t("userserver.plugins"),
    to: { name: "ServerPlugins" },
    permission: "plugins",
    ableToView: (server: Server) => server.status !== "ARCHIVED",
  },
  {
    icon: "las la-folder",
    name: i18n.t("userserver.files.file", 2),
    to: { name: "ServerFiles" },
    permission: "configeditor",
    ableToView: (server: Server) => server.status !== "ARCHIVED",
  },
]);

function isAbleToView(item: DrawerItemProp): boolean {
  if (!server.value) return false;
  if (!user.value) return false;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (item.ableToView !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    if (!item.ableToView(server.value)) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!item.permission) return true;
  if (server.value.ownerUuid === user.value.uuid) return true;

  return server.value.permissions.some(
    (permission) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      permission.permission === item.permission &&
      permission.userUuid === user.value?.uuid
  );
}
</script>

<style scoped lang="scss">
.nav-active i {
  color: $primary;
}
.nav-active {
  color: $primary;
}
#place-holder {
  width: 130px;
}
.nav-avatar {
  min-width: 0;
}
#nav {
  margin-left: -16px;
}
</style>
