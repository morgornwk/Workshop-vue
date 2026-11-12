<template>
  <div
    class="ca-banner"
    :class="`ca-tone--${normalizedType}`"
    :role="normalizedType === 'error' ? 'alert' : 'status'"
  >
    <span class="ca-ico" aria-hidden="true">
      <AlertIcon :type="normalizedType" />
    </span>

    <div class="ca-banner__body">
      <strong class="ca-banner__title">{{ resolvedTitle }}</strong>
      <p v-if="message" class="ca-banner__msg">{{ message }}</p>
    </div>

    <div v-if="$slots.actions" class="ca-banner__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
import AlertIcon from '@/components/common/AlertIcon.vue'
import { ALERT_META, normalizeAlertType } from '@/utils/alertMeta'

export default {
  name: 'AlertBanner',
  components: { AlertIcon },
  props: {
    type: { type: String, default: 'info' },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
  },
  computed: {
    normalizedType() {
      return normalizeAlertType(this.type)
    },
    resolvedTitle() {
      return this.title || ALERT_META[this.normalizedType].title
    },
  },
}
</script>
