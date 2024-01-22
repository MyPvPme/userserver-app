import { defineStore } from "pinia";
import { Config } from "boot/configuration";

export const useConfigStore = defineStore("config", () => {
  let config: Config | undefined;
  const getConfig = (): Config => {
    if (!config) {
      throw new Error("Illegal state: Config is undefined");
    }

    return config;
  };
  const setConfig = (newConfig: Config): void => {
    config = newConfig;
  };

  return {
    getConfig,
    setConfig,
  };
});
