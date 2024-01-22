<template>
  <div>
    <q-input
      v-model="name"
      label="Benutzername"
      :error-message="
        userNotFound ? t('userserver.user-not-found') : errorMessage
      "
      :error="userNotFound || !!errorMessage"
      @input="onInput"
      @blur="getUuidFromName"
    >
      <template v-if="uuid" #prepend>
        <q-img
          :src="`https://visage.surgeplay.com/face/${uuid}`"
          width="30px"
          height="30px"
        />
      </template>
    </q-input>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { UsersApi } from "@mypvp/base-rest-client-browser";
import { baseApiConfig } from "boot/base-api-client";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  modelValue: string | undefined;
  errorMessage: string | undefined;
}>();
const emit = defineEmits(["update:modelValue", "input"]);

const { t } = useI18n();

const uuid = ref<string | undefined>(props.modelValue);
const name = ref<string | undefined>(undefined);
const userNotFound = ref(false);

function onInput() {
  if (userNotFound.value) userNotFound.value = false;

  emit("input");
}

const fetchNameFromUuid = async () => {
  if (!uuid.value) {
    return;
  }
  name.value = await new UsersApi(baseApiConfig).getNameFromUuid(uuid.value);
};

const getUuidFromName = async () => {
  if (!name.value || name.value.length < 3) {
    uuid.value = undefined;
    emit("update:modelValue", uuid.value);
    return;
  }

  try {
    uuid.value = await new UsersApi(baseApiConfig).getUuidFromName(name.value);
    userNotFound.value = false;
  } catch (e) {
    userNotFound.value = true;
    uuid.value = undefined;
  }

  emit("update:modelValue", uuid.value);
};

onMounted(async () => {
  await fetchNameFromUuid();
});
</script>

<style scoped></style>
