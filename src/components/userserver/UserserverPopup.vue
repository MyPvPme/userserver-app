<template>
  <q-skeleton v-if="!server" />
  <q-btn v-else flat dense :label="server.name">
    <q-popup-proxy>
      <q-card class="server-card">
        <q-card-section class="column">
          <div class="row items-center">
            <q-card flat bordered>
              <q-img height="50px" width="50px" :src="serverIcon" />
            </q-card>
            <div class="q-pl-sm">
              <div class="text-subtitle1">{{ server.name }}</div>
              <div>#{{ server.alias || server.id }}</div>
            </div>
          </div>

          <div class="q-pt-sm">
            <user-info
              class="q-pl-sm"
              :uuid="server.ownerUuid"
              icon-size="20px"
              name-class=""
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-if="server.status === 'ONLINE'"
            :label="t('join')"
            color="primary"
            :loading="isJoining"
            @click="joinServer"
          />
        </q-card-actions>
      </q-card>
    </q-popup-proxy>
  </q-btn>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import {
  FilesApi,
  ServerInfoDto,
  ServersApi,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import UserInfo from "components/user/UserInfo.vue";
import * as Sentry from "@sentry/browser";

const props = defineProps<{
  serverId: number;
}>();

const server = ref<ServerInfoDto | undefined>(undefined);
const serverIcon = ref<string>("/server-icon.png");
const isJoining = ref<boolean>(false);

onMounted(() => {
  new ServersApi(apiConfig)
    .getServerInfo(props.serverId.toString())
    .then((serverInfo) => {
      server.value = serverInfo;
    })
    .catch((error) => Sentry.captureException(error));

  new FilesApi(apiConfig)
    .getServerIcon(props.serverId.toString())
    .then((file) => {
      serverIcon.value = URL.createObjectURL(file);
    })
    .catch((error) => Sentry.captureException(error));
});

watch(
  () => props.serverId,
  () => {
    server.value = undefined;
    new ServersApi(apiConfig)
      .getServerInfo(props.serverId.toString())
      .then((serverInfo) => {
        server.value = serverInfo;
      })
      .catch((error) => Sentry.captureException(error));

    new FilesApi(apiConfig)
      .getServerIcon(props.serverId.toString())
      .then((file) => {
        serverIcon.value = URL.createObjectURL(file);
      })
      .catch((error) => Sentry.captureException(error));
  }
);

function joinServer() {
  isJoining.value = true;
  new ServersApi(apiConfig)
    .joinServer(props.serverId.toString())
    .then(() => {
      isJoining.value = false;
    })
    .catch((error) => Sentry.captureException(error));
}
</script>

<style scoped>
.server-card {
  min-width: 250px;
}
</style>
