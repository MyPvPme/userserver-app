import {
  EventTypeEnum,
  ServerStatusEnum,
} from "@mypvp/userserver-api-client-browser";
import { QNotifyCreateOptions } from "quasar";
import { MessageSchema } from "boot/i18n";
import { PickupPaths } from "@intlify/core-base";
import { Event } from "@mypvp/userserver-api-client-browser";

export const notifications: Partial<
  Record<
    EventTypeEnum,
    (
      event: Event
    ) => QNotifyCreateOptions & { message: PickupPaths<MessageSchema> | string }
  >
> = {
  USERSERVER_STATUS_CHANGED: (event) => ({
    message:
      "userserver.notifications.status." +
      event.attributes.status.toLowerCase(),
    type: getTypeFromStatus(event.attributes.status as ServerStatusEnum),
  }),
};

function getTypeFromStatus(status: ServerStatusEnum): string {
  switch (status) {
    case "STARTING":
    case "ONLINE":
      return "positive";
    case "ARCHIVING":
    case "OFFLINE":
    case "STOPPING":
    case "ARCHIVED":
      return "negative";
    default:
      return "negative";
  }
}
