<template>
  <q-layout view="hHh lpR fff" class="shadow-0 rounded-borders">
    <layout-header />
    <mobile-drawer />
    <q-page-container>
      <router-view />
    </q-page-container>
    <layout-footer />
  </q-layout>
</template>

<script lang="ts" setup>
import LayoutHeader from "components/layout/LayoutHeader.vue";
import LayoutFooter from "components/layout/LayoutFooter.vue";
import MobileDrawer from "components/layout/MobileDrawer.vue";
</script>
