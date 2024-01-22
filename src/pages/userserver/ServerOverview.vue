<template>
  <q-page id="overview-page" padding class="mypvp-layout-boundary">
    <template v-if="isServerLoaded">
      <div id="overview-header">
        <userserver-status
          id="server-status"
          :status="serverDetails.status"
          class="q-pl-xs"
        />

        <q-card
          id="server-icon"
          style="height: 144px; width: 144px"
          class="q-mr-sm"
          flat
          bordered
        >
          <q-img :src="serverImg" />
        </q-card>

        <div id="server-name">
          <q-input
            ref="form_name"
            v-model="editForm.name"
            :readonly="
              isServerArchived || !serverStore.hasServerPermission('OWNER')
            "
            outlined
            :label="t('userserver.server') + ':'"
            @blur="saveServerFields($refs, 'name')"
          />
        </div>

        <user-info
          id="server-owner"
          :uuid="serverDetails.ownerUuid"
          class="q-pt-sm"
        />

        <div id="server-actions">
          <server-restore-button
            v-if="
              ['ARCHIVING', 'ARCHIVED', 'RESTORING'].includes(
                serverDetails.status
              )
            "
          />
          <server-power-button v-else />

          <q-btn
            v-if="!isServerArchived && serverStore.hasServerPermission('OWNER')"
            color="positive"
            icon="las la-download"
            class="q-ml-sm"
            @click="downloadServer"
          >
            <q-tooltip> Server exportieren </q-tooltip>
          </q-btn>

          <q-btn
            v-if="!isServerArchived && serverStore.hasServerPermission('OWNER')"
            color="negative"
            icon="las la-trash"
            class="q-ml-sm"
            @click="deleteServer"
          >
            <q-tooltip>
              {{ t("userserver.delete-server.delete-server") }}
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="!isServerArchived && serverStore.hasServerPermission('OWNER')"
            class="q-ml-sm"
            color="negative"
            icon="las la-recycle"
            @click="resetServer"
          >
            <q-tooltip>
              {{ t("userserver.reset-server.reset-server") }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <div id="infos" class="q-pt-md column">
        <q-input
          ref="form_alias"
          v-model="editForm.alias"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('ALIAS')
          "
          outlined
          label="Alias"
          :rules="[
            (val) =>
              val.length > 0 ||
              !val ||
              'Der Alias muss mindestens einem Buchstaben lang sein',
            (val) =>
              val.length < 17 ||
              !val ||
              'Der Alias darf maximal 16 Zeichen lang sein',
            (val) =>
              !!val.match(/^[A-Za-zäöüÄÖÜß0-9]+$/) ||
              !val ||
              'Der Alias darf nur aus den Zeichen A-z bestehen',
            (val) =>
              !val.match(/^[0-9]*$/) ||
              !val ||
              'Der Alias darf nicht nur aus Zahlen bestehen',
          ]"
          @blur="saveServerFields($refs, 'alias')"
        />

        <q-input
          ref="form_ram"
          v-model.number="editForm.ram"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('OWNER')
          "
          :rules="[
            (val) => val >= 512 || t('userserver.min-ram'),
            (val) =>
              serverDetails.owner.ramLimit >= val ||
              t('userserver.max-ram', { ram: serverDetails.owner.ramLimit }),
          ]"
          outlined
          label="RAM"
          type="number"
          :suffix="`/${serverDetails.owner.ramLimit} Mb`"
          @blur="saveServerFields($refs, 'ram')"
        />

        <minecraft-chat-input
          ref="form_description"
          v-model="editForm.description"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('DESCRIPTION')
          "
          label="Beschreibung"
          autogrow
          class="q-pb-md"
          outlined
          @updated="saveServerFields($refs, 'description')"
        />

        <minecraft-chat-input
          ref="form_shortDescription"
          v-model="editForm.shortDescription"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('DESCRIPTION')
          "
          label="Kurzbeschreibung"
          autogrow
          class="q-pb-md"
          outlined
          @updated="saveServerFields($refs, 'shortDescription')"
        />

        <q-input
          ref="form_slots"
          v-model.number="editForm.slots"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('OWNER')
          "
          outlined
          :label="t('userserver.slots')"
          type="number"
          :rules="[
            (val) => val > 0 || t('userserver.min-slots'),
            (val) =>
              serverDetails.owner.slotLimit >= val ||
              t('userserver.max-slots', {
                slots: serverDetails.owner.slotLimit,
              }),
          ]"
          :suffix="`/${serverDetails.owner.slotLimit}`"
          @blur="saveServerFields($refs, 'slots')"
        />

        <q-select
          ref="form_versionName"
          v-model="editForm.versionName"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('OWNER')
          "
          outlined
          use-input
          input-debounce="0"
          :label="t('userserver.version')"
          :options="versionsOptions"
          :option-label="
            (item) =>
              t(
                `userserver.versions.${(item.name || item).replace(/\./g, '-')}`
              )
          "
          emit-value
          option-value="name"
          @filter="filterFn"
          @blur="saveServerFields($refs, 'versionName')"
        />

        <select-minecraft-item
          ref="form_iconItem"
          v-model="editForm.iconItem"
          :label="t('userserver.icon-item')"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('OWNER')
          "
          class="q-pt-md"
          outlined
          @blur="saveServerFields($refs, 'iconItem')"
        />

        <q-toggle
          ref="form_allowJoinMe"
          v-model="editForm.allowJoinMe"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('OWNER')
          "
          class="q-pt-md"
          :label="t('userserver.allow-join-me')"
          @update:model-value="saveServerFields($refs, 'allowJoinMe')"
        />

        <q-toggle
          ref="form_showJoinMe"
          v-model="editForm.showJoinMe"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('OWNER')
          "
          class="q-pt-md"
          :label="t('userserver.show-join-me')"
          @update:model-value="saveServerFields($refs, 'showJoinMe')"
        />

        <q-toggle
          ref="form_publicStatusAnnounce"
          v-model="editForm.publicStatusAnnounce"
          :readonly="
            isServerArchived || !serverStore.hasServerPermission('OWNER')
          "
          class="q-pt-md"
          :label="t('userserver.public-status-announce')"
          @update:model-value="saveServerFields($refs, 'publicStatusAnnounce')"
        />

        <div class="row items-center q-pt-md">
          <q-toggle
            ref="form_standby"
            v-model="editForm.standby"
            :readonly="
              isServerArchived || !serverStore.hasServerPermission('OWNER')
            "
            :disable="
              !hasPermission(
                serverStore.server.owner.permissions,
                'userserver.legend'
              )
            "
            :label="t('userserver.standby')"
            @update:model-value="saveServerFields($refs, 'standby')"
          />

          <rank-patch rank="legend" class="q-ml-sm" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="row items-center">
        <q-skeleton type="rect" height="148px" width="148px" />

        <div class="items-center q-pl-md">
          <div>
            <userserver-status-skeleton class="q-pl-xs" />
          </div>

          <q-skeleton type="QInput" />

          <user-info-skeleton class="q-pt-sm" />

          <div class="q-py-sm row">
            <q-skeleton type="QBtn" />

            <q-skeleton type="QBtn" class="q-ml-sm" />
          </div>
        </div>
      </div>

      <div id="infos" class="q-pt-md">
        <q-skeleton type="QInput" outlined label="Alias" class="q-pt-md" />

        <q-skeleton type="QInput" outlined label="Alias" class="q-mt-md" />

        <q-skeleton type="QInput" outlined label="Alias" class="q-mt-md" />

        <q-skeleton type="QInput" outlined label="Alias" class="q-mt-md" />
      </div>
    </template>
  </q-page>
