<template>
  <div class="auth-field">
    <label :for="id" class="auth-field__label">{{ label }}</label>
    <div class="auth-field__control">
      <input
        :id="id"
        :type="inputType"
        :value="value"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="auth-field__input"
        :class="{
          'auth-field__input--icon': isPassword,
          'auth-field__input--error': !!error,
        }"
        @input="$emit('input', $event.target.value)"
      />

      <button
        v-if="isPassword"
        type="button"
        class="auth-field__icon-btn"
        :aria-label="show ? 'Hide password' : 'Show password'"
        @click="show = !show"
      >
        <v-icon size="20" color="currentColor">
          {{ show ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}
        </v-icon>
      </button>
    </div>

    <span v-if="error" class="auth-field__error">
      <v-icon size="15" color="#dc2626">mdi-alert-circle-outline</v-icon>
      <span>{{ error }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'AuthInput',
  props: {
    id: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    autocomplete: { type: String, default: 'off' },
    error: { type: String, default: '' },
  },
  data: () => ({
    show: false,
  }),
  computed: {
    isPassword() {
      return this.type === 'password'
    },
    inputType() {
      if (!this.isPassword) return this.type
      return this.show ? 'text' : 'password'
    },
  },
}
</script>

<style scoped src="../../assets/style/auth/auth-form.css"></style>
