<template>
  <q-card class="player-count-card">
    <div id="background-image" />
    <q-card-section>
      <i18n-t keypath="userserver.server-stats.unique-player-count">
        <template #playerCount>
          <q-skeleton
            v-if="uniquePlayerCount === undefined"
            type="text"
            width="150px"
            height="50px"
          />
          <div v-else class="text-h5">{{ uniquePlayerCount }} Spieler 👩‍💻</div>
        </template>
      </i18n-t>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useServerStore } from "stores/serverStore";
import { ServerStatsApi } from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import { useErrorHandler } from "src/utils/error-handler";

const serverStatsApi = new ServerStatsApi(apiConfig);

const serverStore = useServerStore();
const errorHandler = useErrorHandler();

const server = computed(() => serverStore.server);
const isServerLoaded = computed(() => serverStore.isServerLoaded());
const uniquePlayerCount = ref<number | undefined>();

watch(isServerLoaded, () => loadUniquePlayerCount());

onMounted(async () => {
  await loadUniquePlayerCount();
});
async function loadUniquePlayerCount() {
  if (!server.value) return;

  try {
    const uniquePlayerCountDto = await serverStatsApi.getUniquePlayerCount(
      server.value.id.toString()
    );

    uniquePlayerCount.value = uniquePlayerCountDto.playerCount;
  } catch (e) {
    errorHandler.handleError(e);
  }
}
</script>

<style scoped>
.player-count-card {
  overflow: hidden;
}
#background-image {
  background-image: url("https://media.tenor.com/xEGaqT6737UAAAAd/computer-pc.gif");
  background-repeat: no-repeat;
  background-size: 150%;
  background-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
  filter: blur(8px);
  opacity: 0.5;
  overflow: hidden;
}
</style>
