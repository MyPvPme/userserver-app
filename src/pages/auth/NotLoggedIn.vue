<template>
  <q-page class="mypvp-layout-boundary row justify-center">
    <div id="not-logged-in-container">
      <q-card class="q-mb-md q-px-lg q-pt-md" flat>
        <q-card-section class="text-center text-bold text-h4 text-uppercase">
          {{ t("auth.not-logged-in.introduction.title") }}
        </q-card-section>

        <q-card-section class="text-justify text-h6">
          {{ t("auth.not-logged-in.introduction.subtitle") }}
        </q-card-section>

        <q-card-section class="text-h6 text-justify">
          <i18n-t keypath="auth.not-logged-in.login-link.explanation" tag="p">
            <template #address><mc-suggestion suggest="MyPvP.me" /></template>
            <template #command
              ><mc-suggestion suggest="/myserver panel"
            /></template>
          </i18n-t>
        </q-card-section>
      </q-card>
      <q-card class="q-pa-md" flat>
        <q-card-section class="text-h5 text-center">
          {{ t("auth.not-logged-in.login-forum.title") }}
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn
            unelevated
            rounded
            size="lg"
            icon="las la-external-link-alt"
            :href="getHref()"
            color="primary"
            class="q-px-lg text-bold"
          >
            {{ t("auth.not-logged-in.login-forum.button") }}
          </q-btn>
        </q-card-section>
        <q-card-section class="text-center text-subtitle1">
          {{ t("auth.not-logged-in.login-forum.disclaimer") }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { mypvpConfig, oauthClient } from "boot/oauth";
import * as oauth2 from "oauth4webapi";
import { useQuasar } from "quasar";
import McSuggestion from "components/layout/McSuggestion.vue";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const quasar = useQuasar();
const { t } = useI18n();
const route = useRoute();

const codeVerifier = ref<string>("");
const codeChallenge = ref<string>("");
const state = ref<string>("");

onMounted(async () => {
  const newCodeVerifier = oauth2.generateRandomCodeVerifier();
  state.value = oauth2.generateRandomState();
  codeChallenge.value = await oauth2.calculatePKCECodeChallenge(
    newCodeVerifier
  );
  quasar.sessionStorage.set("code_verifier", newCodeVerifier);
  quasar.sessionStorage.set("state", state.value);
  codeVerifier.value = newCodeVerifier;

  if (route.query.forceForumAuth) {
    window.open(getHref(), "_self");
  }
});

function getHref() {
  if (!mypvpConfig.authorization_endpoint) return "";

  const authorizationUrl = new URL(mypvpConfig.authorization_endpoint);
  authorizationUrl.searchParams.set("client_id", oauthClient.client_id);
  authorizationUrl.searchParams.set("code_challenge", codeChallenge.value);
  authorizationUrl.searchParams.set("code_challenge_method", "S256");
  authorizationUrl.searchParams.set(
    "redirect_uri",
    location.origin + "/auth/oauth"
  );
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid profile offline_access");
  authorizationUrl.searchParams.set("state", state.value);

  return authorizationUrl.href;
}
</script>

<style scoped>
#not-logged-in-container {
  max-width: 600px;
}
</style>
