<template>
  <q-page class="mypvp-layout-boundary">
    <div id="content">
      <h4 class="q-pb-md">{{ t("user.private-userservers") }}</h4>
      <div v-if="userservers" id="server-gallery">
        <userserver-card
          v-for="userserver in sortedUserservers"
          :key="userserver.id"
          :name="userserver.name"
          :server-id="userserver.id"
          :status="userserver.status"
          :alias="userserver.alias"
          :owner="userserver.owner"
        />

        <q-card
          v-if="user && userservers"
          class="text-center column justify-center"
          :class="{
            'mypvp-card-animation': user.serverLimit > userservers.length,
            'cursor-pointer': user.serverLimit > userservers?.length,
            'cursor-not-allowed': !(user.serverLimit > userservers.length),
          }"
          @click="createServerDialog"
        >
          <div id="add-server-text">
            <q-icon size="3rem" class="las la-plus" />
            <p class="text-h5">{{ t("userserver.create") }}</p>
          </div>
        </q-card>
      </div>

      <div v-else id="server-gallery">
        <q-skeleton type="rect" />
        <q-skeleton type="rect" />
        <q-skeleton type="rect" />
        <q-skeleton type="rect" />
        <q-skeleton type="rect" />
        <q-skeleton type="rect" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import UserserverCard from "../../components/userserver/UserserverCard.vue";
import CreateServerDialog from "components/userserver/CreateServerDialog.vue";
import { useUserStore } from "src/stores/userStore";
import { computed } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const quasar = useQuasar();
const { t } = useI18n();

const userservers = computed(() => userStore.userservers);
const user = computed(() => userStore.user);

const sortedUserservers = computed(() => {
  if (!userservers.value) return [];

  return userservers.value.slice(0).sort((a, b) => {
    if (!user.value) return -1;

    if (a.ownerUuid === user.value.uuid && b.ownerUuid !== user.value.uuid) {
      return -1;
    }
    if (a.ownerUuid !== user.value.uuid && b.ownerUuid === user.value.uuid) {
      return 1;
    }
    return a.id - b.id;
  });
});

function createServerDialog() {
  quasar.dialog({
    component: CreateServerDialog,
  });
}
</script>

<style scoped>
#server-gallery {
  display: grid;
  grid-auto-rows: minmax(250px, 1fr);
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  //grid-template-rows: repeat(auto-fill,1fr);
  grid-gap: 20px;
}
#server-gallery > *:first-child {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}
#server-gallery::before {
  content: "";
  width: 0;
  padding-bottom: 100%;
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}
#content {
  padding: 0 20px;
}
</style>
