<template>
  <q-page>
    <page-title :sub-title="currentFile" />
    <q-card flat square bordered>
      <q-list separator>
        <template v-for="value in fileDefinitionValues">
          <number-input
            v-if="value.type === 'number'"
            :key="value.path"
            :value="setting?.getFromPath(value?.path)"
            :path="value.path"
            @new-value="(val) => setValue(value?.path, val)"
          />

          <boolean-input
            v-if="value.type === 'boolean'"
            :key="value.path"
            :value="setting?.getFromPath(value?.path, 'boolean')"
            :path="value.path"
            @new-value="(val) => setValue(value?.path, val)"
          />

          <string-input
            v-if="value.type === 'string'"
            :key="value.path"
            :value="setting?.getFromPath(value?.path)"
            :path="value.path"
            @new-value="(val) => setValue(value?.path, val)"
          />
        </template>
      </q-list>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { YamlSetting } from "src/settings/yaml-setting";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import {
  Definition,
  FileVersion,
  getDefinitionFromFileAndIndex,
} from "src/config-json-definitions";
import { PropertiesSetting } from "src/settings/properties-setting";
import * as Sentry from "@sentry/vue";
import StringInput from "components/configs/StringInput.vue";
import BooleanInput from "components/configs/BooleanInput.vue";
import NumberInput from "components/configs/NumberInput.vue";
import { useFileStore } from "src/stores/fileStore";
import { useErrorHandler } from "src/utils/error-handler";
import { useLayoutStore } from "stores/layoutStore";
import PageTitle from "components/layout/PageTitle.vue";

const quasar = useQuasar();
const route = useRoute();
const fileStore = useFileStore();
const { handleError } = useErrorHandler();
const layoutStore = useLayoutStore();

const setting = ref<YamlSetting | PropertiesSetting | undefined>(undefined);
const fileDefinitionValues = ref<FileVersion["values"]>([]);
const currentFile = ref<string>();

let fileDefinition: Definition | undefined;

const getSetting = (type: "yaml" | "properties", content: string) => {
  switch (type) {
    case "yaml":
      return YamlSetting.parse(content);
    case "properties":
      return PropertiesSetting.parse(content);
  }
};

onMounted(() => {
  layoutStore.pageTitle = "userserver.settings";
});

const loadDefinition = async (
  { filename, versionIndex }: { filename: string; versionIndex: number } = {
    filename: route.params.filename as string,
    versionIndex: +(route.params.versionIndex as string),
  }
) => {
  quasar.loading.show();

  fileDefinition = getDefinitionFromFileAndIndex(filename, versionIndex);

  currentFile.value = filename;

  if (!fileDefinition) return;

  fileDefinitionValues.value = fileDefinition.definition.values;

  try {
    const content = await fileStore.getFile(fileDefinition.file);
    setting.value = getSetting(fileDefinition.type, await content.text());
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    quasar.loading.hide();
  }
};

onMounted(async () => {
  await loadDefinition();
});

onBeforeRouteUpdate(async (to, from) => {
  if (
    to.params.filename !== from.params.filename ||
    from.params.versionIndex !== to.params.versionIndex
  ) {
    await loadDefinition({
      filename: to.params.filename as string,
      versionIndex: +(to.params.versionIndex as string),
    });
  }
});

const setValue = async (path: string, value: string) => {
  if (!setting.value || !fileDefinition) return;

  setting.value.setFromPath(path, value);

  try {
    await fileStore.saveFile(fileDefinition.file, setting.value.toString());
  } catch (e) {
    handleError(e);
  }
};
</script>

<style scoped></style>
