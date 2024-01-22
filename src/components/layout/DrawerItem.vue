<template>
  <q-item
    v-if="isAbleToView"
    :to="item.to"
    @mouseover="showSubmenu"
    @mouseleave="onMouseLeave"
  >
    <q-item-section avatar>
      <q-icon :name="item.icon" />
    </q-item-section>

    <q-item-section>
      {{ item.name }}
    </q-item-section>

    <q-item-section>
      <q-item-label overline>
        <component :is="item.badge" v-if="item.badge"></component>
      </q-item-label>
    </q-item-section>

    <q-tooltip v-if="showTooltip" anchor="center right" self="center left">
      {{ item.name }}
    </q-tooltip>

    <q-menu
      v-model="submenu"
      anchor="top right"
      class="submenu"
      no-parent-event
      square
      @mouseleave="hideSubMenu"
    >
      <q-list class="submenu">
        <q-item
          v-for="child in item.children"
          :key="child.name"
          dense
          :to="child.to"
          class="submenu"
        >
          <q-item-section avatar>
            <q-icon :name="child.icon" />
          </q-item-section>

          <q-item-section>
            {{ child.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script lang="ts" setup>
import { RouteLocationRaw } from "vue-router";

export interface DrawerItemProp {
  icon: string;
  name: string;
  to: RouteLocationRaw;
  permission?: string;
  serverPermission?: ServerPermissionPermissionEnum;
  ableToView?: (server: Server) => boolean;
  children?: DrawerItemProp[];
  badge?: unknown;
  preview: boolean;
}

import { ref, computed } from "vue";
import { useServerStore } from "src/stores/serverStore";
import {
  Server,
  ServerPermissionPermissionEnum,
} from "@mypvp/userserver-api-client-browser";
import { useHasePermission } from "src/mixins/has-permission";
import { useUserStore } from "stores/userStore";

const props = defineProps<{
  item: DrawerItemProp;
  showTooltip?: boolean;
}>();

const serverStore = useServerStore();
const { hasPermission } = useHasePermission();
const userStore = useUserStore();

const submenu = ref(false);
const user = computed(() => userStore.user);
const showSubmenu = () => {
  if (props.item.children) submenu.value = true;
};
const hideSubMenu = () => {
  if (props.item.children) submenu.value = false;
};

const isAbleToView = computed(() => {
  if (
    props.item.serverPermission &&
    !serverStore.hasServerPermission(props.item.serverPermission)
  ) {
    return false;
  }

  if (props.item.permission) {
    if (!user.value) {
      return false;
    }

    if (!hasPermission(user.value.permissions, props.item.permission)) {
      return false;
    }
  }

  if (!props.item.ableToView) {
    return true;
  }

  if (!serverStore.server) {
    return false;
  }

  return props.item.ableToView(serverStore.server);
});

function onMouseLeave(event: MouseEvent) {
  if ((event.target as HTMLDivElement).classList.contains("submenu")) {
    return;
  }
  hideSubMenu();
}
</script>

<style scoped></style>
