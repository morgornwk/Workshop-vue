<template>
  <div
    class="ca-notice"
    :class="`ca-tone--${normalizedType}`"
    :role="normalizedType === 'error' ? 'alert' : 'status'"
  >
    <span class="ca-ico ca-notice__ico" aria-hidden="true">
      <AlertIcon :type="normalizedType" />
    </span>
    <h2 class="ca-notice__title">{{ title }}</h2>
    <p v-if="message" class="ca-notice__msg">{{ message }}</p>
    <div v-if="$slots.actions" class="ca-notice__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
import AlertIcon from '@/components/common/AlertIcon.vue'
import { normalizeAlertType } from '@/utils/alertMeta'

export default {
  name: 'AlertNotice',
  components: { AlertIcon },
  props: {
    type: { type: String, default: 'warning' },
    title: { type: String, required: true },
    message: { type: String, default: '' },
  },
  computed: {
    normalizedType() {
      return normalizeAlertType(this.type)
    },
  },
}
</script>
