<template>
  <q-badge outline :color="currentRank" class="cursor-pointer">
    <q-icon
      :name="hasRankPermission ? 'las la-lock-open' : 'las la-lock'"
      class="q-pr-xs"
    />
    {{ currentRank.toUpperCase() }}
  </q-badge>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useHasePermission } from "src/mixins/has-permission";
import { useUserStore } from "src/stores/userStore";

const props = withDefaults(
  defineProps<{
    rank: string;
    rankFromPermission?: string;
  }>(),
  {
    rank: "premium",
    rankFromPermission: undefined,
  }
);

const { hasPermission } = useHasePermission();
const userStore = useUserStore();

const currentRank = computed(() => {
  if (props.rankFromPermission) {
    return props.rankFromPermission.replace("userserver.", "");
  } else {
    return props.rank;
  }
});

const hasRankPermission = computed(() => {
  if (!userStore.user) {
    return [];
  }

  return hasPermission(userStore.user.permissions, "userserver." + props.rank);
});
</script>

<style scoped></style>