</template>

<script lang="ts" setup>
import { apiConfig } from "boot/api-client";
import {
  EditServerDto,
  FilesApi,
  HttpFile,
  ServerVersion,
} from "@mypvp/userserver-api-client-browser";
import ConfirmDialog from "components/common/ConfirmDialog.vue";
import { useServerStore } from "src/stores/serverStore";
import { useVersionStore } from "src/stores/versionStore";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { emitter } from "src/utils/emitter";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { useErrorHandler } from "src/utils/error-handler";
import { useRouter } from "vue-router";
import UserserverArchived from "components/userserver/UserserverArchived.vue";
import UserInfo from "components/user/UserInfo.vue";
import UserserverStatusSkeleton from "components/userserver/UserserverStatusSkeleton.vue";
import UserInfoSkeleton from "components/user/UserInfoSkeleton.vue";
import UserserverStatus from "components/userserver/UserserverStatus.vue";
import MinecraftChatInput from "components/common/MinecraftChatInput.vue";
import { useLayoutStore } from "stores/layoutStore";
import ServerPowerButton from "components/userserver/ServerPowerButton.vue";
import ServerRestoreButton from "components/userserver/ServerRestoreButton.vue";
import SelectMinecraftItem from "components/common/SelectMinecraftItem.vue";
import RankPatch from "components/common/RankPatch.vue";
import { useHasePermission } from "src/mixins/has-permission";
import { saveAs } from "file-saver";
import { useFileStore } from "stores/fileStore";

