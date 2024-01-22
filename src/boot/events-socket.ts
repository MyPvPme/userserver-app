import io, { Socket } from "socket.io-client";
import { boot } from "quasar/wrappers";
import { useConfigStore } from "src/stores/configStore";
import { Event } from "@mypvp/userserver-api-client-browser";
import { emitter } from "src/utils/emitter";

let socketInstance: Socket;

export default boot(() => {
  const config = useConfigStore();

  const socket = io(config.getConfig().API_SOCKET_URL + "events", {
    path: config.getConfig().API_SOCKET_PATH,
    autoConnect: false,
  });

  socket.on("event", (event: Event) => {
    emitter.emit(event.type, event);
  });

  socketInstance = socket;
});

export { socketInstance };
