import * as Sentry from "@sentry/browser";
import { Notify } from "quasar";
import { ApiException } from "@mypvp/userserver-api-client-browser";

export function useErrorHandler() {
  function handleError(error: unknown, errorMessage?: string): void {
    Sentry.captureException(error);

    console.error(error);

    if (errorMessage) {
      Notify.create({
        type: "error",
        message: errorMessage,
      });
    }
  }

  function isApiException(
    exception: unknown
  ): exception is ApiException<never> {
    return !!(exception as ApiException<never>).code;
  }

  return {
    handleError,
    isApiException,
  };
}
