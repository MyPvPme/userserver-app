export const hasPermissionMixin = {
  methods: {
    hasPermission(permissions: string[], checkPermission: string) {
      for (const permission of permissions) {
        if (permission.endsWith("*")) {
          if (checkPermission.startsWith(permission.slice(0, -1))) {
            return true;
          }
        }
        if (permission === checkPermission) {
          return true;
        }
      }
      return false;
    },
  },
};

export function useHasePermission() {
  return {
    hasPermission: (permissions: string[], checkPermission: string) =>
      hasPermissionMixin.methods.hasPermission(permissions, checkPermission),
  };
}
