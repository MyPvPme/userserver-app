<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form ref="form" @submit="onOKClick">
        <q-card-section class="q-dialog__title">
          {{ t("userserver.domains.register-domain") }}
        </q-card-section>

        <q-card-section class="row items-end">
          <q-input
            v-model="subDomain"
            label="Subdomain"
            class="col-6"
            :rules="[
              (value) => !!value || t('userserver.domains.sub-domain-required'),
              () =>
                !domainRecordInUse ||
                t('userserver.domains.sub-domain-not-available'),
            ]"
          />
          <div class="q-px-sm q-pb-md">.</div>
          <q-select
            v-model="domain"
            :options="domains"
            label="Domain"
            option-label="domain"
            option-value="id"
            emit-value
            map-options
            :bottom-slots="true"
            :loading="!domains"
            class="col-5"
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
            :label="t('userserver.domains.register')"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { QForm, useDialogPluginComponent } from "quasar";
import { computed, ref, watch } from "vue";
import { useDomainStore } from "src/stores/domainStore";
import { useErrorHandler } from "src/utils/error-handler";
import { useI18n } from "vue-i18n";
const domainStore = useDomainStore();
const { handleError, isApiException } = useErrorHandler();
const { t } = useI18n();

const domains = computed(() => domainStore.domains);
const domain = ref<number>();
const subDomain = ref<string>("");
const loading = ref<boolean>(false);
const domainRecordInUse = ref<boolean>(false);
const form = ref<QForm>();

if (!domains.value) {
  domainStore.loadDomains().catch((e) => handleError(e));
}

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

watch(subDomain, () => {
  if (domainRecordInUse.value) {
    domainRecordInUse.value = false;
  }
});

async function onOKClick() {
  if (!domain.value) return;

  try {
    await domainStore.registerDomainRecord(subDomain.value, domain.value);
    domainRecordInUse.value = false;
    onDialogOK();
  } catch (e) {
    if (isApiException(e)) {
      if (e.code === 409) {
        domainRecordInUse.value = true;
        void form.value?.validate();
        return;
      }
    }

    handleError(e);
  }
}
</script>

<style scoped></style>
