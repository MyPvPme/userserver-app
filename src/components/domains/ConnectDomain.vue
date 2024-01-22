<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form ref="form" @submit="connectDomain">
        <q-card-section class="q-dialog__title">
          {{ t("userserver.domains.connect-to-server") }}
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="serverIdOrAlias"
            :label="t('userserver.alias-or-id')"
            :rules="[
              (value) =>
                !!value || t('userserver.domains.server-id-or-alias-required'),
              () => !serverNotFound || t('userserver.server-not-found'),
            ]"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="negative"
            :label="t('cancel')"
            @click="onDialogCancel"
          />
          <q-btn
            color="positive"
            type="submit"
            :label="t('userserver.domains.connect')"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { QForm, useDialogPluginComponent } from "quasar";
import { useI18n } from "vue-i18n";
import { useDomainStore } from "stores/domainStore";
import { useErrorHandler } from "src/utils/error-handler";

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const props = defineProps<{
  domainRecordId: number;
}>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const { t } = useI18n();
const domainStore = useDomainStore();
const { handleError, isApiException } = useErrorHandler();

const serverIdOrAlias = ref("");
const serverNotFound = ref<boolean>(false);
const form = ref<QForm>();

watch(serverIdOrAlias, () => {
  if (serverNotFound.value) {
    serverNotFound.value = false;
  }
});

async function connectDomain() {
  try {
    await domainStore.connectDomainRecord(
      serverIdOrAlias.value,
      props.domainRecordId
    );
  } catch (e) {
    serverNotFound.value = false;
    if (isApiException(e)) {
      if (typeof e.body === "string") {
        const message = JSON.parse(e.body) as { error: string };
        if (message.error === "ServerNotFoundException") {
          serverNotFound.value = true;
          void form.value?.validate();
          return;
        }
      }
    }
    handleError(e);
  }
  onDialogOK();
}
</script>

<style scoped></style>
