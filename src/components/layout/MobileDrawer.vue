<template>
  <q-drawer v-model="mobileDrawer" :width="200" elevated side="right">
    <div class="column justify-between fit">
      <q-list padding>
        <template v-if="isLoggedIn">
          <drawer-item v-for="item in items" :key="item.name" :item="item" />
        </template>
      </q-list>

      <div class="row q-mb-sm q-mx-sm justify-end">
        <q-btn
          id="color-theme-switch"
          :icon="$q.dark.isActive ? 'las la-sun' : 'las la-moon'"
          flat
          round
          size="25px"
          class="mypvp-text-color"
          @click="toggleDarkMode"
        />

        <q-btn v-if="isLoggedIn" round flat>
          <q-avatar round size="45px">
            <img
              :src="`https://visage.surgeplay.com/face/${user?.uuid}`"
              :alt="user?.uuid"
              class="q-avatar-img"
            />
          </q-avatar>

          <q-menu square anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable @click="logout()">
                <q-item-section thumbnail>
                  <q-icon name="las la-sign-out-alt" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import DrawerItem, { DrawerItemProp } from "components/layout/DrawerItem.vue";
import { storeToRefs } from "pinia";
import { useLayoutStore } from "stores/layoutStore";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { useUserStore } from "stores/userStore";
import { useQuasar } from "quasar";

const { mobileDrawer } = storeToRefs(useLayoutStore());
const i18n = useI18n();
const userStore = useUserStore();
const quasar = useQuasar();

const isLoggedIn = computed(() => !!userStore.user);
const user = computed(() => userStore.user);

const logout = userStore.logout;

const items: DrawerItemProp[] = [
  {
    icon: "las la-server",
    name: i18n.t("userserver.my-server"),
    to: { name: "PrivateUserserverList" },
  },
  {
    icon: "las la-globe",
    name: i18n.t("userserver.my-domains"),
    to: { name: "PrivateDomainList" },
  },
  {
    icon: "las la-hammer",
    name: i18n.t("userserver.admin"),
    to: { name: "AdminExtensionList" },
    permission: "userserver.admin.panel",
  },
];

function toggleDarkMode() {
  quasar.dark.toggle();
  quasar.localStorage.set("dark", quasar.dark.mode);
}
</script>

<style scoped></style>
