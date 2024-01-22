<template>
  <q-layout view="hHh LpR lff" class="shadow-0 rounded-borders">
    <layout-header />
    <admin-layout-drawer />
    <mobile-drawer />
    <layout-footer />
    <q-page-container>
      <router-view class="mypvp-layout-boundary" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import LayoutHeader from "components/layout/LayoutHeader.vue";
import AdminLayoutDrawer from "components/layout/AdminLayoutDrawer.vue";
import LayoutFooter from "components/layout/LayoutFooter.vue";
import MobileDrawer from "components/layout/MobileDrawer.vue";

export default defineComponent({
  components: { MobileDrawer, LayoutFooter, AdminLayoutDrawer, LayoutHeader },
});
</script>

<style scoped></style>
