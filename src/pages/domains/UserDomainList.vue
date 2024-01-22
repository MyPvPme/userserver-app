<template>
  <q-page class="mypvp-layout-boundary">
    <div class="row justify-between q-pb-md">
      <h4>{{ t("user.private-domains") }}</h4>

      <q-btn
        icon="las la-plus"
        color="positive"
        flat
        @click="registerDomainRecord"
      />
    </div>

    <q-table :columns="columns" :rows="domains" flat>
      <template #body-cell-actions="props">
        <q-td auto-width :props="props">
          <q-btn
            flat
            icon="las la-exchange-alt"
            color="positive"
            @click="transferDomainRecord(props.row.id)"
          />

          <q-btn
            flat
            icon="las la-trash"
            color="negative"
            @click="deleteDomainRecord(props.row.id)"
          />
        </q-td>
      </template>

      <template #body-cell-server="props">
        <q-td :props="props">
          <div v-if="props.row.connectedServerId">
            <userserver-popup :server-id="props.row.connectedServerId" />
            <q-btn
              flat
              icon="las la-ban"
              size="12px"
              color="negative"
              @click="disconnectDomainRecord(props.row.id)"
            />
          </div>
          <div v-else>
            <q-btn
              icon="las la-plug"
              label="Mit Server verbinden"
              flat
              color="primary"
              dense
              @click="connectToServer(props.row.id)"
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";

import UserserverPopup from "components/userserver/UserserverPopup.vue";
import { QTable, useQuasar } from "quasar";
import RegisterDomain from "components/domains/RegisterDomain.vue";
import { useUserStore } from "src/stores/userStore";
import { ServerDomainRecord } from "@mypvp/userserver-api-client-browser";
import { useI18n } from "vue-i18n";
import ConnectDomain from "components/domains/ConnectDomain.vue";
import { useDomainStore } from "stores/domainStore";
import { useErrorHandler } from "src/utils/error-handler";
import TransferDomain from "components/domains/TransferDomain.vue";

const quasar = useQuasar();
const userStore = useUserStore();
const domainStore = useDomainStore();
const { t } = useI18n();
const { handleError } = useErrorHandler();

const columns: QTable["columns"] = [
  {
    name: "record",
    label: "Subdomain",
    field: "record",
    align: "left",
    sortable: true,
  },
  {
    name: "domain",
    label: "Domain",
    field: (row: ServerDomainRecord) => row.domain.domain,
    align: "left",
    sortable: true,
  },
  {
    name: "server",
    label: "Server",
    align: "left",
    field: (row: ServerDomainRecord) => row.connectedServerId,
  },
  {
    name: "actions",
    field: "actions",
    label: "",
    align: "left",
    sortable: false,
  },
];

const domains = computed(() => userStore.domainRecords);

onMounted(async () => {
  await userStore.loadDomainRecordsOfUser();
});

function registerDomainRecord() {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: RegisterDomain,
  });
}

function connectToServer(id: number) {
  quasar.dialog({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ConnectDomain,
    componentProps: {
      domainRecordId: id,
    },
  });
}

function disconnectDomainRecord(id: number) {
  quasar
    .dialog({
      title: t("userserver.domains.disconnect-dialog.title"),
      message: t("userserver.domains.disconnect-dialog.message"),
      cancel: t("cancel"),
      ok: t("userserver.domains.disconnect"),
    })
    .onOk(() => {
      domainStore.disconnectDomainRecord(id).catch(handleError);
    });
}

function deleteDomainRecord(id: number) {
  quasar
    .dialog({
      title: t("userserver.domains.delete-sub-domain-dialog.title"),
      message: t("userserver.domains.delete-sub-domain-dialog.message"),
      cancel: t("cancel"),
      ok: t("delete"),
    })
    .onOk(() => {
      domainStore.deleteDomainRecord(id).catch(handleError);
    });
}

function transferDomainRecord(id: number) {
  quasar.dialog({
    component: TransferDomain,
    componentProps: {
      domainRecordId: id,
    },
  });
}
</script>

<style scoped></style>
