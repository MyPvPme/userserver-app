<template>
  <div class="q-pt-sm q-pb-md">
    <preview-badge v-if="preview" font-size="12px" />
    <h4 v-if="!$q.screen.lt.md" class="text-weight-bolder">
      {{ t(pageTitle) }}{{ subTitle ? ": " + subTitle : "" }}
    </h4>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from "stores/layoutStore";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import PreviewBadge from "components/common/PreviewBadge.vue";

defineProps<{
  subTitle?: string;
  preview?: boolean;
}>();

const { pageTitle } = storeToRefs(useLayoutStore());
const { t } = useI18n();
</script>

<style scoped></style>
