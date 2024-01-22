<template>
  <q-layout view="hHh LpR lff" class="shadow-0 rounded-borders">
    <layout-header has-sub-menu />
    <server-layout-drawer />
    <mobile-drawer />
    <layout-footer />
    <q-page-container>
      <router-view class="mypvp-layout-boundary" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import LayoutHeader from "components/layout/LayoutHeader.vue";
import LayoutFooter from "components/layout/LayoutFooter.vue";
import ServerLayoutDrawer from "components/layout/ServerLayoutDrawer.vue";
import MobileDrawer from "components/layout/MobileDrawer.vue";
</script>

<style scoped></style>