const serverStore = useServerStore();
const versionStore = useVersionStore();
const i18n = useI18n();
const quasar = useQuasar();
const { handleError } = useErrorHandler();
const router = useRouter();
const { t } = useI18n();
const layoutStore = useLayoutStore();
const { hasPermission } = useHasePermission();
const fileStore = useFileStore();

const serverDetails = computed(() => serverStore.server);
const versions = computed(() => versionStore.versions);

const isServerLoaded = computed(() => serverStore.isServerLoaded());
const isServerArchived = computed(() => serverStore.isServerArchived);
const editForm = reactive<EditServerDto>({
  ram: undefined,
  alias: undefined,
  slots: undefined,
  versionName: undefined,
  iconItem: undefined,
  description: undefined,
  allowJoinMe: undefined,
  publicStatusAnnounce: undefined,
  showJoinMe: undefined,
  standby: undefined,
});
const serverImg = ref("/server-icon.png");

const versionsOptions = ref<ServerVersion[]>([]);

emitter.on("USERSERVER_UPDATED", (event) => {
  if (!event.scope) {
    return;
  }

  if (serverDetails.value?.id === +event.scope) {
    const changes = JSON.parse(event.attributes.changes) as EditServerDto;

    for (let changesKey in changes) {
      if (editForm[changesKey as keyof EditServerDto] !== undefined) {
        editForm[changesKey as keyof EditServerDto] =
          changes[changesKey as keyof EditServerDto];
      }
    }
  }
});

watch(isServerLoaded, () => {
  onServerLoaded();
});

onMounted(() => {
  layoutStore.pageTitle = "overview";
});

