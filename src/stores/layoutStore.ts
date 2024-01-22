import { defineStore } from "pinia";
import { ref } from "vue";

export const useLayoutStore = defineStore("layout", () => {
  const drawer = ref<boolean>(false);
  const mobileDrawer = ref<boolean>(false);
  const pageTitle = ref<string>();

  return { drawer, mobileDrawer, pageTitle };
});
