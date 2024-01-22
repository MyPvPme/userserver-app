<template>
  <q-card class="playtime-card">
    <div id="background-image" />
    <q-card-section>
      <i18n-t keypath="userserver.server-stats.total-playtime">
        <template #playtime>
          <q-skeleton
            v-if="totalPlaytime === undefined"
            type="text"
            width="150px"
            height="50px"
          />
          <div v-else class="text-h5">{{ totalPlaytime }} Minuten 🤯</div>
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
const totalPlaytime = ref<number | undefined>();

watch(isServerLoaded, () => loadTotalPlaytime());

onMounted(async () => {
  await loadTotalPlaytime();
});
async function loadTotalPlaytime() {
  if (!server.value) return;

  try {
    const playtimeDto = await serverStatsApi.getPlaytime(
      server.value.id.toString()
    );

    totalPlaytime.value = playtimeDto.playtime;
  } catch (e) {
    errorHandler.handleError(e);
  }
}
</script>

<style scoped>
.playtime-card {
  overflow: hidden;
}
#background-image {
  background-image: url("https://media.tenor.com/ZBq6A9jU6c8AAAAC/mind-blown-explosion.gif");
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
