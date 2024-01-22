import { defineStore } from "pinia";
import { MaterialsApi } from "@mypvp/base-rest-client-browser";
import { baseApiConfig } from "boot/base-api-client";
import { ref } from "vue";

export const useMaterialStore = defineStore("material", () => {
  const materials = ref<string[] | undefined>();

  async function loadMaterials() {
    materials.value = await new MaterialsApi(baseApiConfig).getMaterials();
  }

  return {
    materials,
    loadMaterials,
  };
});
