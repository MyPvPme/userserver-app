import mitt from "mitt";
import { Event } from "@mypvp/userserver-api-client-browser";

export const emitter = mitt<Record<Event["type"], Event>>();