function filterFn(val: string, update: (update: () => void) => void) {
  if (val === "") {
    update(() => {
      versionsOptions.value = versions.value ?? [];
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    versionsOptions.value =
      versions.value?.filter((v) =>
        i18n.t(`userserver.versions.${v.name}`).toLowerCase().includes(needle)
      ) ?? [];
  });
}

function syncFormData() {
  editForm.ram = serverDetails.value?.ram;
  editForm.alias = serverDetails.value?.alias;
  editForm.slots = serverDetails.value?.slots;
  editForm.versionName = serverDetails.value?.versionName;
  editForm.name = serverDetails.value?.name;
  editForm.iconItem = serverDetails.value?.iconItem;
  editForm.description = serverDetails.value?.description;
  editForm.shortDescription = serverDetails.value?.shortDescription;
  editForm.showJoinMe = serverDetails.value?.showJoinMe;
  editForm.allowJoinMe = serverDetails.value?.allowJoinMe;
  editForm.standby = serverDetails.value?.standby;
  editForm.publicStatusAnnounce = serverDetails.value?.publicStatusAnnounce;
}

async function downloadServer() {
  if (!serverDetails.value) {
    return;
  }

  const dialog = quasar.dialog({
    message: "MyServer wird exportiert. Dies kann mehrere Minuten dauern",
    progress: true, // we enable default settings
    persistent: true, // we want the user to not be able to close it
    ok: false, // we want the user to not be able to close it
  });

  let data: HttpFile;

  try {
    data = await fileStore.getFolder("/");
    saveAs(
      data,
      serverDetails.value.alias ?? serverDetails.value.id.toString()
    );
  } catch (e) {
    quasar.notify({
      message: t("server-files.error.get-file").toString(),
      color: "negative",
    });
  } finally {
    dialog.hide();
  }
}

async function saveServerFields(
  refs: Record<string, { validate?: () => boolean }>,
  ...fields: (keyof EditServerDto)[]
) {
  if (!serverDetails.value) return;

  const data: EditServerDto = {};

  let changes = 0;

  fields.forEach((field) => {
    if (refs["form_" + field].validate && !refs["form_" + field].validate()) {
      return;
    }

    data[field] = editForm[field];
    if (serverDetails.value[field] !== editForm[field]) changes++;
  });

  if (changes === 0) return;

  await serverStore.updateServer(serverDetails.value.id, data);

  syncFormData();
}

function onServerLoaded() {
  if (!serverDetails.value) return;

  syncFormData();

  new FilesApi(apiConfig)
    .getServerIcon(serverDetails.value.id.toString())
    .then((file) => {
      serverImg.value = URL.createObjectURL(file);
    })
    .catch(handleError);

  if (isServerArchived.value) {
    quasar.dialog({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      component: UserserverArchived,
    });
  }
}

function deleteServer() {
  quasar
    .dialog({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      component: ConfirmDialog,
      componentProps: {
        title: i18n.t("userserver.delete-server.dialog.title"),
        message: i18n.t("userserver.delete-server.dialog.message"),
        ok: "userserver.delete-server.delete-server",
      },
    })
    .onOk(() => {
      if (!serverDetails.value) {
        return;
      }
      serverStore
        .deleteServer(serverDetails.value.id)
        .catch((e) =>
          handleError(e, i18n.t("userserver.delete-server.failed"))
        );
      router
        .push({
          name: "PrivateUserserverList",
          replace: true,
        })
        .catch(handleError);
    });
}
function resetServer() {
  quasar
    .dialog({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      component: ConfirmDialog,
      componentProps: {
        title: i18n.t("userserver.reset-server.dialog.title"),
        message: i18n.t("userserver.reset-server.dialog.message"),
        ok: "userserver.reset-server.reset-server",
      },
    })
    .onOk(() => {
      if (!serverDetails.value) {
        return;
      }

      serverStore
        .resetServer(serverDetails.value.id)
        .catch((e) => handleError(e, i18n.t("userserver.reset-server.failed")));
    });
}

onMounted(() => {
  if (isServerLoaded.value) {
    onServerLoaded();
  }

  versionStore.loadVersions().catch(handleError);
});
</script>

<style scoped lang="scss">
#server-icon {
  image-rendering: pixelated;
}
#overview-header {
  display: grid;
  grid-template-areas:
    "status actions actions"
    "image name name"
    "image owner owner";
  grid-template-columns: max-content auto max-content;
}

#server-status {
  grid-area: status;
}

#server-icon {
  grid-area: image;
}

#server-actions {
  grid-area: actions;
  justify-self: end;
}

#server-owner {
  grid-area: owner;
}

#server-name {
  grid-area: name;
  align-self: end;
}
</style>
