import { defineStore } from "pinia";
import { ref } from "vue";
import {
  CreateServerExtensionDto,
  ServerExtension,
  ServerExtensionsApi,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";

export const useAdminStore = defineStore("admin", () => {
  const serverExtensionsApi = new ServerExtensionsApi(apiConfig);

  const extensions = ref<ServerExtension[] | undefined>(undefined);

  async function loadExtensions() {
    extensions.value = await serverExtensionsApi.getAllExtensions();
  }

  async function createExtension(
    createServerExtensionDto: CreateServerExtensionDto
  ) {
    await serverExtensionsApi.createServerExtension(createServerExtensionDto);
    await loadExtensions();
  }

  return {
    extensions,
    loadExtensions,
    createExtension,
  };
});
