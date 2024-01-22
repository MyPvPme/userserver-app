import { defineStore } from "pinia";
import { UsersApi } from "@mypvp/base-rest-client-browser";
import { baseApiConfig } from "boot/base-api-client";

export const useUsersStore = defineStore("users", () => {
  const nameCache = new Map<string, string>();
  async function getUsernameFromUuid(uuid: string): Promise<string> {
    const cachedName = nameCache.get(uuid);

    if (!cachedName) {
      const name = await new UsersApi(baseApiConfig).getNameFromUuid(uuid);
      nameCache.set(uuid, name);
      return name;
    }

    return cachedName;
  }

  return { getUsernameFromUuid };
});
