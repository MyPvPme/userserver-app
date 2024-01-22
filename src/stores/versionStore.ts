import { defineStore } from "pinia";
import { ref } from "vue";
import {
  ServerVersion,
  ServerVersionsApi,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";

export const useVersionStore = defineStore("versions", () => {
  const versions = ref<ServerVersion[] | undefined>(undefined);

  async function loadVersions(): Promise<void> {
    if (versions.value) {
      return;
    }

    versions.value = await new ServerVersionsApi(apiConfig).getServerVersions();
  }

  return {
    versions,
    loadVersions,
  };
});
