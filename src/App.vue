<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from "quasar";
import { onMounted } from "vue";
import { emitter } from "src/utils/emitter";
import { Event } from "@mypvp/userserver-api-client-browser";
import { useI18n } from "vue-i18n";
import { notifications } from "src/utils/notifications";
import { useUsersStore } from "stores/usersStore";
import { useErrorHandler } from "src/utils/error-handler";
import { useUserStore } from "stores/userStore";

const quasar = useQuasar();
const i18n = useI18n();
const usersStore = useUsersStore();
const { handleError } = useErrorHandler();
const userStore = useUserStore();

emitter.on("*", (eventType, event) => {
  if (event.producer === userStore.user?.uuid) return;

  const notification = notifications[eventType];
  if (!notification) return;

  let resolvedNotification = notification(event);
  getI8nAttributes(event)
    .then((attributes) => {
      quasar.notify({
        position: "top-right",
        ...resolvedNotification,
        message: i18n.t(resolvedNotification.message, attributes),
      });
    })
    .catch(handleError);
});

async function getI8nAttributes(event: Event): Promise<Record<string, string>> {
  const attributes = {
    ...event.attributes,
  };

  attributes.producer = event.producer;

  if (isUuid(event.producer)) {
    attributes.producer = await usersStore.getUsernameFromUuid(event.producer);
  }

  if (event.scope) {
    attributes.scope = event.scope;
    if (isUuid(event.scope)) {
      attributes.scope = await usersStore.getUsernameFromUuid(event.scope);
    }

    attributes.server = attributes.serverAlias || event.scope;
  }

  return attributes;
}

function isUuid(uuid: string): boolean {
  return !!uuid.match(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
  );
}

onMounted(() => {
  if (quasar.localStorage.has("dark")) {
    quasar.dark.set(!!quasar.localStorage.getItem<boolean>("dark"));
  } else {
    quasar.dark.set("auto");
  }
});
</script>
