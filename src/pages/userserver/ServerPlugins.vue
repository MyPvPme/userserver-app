<template>
  <q-page>
    <page-title />
    <userserver-plugin-list
      :plugins="serverPlugins"
      class="q-mt-sm full-height"
    />
  </q-page>
</template>

<script lang="ts" setup>
import UserserverPluginList from "components/userserver-plugins/UserserverPluginList.vue";
import { computed, onMounted } from "vue";
import { useServerStore } from "src/stores/serverStore";
import { useLayoutStore } from "stores/layoutStore";
import PageTitle from "components/layout/PageTitle.vue";

const serverStore = useServerStore();
const layoutStore = useLayoutStore();

onMounted(() => {
  layoutStore.pageTitle = "userserver.plugins";
});

const serverPlugins = computed(() => serverStore.serverPlugins);
</script>

<style scoped></style>
