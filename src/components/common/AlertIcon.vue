<template>
  <svg viewBox="0 0 24 24" class="ca-svg" aria-hidden="true">
    <path :d="pathData" />
  </svg>
</template>

<script>
import { ALERT_ICON_PATHS } from '@/utils/alertMeta'

export default {
  name: 'AlertIcon',
  props: {
    type: { type: String, default: 'info' },
  },
  computed: {
    pathData() {
      return ALERT_ICON_PATHS[this.type] || ALERT_ICON_PATHS.info
    },
  },
}
</script>
