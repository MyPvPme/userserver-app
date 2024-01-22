<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form @submit="submit" @reset="onDialogCancel">
        <q-card-section class="text-h5">
          {{ t("userserver.create") }}
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="createServerDto.name"
            :label="t('userserver.name')"
          />

          <q-input
            v-model="createServerDto.alias"
            :label="t('userserver.alias')"
            clearable
          />

          <minecraft-chat-input
            v-model="createServerDto.description"
            :label="t('userserver.description')"
            clearable
          />

          <q-select
            v-model="createServerDto.versionName"
            :label="t('userserver.version')"
            :loading="!versions"
            :options="versions"
            :option-label="
              (item) =>
                t(
                  `userserver.versions.${(item.name || item).replace(
                    /\./g,
                    '-'
                  )}`
                )
            "
            emit-value
            option-value="name"
          />

          <q-input
            v-model.number="createServerDto.slots"
            class="col-5"
            :label="t('userserver.slots')"
            type="number"
            :rules="[
              (val) => val > 0 || t('userserver.min-slots'),
              (val) =>
                user.slotLimit >= val ||
                t('userserver.max-slots', { slots: user.slotLimit }),
            ]"
            step="1"
            :suffix="`/${user.slotLimit}`"
          />

          <q-input
            v-model.number="createServerDto.ram"
            class="col-5"
            :label="t('userserver.ram')"
            type="number"
            :rules="[
              (val) => val >= 512 || t('userserver.min-ram'),
              (val) =>
                user.ramLimit >= val ||
                t('userserver.max-ram', { ram: user.ramLimit }),
            ]"
            step="1"
            :suffix="`/${user.ramLimit} Mb`"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn type="reset" color="negative" :label="t('cancel')" />
          <q-btn type="submit" color="positive" :label="t('create')" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { CreateServerDto } from "@mypvp/userserver-api-client-browser";
import { computed, onMounted, reactive } from "vue";
import { useUserStore } from "src/stores/userStore";
import { useVersionStore } from "src/stores/versionStore";
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useServerStore } from "src/stores/serverStore";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useErrorHandler } from "src/utils/error-handler";
import MinecraftChatInput from "components/common/MinecraftChatInput.vue";

defineEmits([...useDialogPluginComponent.emits]);

const userStore = useUserStore();
const versionStore = useVersionStore();
const serverStore = useServerStore();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
const quasar = useQuasar();
const router = useRouter();
const i18n = useI18n();
const { handleError } = useErrorHandler();
const { t } = useI18n();

const createServerDto = reactive<CreateServerDto>(new CreateServerDto());
const user = computed(() => userStore.user);
const versions = computed(() => versionStore.versions);

onMounted(() => {
  versionStore.loadVersions().catch(handleError);
});

async function submit() {
  quasar.loading.show();
  try {
    const { id } = await serverStore.createServer(createServerDto);

    await router.push({
      name: "ServerOverview",
      params: {
        serverId: id,
      },
    });

    onDialogOK();
  } catch (e) {
    handleError(e, i18n.t("userserver.error.create-server").toString());
  } finally {
    quasar.loading.hide();
  }
}
</script>

<style scoped></style>
