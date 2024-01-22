<template>
  <q-page>
    <page-title />

    <div id="console-wrapper">
      <div id="console" />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { io, Socket } from "socket.io-client";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { getToken } from "boot/api-client";
import { computed, onMounted } from "vue";
import { useServerStore } from "src/stores/serverStore";
import { useConfigStore } from "src/stores/configStore";
import { useI18n } from "vue-i18n";
import { useErrorHandler } from "src/utils/error-handler";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import PageTitle from "components/layout/PageTitle.vue";
import { useLayoutStore } from "stores/layoutStore";

const serverStore = useServerStore();
const configStore = useConfigStore();
const i18n = useI18n();
const quasar = useQuasar();
const router = useRouter();
const { handleError } = useErrorHandler();
const layoutStore = useLayoutStore();

let socket: Socket;
let serverConsole: Terminal;

const serverDetails = computed(() => serverStore.server);
const config = computed(() => configStore.getConfig());

onMounted(() => {
  layoutStore.pageTitle = "userserver.console";
});

onMounted(async () => {
  serverConsole = new Terminal({
    theme: {
      background: "#232323",
    },
    fontFamily: "Consolas",
  });

  const fitAddon = new FitAddon();
  serverConsole.loadAddon(fitAddon);

  const consoleElement = document.getElementById("console");

  if (consoleElement) serverConsole.open(consoleElement);

  fitAddon.fit();

  socket = io(config.value.API_SOCKET_URL + "console", {
    path: config.value.API_SOCKET_PATH,
    autoConnect: false,
  });

  socket.io.opts.extraHeaders = {
    Authorization: `Bearer ${await getToken()}`,
  };
  socket.connect();

  socket.on("connect", () => {
    socket.emit("identity", 0);
    socket.emit("connectConsole", {
      height: serverConsole.rows,
      width: serverConsole.cols,
      serverIdOrAlias: `${serverDetails.value?.id ?? ""}`,
    });
  });

  serverConsole.onData((data) => {
    switch (data.charCodeAt(0)) {
      // ^C
      case 3:
        break;
      default:
        socket.emit("consoleInput", data);
    }
  });

  socket.on("error", (response: Error) => {
    handleError(response);
  });
  socket.on("consoleOutput", (data: Iterable<number>) => {
    serverConsole.write(Uint8Array.from(data));
  });

  socket.on("exception", (response: { message?: string }) => {
    switch (response.message) {
      case "Server is not Online":
        quasar.notify({
          message: i18n.t("userserver.not-online").toString(),
          color: "negative",
        });
        router
          .replace({
            name: "ServerOverview",
          })
          .catch(handleError);
        break;
      case "Internal server error":
        quasar.notify({
          message: i18n
            .t("userserver.error.could-not-connect-to-console")
            .toString(),
          color: "negative",
        });
        router
          .replace({
            name: "ServerOverview",
          })
          .catch(handleError);
        break;
    }
  });
  serverConsole.focus();
});
</script>

<style scoped></style>
