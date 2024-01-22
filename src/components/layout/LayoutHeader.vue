<template>
  <div>
    <q-header id="header" elevated>
      <q-toolbar>
        <img
          id="logo"
          alt="logo"
          :src="
            $q.dark.isActive
              ? 'https://cdn.mypvp.me/myserver/logo_50x.png'
              : 'https://cdn.mypvp.me/myserver/logo_dark_50x.png'
          "
        />

        <div v-if="!$q.screen.lt.md" class="row">
          <div v-for="link in links" :key="link.name" class="link-container">
            <router-link
              v-if="isLoggedIn && isItemAbleToView(link)"
              class="link mypvp-text-color"
              active-class="link-active"
              :to="link.to"
            >
              {{ link.name }}
            </router-link>
          </div>
        </div>

        <q-space />

        <q-btn
          v-if="$q.screen.lt.md"
          flat
          icon="las la-bars"
          class="mypvp-text-color"
          @click="mobileDrawer = true"
        />

        <div v-else class="user-items-container">
          <q-btn v-if="isLoggedIn" round flat>
            <q-avatar round>
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
          <q-btn
            id="color-theme-switch"
            :icon="$q.dark.isActive ? 'las la-sun' : 'las la-moon'"
            flat
            round
            size="16.33px"
            class="mypvp-text-color"
            @click="toggleDarkMode"
          />
        </div>
      </q-toolbar>

      <q-separator v-if="$q.screen.lt.md && hasSubMenu" />
      <q-toolbar v-if="$q.screen.lt.md && hasSubMenu">
        <q-btn
          icon="sym_o_dock_to_right"
          flat
          class="mypvp-text-color"
          @click="drawer = true"
        />

        <div v-if="pageTitle" class="text-uppercase text-subtitle1">
          {{ i18n.t(pageTitle) }}
        </div>
      </q-toolbar>
    </q-header>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { useHasePermission } from "src/mixins/has-permission";
import { useUserStore } from "src/stores/userStore";
import { DrawerItemProp } from "components/layout/DrawerItem.vue";
import { useRouter } from "vue-router";
import { useLayoutStore } from "stores/layoutStore";
import { storeToRefs } from "pinia";

defineProps<{
  hasSubMenu?: boolean;
}>();

const i18n = useI18n();
const quasar = useQuasar();
const { hasPermission } = useHasePermission();
const userStore = useUserStore();
const router = useRouter();
const { mobileDrawer, drawer, pageTitle } = storeToRefs(useLayoutStore());

const isLoggedIn = computed(() => !!userStore.user);
const user = computed(() => userStore.user);
const links = reactive([
  {
    name: i18n.t("userserver.my-server"),
    to: { name: "PrivateUserserverList" },
  },
  {
    name: i18n.t("userserver.my-domains"),
    to: { name: "PrivateDomainList" },
  },
  {
    name: i18n.t("userserver.admin"),
    to: { name: "AdminExtensionList" },
    permission: "userserver.admin.panel",
  },
]);

async function logout() {
  userStore.logout();
  await router.replace("/");
}

function toggleDarkMode() {
  quasar.dark.toggle();
  quasar.localStorage.set("dark", quasar.dark.mode);
}
function isItemAbleToView(item: DrawerItemProp): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!item.permission) return true;

  if (!user.value) return false;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
  return hasPermission(user.value.permissions, item.permission);
}
</script>

<style scoped lang="scss">
.body--dark #header {
  background-color: #232323;
}

.body--light #header {
  background-color: white;
}

#logo {
  height: 40px;
  margin: 15px 20px 15px 0;
}

.link {
  font-weight: 800;
  font-size: 13pt;
  text-decoration: none;

  text-transform: uppercase;

  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 23px;
}

.link-active,
.link:hover {
  color: $primary;
}

.link-container {
  text-decoration: none;
}

.link-container--active {
}

.user-items-container > * {
  margin: 0 10px;
}
</style>
