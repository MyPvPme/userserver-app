<template>
  <q-card class="playtime-card" flat>
    <q-card-section class="q-ml-xs">
      <h6 class="text-h6">{{ t("userserver.server-stats.top-players") }}</h6>
    </q-card-section>

    <q-card-section class="row">
      <q-card
        v-for="(player, index) in topPlayers"
        :key="player.userUuid"
        class="q-ma-xs overflow-hidden"
        flat
        bordered
      >
        <div
          id="background-image"
          :style="{
            'background-image': `url('https://visage.surgeplay.com/face/${player.userUuid}')`,
          }"
        />
        <q-card-section class="row items-center">
          <div :class="`rank-${index + 1}`">#{{ index + 1 }}</div>
          <user-info class="q-ml-sm" :uuid="player.userUuid" />
          <div class="q-ml-sm">{{ player.playtime }} Min.</div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useServerStore } from "stores/serverStore";
import {
  PlayerPlayTimeDto,
  ServerStatsApi,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import { useErrorHandler } from "src/utils/error-handler";
import UserInfo from "components/user/UserInfo.vue";
import { useI18n } from "vue-i18n";

const serverStatsApi = new ServerStatsApi(apiConfig);

const serverStore = useServerStore();
const errorHandler = useErrorHandler();
const { t } = useI18n();

const server = computed(() => serverStore.server);
const isServerLoaded = computed(() => serverStore.isServerLoaded());
const topPlayers = ref<PlayerPlayTimeDto[] | undefined>();

watch(isServerLoaded, () => loadTopPlayers());

onMounted(() => {
  loadTopPlayers().catch(errorHandler.handleError);
});

async function loadTopPlayers() {
  if (!server.value) return;

  try {
    topPlayers.value = await serverStatsApi.getTopPlayers(
      server.value.id.toString()
    );
  } catch (e) {
    errorHandler.handleError(e);
  }
}
</script>

<style scoped>
#background-image {
  background-repeat: no-repeat;
  background-size: 150%;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
  filter: blur(8px);
  opacity: 0.7;
  overflow: hidden;
}
</style>

<style>
.rank-1 {
  color: gold;
}

.rank-2 {
  color: silver;
}

.rank-3 {
  color: #945137;
}
</style>
