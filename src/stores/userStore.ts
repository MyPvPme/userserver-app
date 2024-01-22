import { defineStore } from "pinia";
import {
  Server,
  ServerDomainRecord,
  User,
  UsersApi,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import { LocalStorage } from "quasar";
import { ref } from "vue";
import * as Sentry from "@sentry/browser";
import { socketInstance } from "boot/events-socket";
import { getToken } from "boot/api-client";
import { emitter } from "src/utils/emitter";
import { useErrorHandler } from "src/utils/error-handler";

export const useUserStore = defineStore("user", () => {
  const { handleError } = useErrorHandler();

  const userservers = ref<Server[] | undefined>(undefined);
  const domainRecords = ref<ServerDomainRecord[] | undefined>(undefined);
  const user = ref<User | undefined>(undefined);

  emitter.on("USERSERVER_DOMAIN_RECORD_CREATED", () => {
    loadDomainRecordsOfUser().catch(handleError);
  });

  emitter.on("USERSERVER_DOMAIN_RECORD_DELETED", () => {
    loadDomainRecordsOfUser().catch(handleError);
  });

  emitter.on("USERSERVER_DOMAIN_RECORD_CONNECTED", () => {
    loadDomainRecordsOfUser().catch(handleError);
  });

  emitter.on("USERSERVER_DOMAIN_RECORD_DISCONNECTED", () => {
    loadDomainRecordsOfUser().catch(handleError);
  });

  emitter.on("USERSERVER_DOMAIN_RECORD_TRANSFERRED", () => {
    loadDomainRecordsOfUser().catch(handleError);
  });

  async function loadUserservers() {
    if (userservers.value) return;

    userservers.value = await new UsersApi(apiConfig).getAllServersOfUser();
  }

  async function loadUser() {
    let newUser: User;

    try {
      newUser = await new UsersApi(apiConfig).getCurrentUser();
      Sentry.setUser({
        id: newUser.uuid,
        ...newUser,
      });
    } catch (e) {
      Sentry.captureException(e);
      throw e;
    }

    if (user.value?.uuid !== newUser.uuid) {
      try {
        socketInstance.io.opts.extraHeaders = {
          Authorization: `Bearer ${await getToken()}`,
        };
        socketInstance.connect();
        socketInstance.emit("subscribe");
      } catch (e) {
        console.error(e);
      }
      user.value = newUser;
    }
  }

  function logout() {
    user.value = undefined;
    userservers.value = [];

    LocalStorage.remove("api_key");
    LocalStorage.remove("oauth_access_token");
    LocalStorage.remove("oauth_refresh_token");
  }

  async function loadDomainRecordsOfUser() {
    try {
      domainRecords.value = await new UsersApi(
        apiConfig
      ).getDomainRecordsOfCurrentUser();
    } catch (e) {
      Sentry.captureException(e);
    }
  }

  //  function socket_event({ state, commit }, event) {
  //    switch (event.type) {
  //      case "USERSERVER_STATUS_CHANGED":
  //        commit("setStatusOfServer", {
  //          status: event.attributes?.status,
  //          serverId: +event.scope
  //        });
  //        break;
  //      case "USERSERVER_DELETED":
  //        commit("deleteUserserver", +event.scope);
  //        break;
  //      case "USERSERVER_UPDATED":
  //        commit("updateUserserver", {
  //          serverId: +event.scope,
  //          changes: event.attributes.changes
  //        });
  //        break;
  //    }
  // }

  return {
    userservers,
    domainRecords,
    user,
    loadUser,
    loadDomainRecordsOfUser,
    logout,
    loadUserservers,
  };
});
