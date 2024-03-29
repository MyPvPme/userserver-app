import { register } from "register-service-worker";
import { Notify } from "quasar";
import { laSyncAltSolid } from "@quasar/extras/line-awesome";

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready(/* registration */) {
    // console.log('Service worker is active.')
  },

  registered(/* registration */) {
    // console.log('Service worker has been registered.')
  },

  cached(/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound(/* registration */) {
    // console.log('New content is downloading.')
  },

  updated() {
    Notify.create({
      color: "negative",
      icon: laSyncAltSolid,
      message: "Updated content is available. Please refresh the page.",
      timeout: 0,
      multiLine: true,
      position: "top",
      actions: [
        {
          label: "Refresh",
          color: "yellow",
          handler: () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            window.location.reload();
          }
        },
        {
          label: "Dismiss",
          color: "white",
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          handler: () => {}
        }
      ]
    });
  },

  offline() {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  error(/* err */) {
    // console.error('Error during service worker registration:', err)
  }
});
