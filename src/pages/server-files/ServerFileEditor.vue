<template>
  <q-page class="q-mt-sm full-height">
    <div class="row justify-between">
      <div>
        <q-btn
          class="action-button"
          rounded
          :label="t('back')"
          icon="las la-angle-left"
          color="negative"
          text-color="white"
          unelevated
          @click="$router.back()"
        />
        <q-btn
          v-if="!readOnly"
          rounded
          :label="t('save')"
          icon="las la-save"
          color="positive"
          class="q-ml-sm action-button"
          unelevated
          @click="save"
        />
      </div>

      <q-btn
        v-if="isLogFile"
        rounded
        color="info"
        :label="t('userserver.logs.analyse')"
        icon="las la-binoculars"
        @click="analyseLogFile"
      />
    </div>
    <q-card id="editor-card" class="q-mt-sm" flat bordered>
      <div id="editor" />
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { editor, MarkerSeverity, Uri } from "monaco-editor";
import * as pako from "pako";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useFileStore } from "src/stores/fileStore";
import { useErrorHandler } from "src/utils/error-handler";

const quasar = useQuasar();
const router = useRouter();
const i18n = useI18n();
const { handleError } = useErrorHandler();
const fileStore = useFileStore();
const { t } = useI18n();

const readOnlyExtensions = [".gz"];
let monacoEditor: editor.IStandaloneCodeEditor;

const readOnly = ref(false);
const code = ref<string>("");
const path = ref<string>("");
const edited = ref(false);

watch(
  () => quasar.dark.isActive,
  () => {
    editor.setTheme(quasar.dark.isActive ? "vs-dark" : "vs");
  }
);

const isLogFile = computed(() => {
  if (!path.value) return false;

  return path.value.endsWith(".log") || path.value.endsWith(".log.gz");
});

onMounted(async () => {
  window.scrollTo({ top: 0 });

  quasar.loading.show();
  try {
    path.value = router.currentRoute.value.query.path as string;
    const loadedCode = await fileStore.getFile(path.value);

    code.value = await filePreprocessor(loadedCode);

    const filename = path.value.split("/").pop() ?? "";

    readOnly.value = readOnlyExtensions.some((ext) => filename.endsWith(ext));

    const editorElement = document.getElementById("editor");

    if (!editorElement) {
      return;
    }
    monacoEditor = editor.create(editorElement, {
      codeLens: false,
      minimap: {
        enabled: false,
      },
      model: editor.createModel(code.value, undefined, Uri.file(filename)),
      automaticLayout: true,
      theme: quasar.dark.isActive ? "vs-dark" : "vs",
      scrollBeyondLastLine: false,
      readOnly: readOnly.value,
    });
  } finally {
    quasar.loading.hide();
  }
});

onBeforeUnmount(() => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!monacoEditor) return;

  monacoEditor.getModel()?.dispose();
  monacoEditor.dispose();
});

async function filePreprocessor(content: Blob): Promise<string> {
  if (path.value.endsWith(".gz")) {
    return pako.inflate(await content.arrayBuffer(), { to: "string" });
  }

  return await content.text();
}

async function analyseLogFile() {
  const uploadResult = (await fetch("https://api.mclo.gs/1/log ", {
    method: "POST",
    body: "content=" + encodeURIComponent(code.value),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  }).then((res) => res.json())) as { id: string };

  const result = (await fetch(
    "https://api.mclo.gs/1/insights/" + uploadResult.id
  ).then((res) => res.json())) as {
    id: string;
    name: string;
    version: string;
    title: string;
    analysis: {
      problems: {
        message: string;
        counter: number;
        entry: {
          level: number;
          time?: string;
          prefix: string;
          lines: { number: number; content: string }[];
        };
        solutions: { message: string }[];
      }[];
    };
  };

  const model = monacoEditor.getModel();

  if (result.analysis.problems.length === 0) {
    quasar.notify({
      color: "positive",
      message: t("userserver.logs.no-problems-found"),
    });

    return;
  }

  if (model)
    editor.setModelMarkers(
      model,
      "log",
      result.analysis.problems.map((problem) => ({
        severity: MarkerSeverity.Error,
        message:
          problem.solutions.length === 0
            ? problem.message
            : problem.message +
              "\nSolutions:\n" +
              problem.solutions.map((value) => value.message).join("\nor\n"),
        startLineNumber: problem.entry.lines[0].number,
        endLineNumber: problem.entry.lines[0].number,
        startColumn: 0,
        endColumn: model.getLineMaxColumn(problem.entry.lines[0].number),
      }))
    );

  monacoEditor.trigger("log", "editor.action.marker.next", undefined);
}

async function save() {
  try {
    await fileStore.saveFile(
      path.value,
      monacoEditor.getValue({
        preserveBOM: false,
        lineEnding: "\n",
      })
    );
    edited.value = false;
    quasar.notify({
      color: "positive",
      message: i18n.t("userserver.files.saved-file"),
    });
  } catch (e) {
    handleError(e, i18n.t("userserver.files.error.save-file"));
  }
}
</script>

<style scoped>
#editor {
  height: 80vh;
}
</style>
