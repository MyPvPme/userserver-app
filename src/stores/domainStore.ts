import { defineStore } from "pinia";
import { ref } from "vue";
import {
  ServerDomain,
  ServerDomainsApi,
} from "@mypvp/userserver-api-client-browser";
import { apiConfig } from "boot/api-client";

export const useDomainStore = defineStore("domain", () => {
  const domainsApi = new ServerDomainsApi(apiConfig);

  const domains = ref<ServerDomain[] | undefined>(undefined);

  async function loadDomains(force = false): Promise<void> {
    if (domains.value && !force) {
      return;
    }

    domains.value = await domainsApi.getAllDomains();
  }

  async function registerDomainRecord(
    domainRecord: string,
    domain: number
  ): Promise<void> {
    await domainsApi.registerDomainRecord({
      record: domainRecord,
      domainId: domain,
    });
  }

  async function connectDomainRecord(
    serverIdOrAlias: string,
    domainRecordId: number
  ) {
    await domainsApi.connectDomainRecord(domainRecordId, {
      serverIdOrAlias: serverIdOrAlias,
    });
  }

  async function disconnectDomainRecord(domainRecordId: number) {
    await domainsApi.disconnectDomainRecord(domainRecordId);
  }

  async function deleteDomainRecord(domainRecordId: number) {
    await domainsApi.deleteDomainRecord(domainRecordId);
  }

  async function transferDomainRecord(
    domainRecordId: number,
    receiverUuid: string
  ) {
    await domainsApi.transferDomainRecord(domainRecordId, { receiverUuid });
  }

  return {
    domains,
    loadDomains,
    registerDomainRecord,
    connectDomainRecord,
    deleteDomainRecord,
    transferDomainRecord,
    disconnectDomainRecord,
  };
});
