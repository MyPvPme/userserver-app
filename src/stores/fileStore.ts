import { defineStore } from "pinia";
import { ref } from "vue";
import { FilesApi, ReturnFileDto } from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";
import { useRouter } from "vue-router";
import { HttpFile } from "@mypvp/userserver-api-client-browser/http/http";
import { useServerStore } from "src/stores/serverStore";
import { emitter } from "src/utils/emitter";
import { useErrorHandler } from "src/utils/error-handler";

export const useFileStore = defineStore("file", () => {
  const router = useRouter();
  const serverStore = useServerStore();
  const { handleError } = useErrorHandler();

  const filesApi = new FilesApi(apiConfig);

  const path = ref<string>("");
  const files = ref<ReturnFileDto[] | undefined>(undefined);

  emitter.on("*", (type, event) => {
    switch (type) {
      case "FILE_CREATED":
      case "FILE_UPDATED":
      case "FILE_DELETED":
      case "FILE_RENAMED":
      case "FOLDER_CREATED":
      case "FOLDER_DELETED":
      case "USERSERVER_EXTENSION_INSTALLED":
        if (serverStore.server?.id.toString() === event.scope)
          loadFiles(path.value).catch(handleError);
    }
  });

  async function loadFiles(loadPath: string) {
    files.value = await filesApi.getFiles(
      router.currentRoute.value.params.serverId as string,
      loadPath
    );

    path.value = loadPath;
  }

  function getFile(path: string): Promise<HttpFile> {
    return filesApi.getFile(
      router.currentRoute.value.params.serverId as string,
      undefined,
      path
    );
  }

  function getFolder(path: string): Promise<HttpFile> {
    return filesApi.getFolder(
      router.currentRoute.value.params.serverId as string,
      path
    );
  }

  function saveFile(path: string, body: HttpFile | string) {
    return filesApi.updateFile(
      router.currentRoute.value.params.serverId as string,
      body as HttpFile,
      path
    );
  }

  async function deleteFile(path: string) {
    await filesApi.deleteFile(
      router.currentRoute.value.params.serverId as string,
      path
    );
  }

  async function deleteFolder(path: string) {
    await filesApi.deleteFolder(
      router.currentRoute.value.params.serverId as string,
      path
    );
  }

  async function createFolder(folderPath: string) {
    await filesApi.createFolder(
      router.currentRoute.value.params.serverId as string,
      folderPath
    );
    await loadFiles(path.value);
  }

  async function createFile(filePath: string) {
    await filesApi.createFile(
      router.currentRoute.value.params.serverId as string,
      filePath
    );

    await loadFiles(path.value);
  }

  async function renameFile(filePath: string, name: string) {
    await filesApi.renameFile(
      router.currentRoute.value.params.serverId as string,
      { name },
      filePath
    );
    await loadFiles(path.value);
  }

  async function renameFolder(folderPath: string, name: string) {
    await new FilesApi(apiConfig).renameFolder(
      router.currentRoute.value.params.serverId as string,
      { name },
      folderPath
    );

    await loadFiles(path.value);
  }

  function getAllowedFilesToCreate(): string[] {
    if (!serverStore.server) {
      return [];
    }

    const permissions = serverStore.server.owner.permissions;

    if (permissions.includes("*")) {
      return ["*"];
    }

    const fileExtensions = [];

    for (const permission of permissions) {
      if (permission.startsWith("userserver.panel.file.create")) {
        const fileExtension = permission.substring(
          "userserver.panel.file.create".length
        );
        if (fileExtension === ".*") {
          return ["*"];
        }
        fileExtensions.push(fileExtension);
      }
    }

    return fileExtensions;
  }

  return {
    files,
    path,

    // Methods
    getAllowedFilesToCreate,
    renameFolder,
    renameFile,
    createFile,
    createFolder,
    deleteFolder,
    deleteFile,
    saveFile,
    getFolder,
    getFile,
    loadFiles,
  };
});
