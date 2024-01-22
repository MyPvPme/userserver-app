<template>
  <q-page class="mypvp-layout-boundary row justify-center">
    <div id="not-logged-in-container">
      <q-card class="q-mb-md q-px-lg q-pt-md" flat>
        <q-card-section class="text-center text-bold text-h4 text-uppercase">
          {{ t("auth.minecraft-account-is-not-connected.title") }}
        </q-card-section>

        <q-card-section class="text-justify text-h6">
          {{ t("auth.minecraft-account-is-not-connected.subtitle") }}
        </q-card-section>

        <q-card-section class="text-h6 text-justify">
          <q-btn
            icon="las la-link"
            href="https://mypvp.me/account-management/#linkedAccounts"
            target="_blank"
            color="primary"
            :label="t('auth.minecraft-account-is-not-connected.link-account')"
          />

          <q-btn
            class="q-ml-sm"
            icon="las la-sign-in-alt"
            :to="{ name: 'NotLoggedIn', query: { forceForumAuth: true } }"
            color="primary"
            :label="t('auth.minecraft-account-is-not-connected.login-again')"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped></style>
