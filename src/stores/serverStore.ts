import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  CreateServerDto,
  CreateServerPermissionDto,
  DeleteServerPermissionDto,
  EditServerDto,
  Server,
  ServerExtensionsApi,
  ServerPermission,
  ServerPermissionsApi,
  ServersApi,
  SpigotPlugin,
  Event,
  ServerStatusEnum,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import { emitter } from "src/utils/emitter";
import router from "src/router";
import { useErrorHandler } from "src/utils/error-handler";
import { useUserStore } from "stores/userStore";
import { ServerPermissionPermissionEnum } from "@mypvp/userserver-api-client-browser/models/ServerPermission";

export const useServerStore = defineStore("server", () => {
  const serverApi = new ServersApi(apiConfig);
  const serverExtensionsApi = new ServerExtensionsApi(apiConfig);
  const serverPermissionsApi = new ServerPermissionsApi(apiConfig);

  const { handleError } = useErrorHandler();
  const userStore = useUserStore();

  const archivedStatusList: ServerStatusEnum[] = [
    "ARCHIVED",
    "RESTORING",
    "ARCHIVING",
  ];

  const server = ref<Server | undefined>(undefined);
  const serverPlugins = ref<SpigotPlugin[] | undefined>(undefined);
  const serverPermissions = ref<ServerPermission[] | undefined>(undefined);
  const isServerArchived = computed<boolean>(() => {
    if (!server.value) return false;

    return archivedStatusList.includes(server.value.status);
  });

  emitter.on("USERSERVER_PERMISSION_ADDED", (event) => {
    if (isEventForCurrentServer(event) && server.value) {
      server.value.permissions.push(
        JSON.parse(event.attributes.permission) as ServerPermission
      );
    }
  });

  emitter.on("USERSERVER_PERMISSION_REMOVED", (event) => {
    if (isEventForCurrentServer(event) && server.value) {
      const deletePermissionDto: DeleteServerPermissionDto = JSON.parse(
        event.attributes.permission
      ) as DeleteServerPermissionDto;

      if (deletePermissionDto.permission) {
        server.value.permissions = server.value.permissions.filter(
          (permission) =>
            deletePermissionDto.permission !== permission.permission ||
            permission.userUuid !== deletePermissionDto.userUuid
        );
      } else {
        server.value.permissions = server.value.permissions.filter(
          (permission) => permission.userUuid !== deletePermissionDto.userUuid
        );
      }
    }
  });

  emitter.on("USERSERVER_UPDATED", (event) => {
    if (!event.scope) return;

    if (!server.value) return;

    if (server.value.id === +event.scope) {
      const changes = JSON.parse(event.attributes.changes) as EditServerDto;

      server.value = {
        ...server.value,
        ...changes,
      };
    }
  });

  emitter.on("USERSERVER_STATUS_CHANGED", (event) => {
    if (!event.scope) return;

    if (!server.value) return;

    if (server.value.id === +event.scope) {
      server.value.status = event.attributes.status as Server["status"];
    }
  });

  emitter.on("USERSERVER_EXTENSION_INSTALLED", (event) => {
    if (!event.scope) return;

    if (+event.scope !== server.value?.id) {
      return;
    }

    loadServerPlugins(event.scope).catch(handleError);
  });

  emitter.on("USERSERVER_EXTENSION_UNINSTALLED", (event) => {
    if (!event.scope) return;

    if (+event.scope !== server.value?.id) {
      return;
    }

    loadServerPlugins(event.scope).catch(handleError);
  });

  emitter.on("FILE_CREATED", (event) => {
    if (!event.scope) return;
    if (!event.attributes.path) return;
    if (+event.scope !== server.value?.id) {
      return;
    }
    if (!event.attributes.path.startsWith(`/${event.scope}/plugins`)) return;

    loadServerPlugins(event.scope).catch(handleError);
  });

  emitter.on("FILE_UPDATED", (event) => {
    if (!event.scope) return;
    if (!event.attributes.path) return;
    if (+event.scope !== server.value?.id) {
      return;
    }
    if (!event.attributes.path.startsWith(`/${event.scope}/plugins`)) return;

    loadServerPlugins(event.scope).catch(handleError);
  });

  emitter.on("FILE_DELETED", (event) => {
    if (!event.scope) return;
    if (!event.attributes.path) return;
    if (+event.scope !== server.value?.id) {
      return;
    }

    if (!event.attributes.path.startsWith(`/${event.scope}/plugins`)) return;

    loadServerPlugins(event.scope).catch(handleError);
  });

  emitter.on("FILE_RENAMED", (event) => {
    if (!event.scope) return;
    if (!event.attributes.path) return;
    if (+event.scope !== server.value?.id) {
      return;
    }
    if (!event.attributes.path.startsWith(`/${event.scope}/plugins`)) return;

    loadServerPlugins(event.scope).catch(handleError);
  });

  function isEventForCurrentServer(event: Event) {
    if (!event.scope) return false;

    return server.value?.id === +event.scope;
  }

  async function loadServerById(serverId: string | number) {
    server.value = await serverApi.getServerById(serverId.toString());
  }

  async function startServer(serverId: string | number) {
    await serverApi.startServer(serverId.toString());
  }

  async function stopServer(serverId: string | number, restart: boolean) {
    await serverApi.stopServer(serverId.toString(), restart);
  }

  async function restoreServer(serverId: string | number) {
    await serverApi.restoreServer(serverId.toString());
  }

  async function deleteServer(serverId: string | number) {
    await new ServersApi(apiConfig).deleteServer(serverId.toString());
  }

  async function resetServer(serverId: string | number) {
    await new ServersApi(apiConfig).resetServer(serverId.toString());
  }
  async function createServer(
    createServerDto: CreateServerDto
  ): Promise<Server> {
    return await serverApi.createServer(createServerDto);
  }

  async function updateServer(
    serverId: string | number,
    updateServerDto: EditServerDto
  ) {
    server.value = await serverApi.editServer(
      serverId.toString(),
      updateServerDto
    );
  }

  async function loadServerPlugins(serverId: string | number) {
    serverPlugins.value = await serverExtensionsApi.getServerSpigotPlugins(
      serverId.toString()
    );
  }

  async function installExtension(
    serverId: string | number,
    extensionVersionId: number
  ) {
    await serverExtensionsApi.installExtension(
      extensionVersionId,
      true,
      serverId.toString()
    );
  }

  async function deleteExtension(
    serverId: string | number,
    extensionVersionId: number
  ) {
    await serverExtensionsApi.deleteExtension(
      extensionVersionId,
      serverId.toString()
    );
  }

  async function addPermission(
    serverId: string | number,
    serverPermission: CreateServerPermissionDto
  ) {
    await new ServerPermissionsApi(apiConfig).createServerPermission(
      serverId.toString(),
      serverPermission
    );
  }

  async function deletePermission(
    serverId: string | number,
    serverPermission: DeleteServerPermissionDto
  ) {
    await serverPermissionsApi.deleteServerPermission(
      serverId.toString(),
      serverPermission
    );
  }

  function isServerLoaded() {
    if (server.value === undefined) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (router) {
      const currentServerId = router.currentRoute.value.params.serverId;

      if (currentServerId) {
        return server.value.id === +currentServerId;
      }
    }

    return !!server.value;
  }

  function hasServerPermission(
    permission: ServerPermissionPermissionEnum | "OWNER"
  ): boolean {
    if (!server.value) return false;

    const user = userStore.user;

    if (!user) return false;

    if (server.value.ownerUuid === user.uuid) {
      return true;
    } else if (permission === "OWNER") {
      return false;
    }

    return !!server.value.permissions.find(
      (serverPermission) =>
        serverPermission.permission === permission &&
        user.uuid === serverPermission.userUuid
    );
  }

  return {
    server,
    serverPlugins,
    serverPermissions,
    loadServerById,
    deletePermission,
    addPermission,
    deleteExtension,
    installExtension,
    loadServerPlugins,
    startServer,
    stopServer,
    resetServer,
    restoreServer,
    createServer,
    isServerLoaded,
    updateServer,
    deleteServer,
    hasServerPermission,
    isServerArchived,
    archivedStatusList,
  };
});
