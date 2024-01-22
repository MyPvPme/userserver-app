<template>
  <q-page>
    <page-title preview />
    <div id="stats-dashboard">
      <total-playtime id="total-player" />

      <unique-player-joins id="unique-player-joins" />

      <top-players id="top-players" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useLayoutStore } from "stores/layoutStore";
import PageTitle from "components/layout/PageTitle.vue";
import TotalPlaytime from "components/server-stats/TotalPlaytime.vue";
import UniquePlayerJoins from "components/server-stats/UniquePlayerJoins.vue";
import TopPlayers from "components/server-stats/TopPlayers.vue";

const layoutStore = useLayoutStore();

onMounted(() => {
  layoutStore.pageTitle = "userserver.server-stats.server-stats";
});
</script>

<style scoped>
#stats-dashboard {
  display: grid;
  grid-template-areas:
    "playeTime playerCount"
    "topPlayers topPlayers";
  grid-template-columns: minmax(100px, 500px) minmax(100px, 500px);
  grid-row-gap: 10px;

  grid-column-gap: 10px;
}

#total-player {
  grid-area: playeTime;
}

#unique-player-joins {
  grid-area: playerCount;
}

#unique-player-joins {
  grid-area: playerCount;
}

#top-players {
  grid-area: topPlayers;
}
</style>
