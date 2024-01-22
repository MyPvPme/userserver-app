<template>
  <q-page>
    <div class="row justify-between">
      <page-title />
      <q-btn
        icon="las la-plus"
        color="positive"
        flat
        @click="addPermissionDialog"
      />
    </div>
    <q-table :rows="mappedPermissions" :columns="columns" flat>
      <template #body-cell-player="props">
        <q-td key="player" :props="props">
          <user-info :uuid="props.row.uuid" />
        </q-td>
      </template>

      <template #body-cell-permissions="props">
        <q-td key="permissions" :props="props">
          <q-select
            v-model="props.row.permissions"
            multiple
            dense
            :options="permissions"
            use-chips
            @add="({ value }) => addPermission(props.row.uuid, value)"
            @remove="({ value }) => removePermission(props.row.uuid, value)"
          />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td key="actions" :props="props">
          <q-btn
            flat
            color="negative"
            icon="las la-trash"
            @click="removePermission(props.row.uuid)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import UserInfo from "components/user/UserInfo.vue";
import { useQuasar } from "quasar";
import { useServerStore } from "src/stores/serverStore";
import { CreateServerPermissionDtoPermissionEnum } from "@mypvp/userserver-api-client-browser/models/CreateServerPermissionDto";
import AddServerPermissionDialog from "components/userserver/AddServerPermissionDialog.vue";
import { useErrorHandler } from "src/utils/error-handler";
import PageTitle from "components/layout/PageTitle.vue";
import { useLayoutStore } from "stores/layoutStore";
import { ServerPermissionPermissionEnum } from "@mypvp/userserver-api-client-browser";

const serverStore = useServerStore();
const layoutStore = useLayoutStore();
const i18n = useI18n();
const quasar = useQuasar();
const { handleError } = useErrorHandler();

const columns = [
  {
    name: "player",
    label: i18n.t("player"),
    align: "left",
    field: "uuid",
  },
  {
    name: "permissions",
    label: i18n.t("permissions"),
    align: "left",
    field: "permissions",
  },
  {
    name: "actions",
    align: "right",
  },
];
const permissions: ServerPermissionPermissionEnum[] = [
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

const mappedPermissions = computed(() => {
  if (!serverStore.isServerLoaded()) {
    return [];
  }

  const mappedPermissions: { uuid: string; permissions: string[] }[] = [];

  serverStore.server?.permissions.forEach((permission) => {
    const mappedPermission = mappedPermissions.find(
      (mappedPermission) => mappedPermission.uuid === permission.userUuid
    );

    if (mappedPermission) {
      mappedPermission.permissions.push(permission.permission);
    } else {
      mappedPermissions.push({
        uuid: permission.userUuid,
        permissions: [permission.permission],
      });
    }
  });

  return mappedPermissions;
});

onMounted(() => {
  layoutStore.pageTitle = "userserver.permissions";
});
const addPermission = async (
  uuid: string,
  permission: CreateServerPermissionDtoPermissionEnum
) => {
  if (!serverStore.server) return;

  await serverStore.addPermission(serverStore.server.id.toString(), {
    userUuid: uuid,
    permission,
  });
};

const addPermissionDialog = () => {
  quasar
    .dialog({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      component: AddServerPermissionDialog,
    })
    .onOk(
      ({
        uuid,
        permissions,
      }: {
        uuid: string;
        permissions: CreateServerPermissionDtoPermissionEnum[];
      }) => {
        Promise.all(
          permissions.map((permission) => addPermission(uuid, permission))
        ).catch(handleError);
      }
    );
};

const removePermission = async (
  uuid: string,
  permission: CreateServerPermissionDtoPermissionEnum
) => {
  if (!serverStore.server) return;

  await serverStore.deletePermission(serverStore.server.id.toString(), {
    userUuid: uuid,
    permission,
  });
};
</script>

<style scoped></style>
