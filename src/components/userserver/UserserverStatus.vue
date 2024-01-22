<template>
  <div class="row items-center">
    <div
      v-if="!props.noDot"
      id="dot"
      :class="[serverStatus[props.status].colorClass]"
    />
    <a v-if="!props.noText" class="q-ml-xs">
      {{ serverStatus[props.status].text }}
    </a>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  noText: {
    type: Boolean,
    default: false,
  },
  noDot: {
    type: Boolean,
    default: false,
  },
  noGlow: {
    type: Boolean,
    default: false,
  },
});

const serverStatus = computed(() => ({
  ONLINE: {
    text: i18n.t("userserver.status.online"),
    colorClass: props.noGlow ? "bg-green" : "online-dot",
  },
  OFFLINE: {
    text: i18n.t("userserver.status.offline"),
    colorClass: "bg-red",
  },
  STANDBY: {
    text: i18n.t("userserver.status.standby"),
    colorClass: "bg-blue",
  },
  STARTING: {
    text: i18n.t("userserver.status.starting"),
    colorClass: "bg-light-green",
  },
  STOPPING: {
    text: i18n.t("userserver.status.stopping"),
    colorClass: "bg-deep-orange",
  },
  MAINTENANCE: {
    text: i18n.t("userserver.status.maintenance"),
    colorClass: "bg-orange",
  },
  QUEUED: {
    text: i18n.t("userserver.status.maintenance"),
    colorClass: "bg-purple",
  },
  ARCHIVED: {
    text: i18n.t("userserver.status.archived"),
    colorClass: "archived",
  },
  ARCHIVING: {
    text: i18n.t("userserver.status.archiving"),
    colorClass: "archiving",
  },
  RESTORING: {
    text: i18n.t("userserver.status.restoring"),
    colorClass: "restoring",
  },
}));
</script>

<style scoped type="scss">
#dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
}

.archiving {
  background: #2d86e3;
}

.restoring {
  background: #2d86e3;
}

.archived {
  background-color: #295acc;
}

.online-dot {
  background-color: #4caf50;
  box-shadow: 0 0 0 rgba(76, 175, 80, 0.5);
  animation: online-dot-glow 2s infinite;
}
@keyframes online-dot-glow {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.5);
    -moz-box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.5);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.5);
  }

  70% {
    -webkit-box-shadow: 0 0 0 7px rgba(76, 175, 80, 0);
    -moz-box-shadow: 0 0 0 7px rgba(76, 175, 80, 0);
    box-shadow: 0 0 0 7px rgba(76, 175, 80, 0);
  }

  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    -moz-box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}
</style>
