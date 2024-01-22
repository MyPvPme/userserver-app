<template>
  <q-card
    id="card"
    class="text-center mypvp-card-animation cursor-pointer"
    flat
    bordered
    @click="openOverview()"
  >
    <q-img
      id="server-image-background"
      :src="serverImg"
      height="135%"
      loading="lazy"
      style="z-index: -1"
    />
    <q-card-section class="text-center">
      <div class="row justify-between items-center">
        <userserver-status :status="status" no-text />
        <a class="text-white">#{{ alias || serverId }}</a>
      </div>
    </q-card-section>
    <q-card-section id="title" class="absolute-center">
      <div class="column items-center">
        <q-img id="server-image" :src="serverImg" height="64px" width="64px" />
        <a class="text-h6 text-white">{{ removeColorCodes(name) }}</a>
        <a class="text-white">{{ getMemberOrOwner() }}</a>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import UserserverStatus from "./UserserverStatus.vue";
import { removeColorCodes } from "src/utils/remove-color-codes";
import { FilesApi, User } from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "src/stores/userStore";
import * as Sentry from "@sentry/browser";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps<{
  name: string;
  serverId: number;
  status: string;
  alias: string | undefined;
  owner: User;
}>();

const userStore = useUserStore();
const i18n = useI18n();
const router = useRouter();

const serverImg = ref("/server-icon.png");

const user = computed(() => userStore.user);

onMounted(() => {
  new FilesApi(apiConfig)
    .getServerIcon(props.serverId.toString())
    .then((file) => {
      serverImg.value = URL.createObjectURL(file);
    })
    .catch((error) => Sentry.captureException(error));
});

function getMemberOrOwner() {
  return user.value?.uuid === props.owner.uuid
    ? i18n.t("owner")
    : i18n.t("member");
}

async function openOverview() {
  await router.push({
    name: "ServerOverview",
    params: { serverId: props.serverId },
  });
}
</script>

<style scoped lang="scss">
#server-image-background {
  position: absolute;
  top: -17.5%;
  filter: blur(15px);
  opacity: 0.5;
}

#card {
  display: grid;
  grid-auto-rows: max-content;
  grid-auto-flow: row;
  z-index: 1;
  overflow: hidden;
  background-color: #505050;
}

#card.q-dark {
  background-color: #292929;
}

#server-image {
  border-radius: $generic-border-radius;
}

#title a {
  overflow-wrap: anywhere;
}

#title {
  width: 100%;
}
</style>
