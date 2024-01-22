<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form ref="form" @submit="onOKClick">
        <q-card-section class="q-dialog__title">
          {{ t("userserver.domains.transfer-domain") }}
        </q-card-section>

        <q-card-section>
          <user-input
            v-model="receiverUuid"
            :error-message="errorMessage"
            @input="resetErrorMessage"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="negative"
            :label="t('cancel')"
            @click="onDialogCancel"
          />
          <q-btn
            :loading="loading"
            color="positive"
            type="submit"
            :label="t('userserver.domains.transfer')"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { QForm, useDialogPluginComponent } from "quasar";
import { ref } from "vue";
import { useDomainStore } from "src/stores/domainStore";
import { useErrorHandler } from "src/utils/error-handler";
import { useI18n } from "vue-i18n";
import UserInput from "components/user/UserInput.vue";

const domainStore = useDomainStore();
const { handleError, isApiException } = useErrorHandler();
const { t } = useI18n();

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const props = defineProps<{ domainRecordId: number }>();

const receiverUuid = ref<string>();
const errorMessage = ref<string>();
const loading = ref(false);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

function resetErrorMessage() {
  if (errorMessage.value) errorMessage.value = undefined;
}

async function onOKClick() {
  if (!receiverUuid.value) return;

  loading.value = true;
  try {
    await domainStore.transferDomainRecord(
      props.domainRecordId,
      receiverUuid.value
    );
    onDialogOK();
  } catch (e) {
    if (isApiException(e)) {
      if (typeof e.body === "string") {
        const error = JSON.parse(e.body) as { message: string };
        if (
          error.message === "UserDoesNotAllowDomainRecordTransfersException"
        ) {
          errorMessage.value = t("userserver.user-do-not-accept-domains");
          return;
        }

        if (error.message === "UserDoesNotHaveThePermissionException") {
          errorMessage.value = t("userserver.missing-permissions-for-domain");
          return;
        }

        if (error.message === "UserDoesNotHaveThePermissionException") {
          errorMessage.value = t("userserver.missing-permissions-for-domain");
          return;
        }

        if (error.message === "UserserverDomainRecordLimitReachedException") {
          errorMessage.value = t("userserver.missing-slots-for-domain");
          return;
        }
      }
    }

    handleError(e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
