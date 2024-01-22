<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form @submit="onOKClick" @reset="onDialogCancel">
        <q-card-section class="q-dialog__title">
          {{ t("add-permission-to-server") }}
        </q-card-section>

        <q-card-section>
          <user-input v-model="uuid" label="uuid" />

          <q-select
            v-model="permissions"
            :options="permissionOptions"
            :label="t('permissions')"
            multiple
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="negative"
            :label="t('cancel')"
            type="reset"
            unelevated
          />

          <q-btn color="positive" type="submit" unelevated :label="t('ok')" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useDialogPluginComponent } from "quasar";
import UserInput from "components/user/UserInput.vue";
import { useI18n } from "vue-i18n";
import { ServerPermissionPermissionEnum } from "@mypvp/userserver-api-client-browser";

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const { t } = useI18n();

const permissionOptions: ServerPermissionPermissionEnum[] = [
  "START",
  "STOP",
  "KILL",
  "VIEW",
  "ALIAS",
  "DESCRIPTION",
  "ICON",
  "NAME",
  "NOTIFY",
  "PERMISSIONS",
  "PLUGINS",
  "SERVER_PROPERTIES",
  "TERMINAL",
  "FILES",
];

const uuid = ref("");
const permissions = ref([]);

function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK({
    uuid: uuid.value,
    permissions: permissions.value,
  });
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>

<style scoped></style>
