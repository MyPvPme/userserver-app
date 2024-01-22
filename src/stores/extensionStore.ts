import { defineStore } from "pinia";
import { ref } from "vue";
import {
  ServerExtension,
  ServerExtensionsApi,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";

export const useExtensionStore = defineStore("extension", () => {
  const extensions = ref<ServerExtension[] | undefined>();

  async function loadExtensions(reload: boolean): Promise<void> {
    if (extensions.value && !reload) {
      return;
    }

    extensions.value = await new ServerExtensionsApi(
      apiConfig
    ).getAllExtensions();
  }
  return {
    extensions,
    loadExtensions,
  };
});
