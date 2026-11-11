<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <transition-group name="toast-slide" tag="div" class="toast-stack__list">
      <div
        v-for="item in toasts"
        :key="item.id"
        class="toast-card"
        :class="`toast-card--${item.type}`"
        role="status"
      >
        <div class="toast-card__icon" aria-hidden="true">
          <v-icon size="20" :color="item.type === 'error' ? '#dc2626' : '#16a34a'">
            {{ item.type === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle' }}
          </v-icon>
        </div>

        <div class="toast-card__body">
          <div class="toast-card__title">{{ item.title }}</div>
          <p v-if="item.message" class="toast-card__msg">{{ item.message }}</p>
        </div>

        <button
          type="button"
          class="toast-card__close"
          aria-label="Close notification"
          @click="dismissToast(item.id)"
        >
          <v-icon size="16">mdi-close</v-icon>
        </button>

        <span
          v-if="item.duration > 0"
          class="toast-card__bar"
          :style="{ animationDuration: `${item.duration}ms` }"
        ></span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { useToast } from '@/hook/useToast'

export default {
  name: 'ToastAlert',
  setup() {
    const { toasts, dismissToast } = useToast()
    return { toasts, dismissToast }
  },
}
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: 88px;
  right: 24px;
  z-index: 999;
  width: min(380px, calc(100vw - 32px));
  pointer-events: none;
}

.toast-stack__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-card {
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 14px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
}

.toast-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-card--success .toast-card__icon {
  background: #ecfdf5;
}

.toast-card--error .toast-card__icon {
  background: #fef2f2;
}

.toast-card__body {
  flex: 1;
  min-width: 0;
  padding-top: 1px;
}

.toast-card__title {
  font-family: 'Kanit', 'Space Grotesk', 'Prompt', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.3;
  color: #111827;
}

.toast-card__msg {
  margin: 3px 0 0;
  font-size: 0.84rem;
  line-height: 1.45;
  color: #4b5563;
  word-break: break-word;
}

.toast-card__close {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #9ca3af;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;
}

.toast-card__close:hover {
  background: #f3f4f6;
  color: #111827;
}

.toast-card__close .v-icon {
  color: inherit;
}

.toast-card__bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  transform-origin: left center;
  animation-name: toast-countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.toast-card--success .toast-card__bar {
  background: linear-gradient(to right, #22c55e, #16a34a);
}

.toast-card--error .toast-card__bar {
  background: linear-gradient(to right, #f87171, #dc2626);
}

@keyframes toast-countdown {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.toast-slide-enter,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) translateX(18px) scale(0.97);
}

@media (max-width: 600px) {
  .toast-stack {
    top: 82px;
    left: 16px;
    right: 16px;
    width: auto;
  }
}
</style>
