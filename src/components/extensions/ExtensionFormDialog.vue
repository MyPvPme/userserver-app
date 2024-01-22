<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="q-dialog__title">
        {{ t("userserver.extensions.create-extension") }}
      </q-card-section>

      <q-card-section>
        <q-input v-model="form.name" :label="t('userserver.extensions.name')" />
        <select-minecraft-item
          v-model="form.menuItem"
          :label="t('userserver.extensions.menu-item')"
        />
        <q-input
          v-model="form.permission"
          :label="t('userserver.extensions.permission')"
        />
        <q-select
          v-model="form.type"
          :options="types"
          :label="t('userserver.extensions.type')"
        />
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" :label="t('create')" @click="onOKClick" />
        <q-btn color="primary" :label="t('cancel')" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { reactive } from "vue";
import { CreateServerExtensionDto } from "@mypvp/userserver-api-client-browser";
import { useDialogPluginComponent } from "quasar";
import SelectMinecraftItem from "components/common/SelectMinecraftItem.vue";
import { CreateServerExtensionDtoTypeEnum } from "@mypvp/userserver-api-client-browser/models/CreateServerExtensionDto";
import { useAdminStore } from "stores/adminStore";

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const adminStore = useAdminStore();

const types: CreateServerExtensionDtoTypeEnum[] = [
  "SKRIPT",
  "SYSTEM",
  "MINI_GAME",
  "WORLDEDITING",
];
const form = reactive(new CreateServerExtensionDto());
form.isPublic = false;
form.menuItem = "DIRT";

async function onOKClick() {
  await adminStore.createExtension(form);
  onDialogOK();
}
</script>

<style scoped></style>
