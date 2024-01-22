<template>
  <q-drawer
    :model-value="true"
    show-if-above
    :mini="miniState"
    :width="200"
    elevated
  >
    <div class="column justify-between fit">
      <q-list padding>
        <drawer-item v-for="item in items" :key="item.name" :item="item" />
      </q-list>

      <q-btn
        class="q-py-md"
        :icon="
          miniState ? 'la la-angle-double-right' : 'la la-angle-double-left'
        "
        flat
        @click="miniState = !miniState"
      />
    </div>
  </q-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import DrawerItem, { DrawerItemProp } from "components/layout/DrawerItem.vue";

const i18n = useI18n();

const miniState = ref(false);
const items = ref<DrawerItemProp[]>([
  {
    icon: "las la-plug",
    name: i18n.t("extensions"),
    to: { name: "AdminExtensionList" },
  },
]);
</script>

<style scoped></style>
