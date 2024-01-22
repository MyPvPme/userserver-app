<template>
  <q-footer class="bg-transparent justify-end q-pa-sm">
    <q-breadcrumbs separator="•" separator-color="default" align="right">
      <q-breadcrumbs-el
        href="https://mypvp.me/index.php?legal-notice/"
        target="_blank"
        class="mypvp-external-link"
        >{{ t("layout.imprint") }}</q-breadcrumbs-el
      >
      <q-breadcrumbs-el
        href="https://mypvp.me/index.php?datenschutzerklaerung/"
        target="_blank"
        class="mypvp-external-link"
        >{{ t("layout.privacy") }}</q-breadcrumbs-el
      >
    </q-breadcrumbs>
  </q-footer>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped></style>
