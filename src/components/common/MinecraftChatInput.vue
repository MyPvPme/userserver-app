<template>
  <q-input
    v-if="isEditMode"
    v-bind="$props"
    ref="input"
    v-model="miniMessage"
    class="mini-message-input"
    :autogrow="autogrow"
    :loading="loading"
    @blur="setEditMode(false)"
  >
  </q-input>
  <q-field
    v-else
    v-bind="$props"
    ref="field"
    :loading="loading"
    @focus="setEditMode(true)"
  >
    <template #control>
      <div ref="chatOutput" />
    </template>
  </q-field>
</template>

<script lang="ts" setup>
import {
  MinecraftChatRender,
  StringComponent,
} from "@mypvp/minecraft-chat-render";
import { nextTick, onMounted, ref, computed, watch } from "vue";
import { QField, QInput } from "quasar";
import { MiniMessageApi } from "@mypvp/base-rest-client-browser";
import { baseApiConfig } from "boot/base-api-client";
import { useConfigStore } from "stores/configStore";
import { useErrorHandler } from "src/utils/error-handler";

const props = defineProps<{
  modelValue: string | null;
  autogrow: boolean | null;
}>();
const emit = defineEmits(["update:modelValue", "updated"]);

const mimiMessageApi = new MiniMessageApi(baseApiConfig);

const configStore = useConfigStore();
const { handleError } = useErrorHandler();

const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
    emit("updated");
  },
});
const json = computed<undefined | StringComponent>(() => {
  if (!modelValue.value) {
    return undefined;
  }

  return JSON.parse(modelValue.value) as StringComponent;
});

const miniMessage = ref("");
const isEditMode = ref<boolean>(false);
const chatOutput = ref<HTMLDivElement>();
const input = ref<QInput>();
const field = ref<QField>();
const loading = ref<boolean>(false);

const render = new MinecraftChatRender();

watch(json, () => {
  loadMiniMessage();
});

onMounted(() => {
  loadMiniMessage();
});

function loadMiniMessage() {
  if (json.value) {
    const divEl = render.render(json.value);
    if (chatOutput.value) {
      chatOutput.value.innerHTML = "";
    }

    chatOutput.value?.append(divEl);
    void mimiMessageApi
      .convertJsonToMiniMessage(json.value)
      .then((value) => (miniMessage.value = value));
  }
}

function setEditMode(mode: boolean) {
  isEditMode.value = mode;

  nextTick(() => {
    if (mode) {
      input.value?.focus();
    } else {
      loading.value = true;

      if (miniMessage.value.length === 0) {
        modelValue.value = null;
        loading.value = false;
        return;
      }

      fetch(
        `${
          configStore.getConfig().BASE_API_URL
        }/base/minimessage/to-json?allow-legacy=true`,
        {
          method: "POST",
          body: miniMessage.value,
        }
      )
        .then((response) => response.json())
        .then((convertResult: StringComponent) => {
          modelValue.value = JSON.stringify(convertResult);

          const divEl = render.render(convertResult);
          chatOutput.value?.append(divEl);
        })
        .catch(handleError)
        .finally(() => {
          loading.value = false;
        });
    }
  }).catch((e) => console.log(e));
}
</script>

<style>
.mini-message-input textarea {
  font-family: "Minecraft Regular";
}

.mini-message-input input {
  font-family: "Minecraft Regular";
}
</style>
