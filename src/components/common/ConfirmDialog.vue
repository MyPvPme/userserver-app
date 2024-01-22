<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="q-dialog__title">
        {{ title }}
      </q-card-section>

      <q-card-section>
        {{ message }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="positive" :label="t(ok)" @click="onDialogOK" />
        <q-btn color="negative" :label="t(cancel)" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from "quasar";
import { useI18n } from "vue-i18n";

withDefaults(
  defineProps<{
    title: string;
    message: string;
    ok: string;
    cancel: string;
  }>(),
  {
    cancel: "cancel",
    ok: "ok",
  }
);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const { t } = useI18n();
</script>

<style scoped></style>
