<template>
  <div class="ca-toasts" role="region" aria-label="Notifications" aria-live="polite">
    <article
      v-for="item in toasts"
      :key="item.id"
      class="ca-toast"
      :class="[`ca-tone--${item.type}`, { 'is-leaving': item.leaving }]"
      :role="item.type === 'error' ? 'alert' : 'status'"
    >
      <div class="ca-ico" aria-hidden="true">
        <AlertIcon :type="item.type" />
      </div>

      <div>
        <span class="ca-toast__tag">{{ item.tag }}</span>
        <h4 class="ca-toast__title">{{ item.title }}</h4>
        <p v-if="item.message" class="ca-toast__msg">{{ item.message }}</p>
      </div>

      <button
        type="button"
        class="ca-toast__close"
        aria-label="ปิด"
        @click="dismissToast(item.id)"
      >
        <AlertIcon type="close" />
      </button>

      <i
        v-if="item.duration > 0"
        class="ca-toast__bar"
        :style="{ '--ca-t': `${item.duration}ms` }"
        @animationend.stop="onBarEnd($event, item.id)"
      ></i>
    </article>
  </div>
</template>

<script>
import AlertIcon from '@/components/common/AlertIcon.vue'
import { useAlert } from '@/hook/useAlert'

export default {
  name: 'ToastAlert',
  components: { AlertIcon },
  setup() {
    const { toasts, dismissToast } = useAlert()

    function onBarEnd(event, id) {
      if (event.animationName === 'ca-timer') {
        dismissToast(id)
      }
    }

    return { toasts, dismissToast, onBarEnd }
  },
}
</script>
