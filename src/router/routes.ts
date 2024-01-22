import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: {
      name: "PrivateUserserverList",
    },
  },
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    redirect: {
      name: "AdminExtensionList",
    },
    children: [
      {
        path: "extensions",
        redirect: {
          name: "AdminExtensionList",
        },
        children: [
          {
            path: "list",
            name: "AdminExtensionList",
            component: () => import("pages/admin/AdminExtensionList.vue"),
            meta: { requiresAuth: true },
          },
        ],
      },
    ],
  },
  {
    path: "/user",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "servers",
        name: "PrivateUserserverList",
        component: () => import("pages/userserver/PrivateUserserverList.vue"),
        meta: { requiresAuth: true, fetchPrivateUserservers: true },
      },
      {
        path: "domains",
        name: "PrivateDomainList",
        component: () => import("pages/domains/UserDomainList.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "notLoggedIn",
        name: "NotLoggedIn",
        component: () => import("pages/auth/NotLoggedIn.vue"),
      },
      {
        path: "minecraftAccountIsNoConnected",
        name: "MinecraftAccountIsNoConnected",
        component: () =>
          import("pages/auth/MinecraftAccountIsNotConnected.vue"),
      },
      {
        path: "token/:token",
        name: "TokenAuth",
        component: () => import("pages/auth/NotLoggedIn.vue"),
      },
      {
        path: "oauth",
        name: "OAuthCB",
        redirect: "",
      },
    ],
  },

  {
    path: "/server/:serverId",
    component: () => import("layouts/ServerLayout.vue"),
    meta: { requiresAuth: true, fetchServer: true },
    children: [
      {
        path: "",
        redirect: {
          name: "ServerOverview",
        },
      },
      {
        path: "settings",
        name: "ServerSettingsOverview",
        component: () => import("pages/userserver/ServerSettingsOverview.vue"),
        meta: { requiresAuth: true, fetchServer: true },
      },
      {
        path: "settings/:filename/:versionIndex",
        name: "ServerSettings",
        component: () => import("pages/userserver/ServerSettings.vue"),
        meta: { requiresAuth: true, fetchServer: true },
      },
      {
        path: "console",
        name: "ServerConsole",
        component: () => import("pages/userserver/ServerConsole.vue"),
        meta: { requiresAuth: true, fetchServer: true },
      },
      {
        path: "overview",
        name: "ServerOverview",
        component: () => import("pages/userserver/ServerOverview.vue"),
        meta: { requiresAuth: true, fetchServer: true },
      },
      {
        path: "plugins",
        name: "ServerPlugins",
        component: () => import("pages/userserver/ServerPlugins.vue"),
        meta: {
          requiresAuth: true,
          fetchServer: true,
          fetchServerPlugins: true,
        },
      },
      {
        path: "files",
        component: () => import("pages/PassThrough.vue"),
        children: [
          {
            path: "",
            redirect: {
              name: "ServerFiles",
            },
          },
          {
            path: "list",
            name: "ServerFiles",
            component: () => import("pages/server-files/ServerFiles.vue"),
            meta: { requiresAuth: true, fetchServer: true },
          },
          {
            path: "edit",
            name: "FileEditor",
            component: () => import("pages/server-files/ServerFileEditor.vue"),
            meta: { requiresAuth: true, fetchServer: true },
          },
        ],
      },
      {
        path: "permissions",
        component: () => import("pages/userserver/ServerPermissions.vue"),
        name: "ServerPermissions",
      },
      {
        path: "stats",
        name: "ServerStats",
        component: () => import("pages/userserver/ServerStats.vue"),
        meta: { requiresAuth: true, fetchServer: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
