<template>
  <button
    :class="{
      'button': true,
      'button--primary': color === 'primary',
      'button--success': color === 'success',
      'button--danger': color === 'danger',
      'button--secondary': color === 'secondary',
      'button--warning': color === 'warning',
    }"
    :type="type"
    @click.prevent="$emit('on-click')"
  ><slot/></button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    type: { type: String, default: 'button' },
    color: { type: String, default: 'primary' },
  },
};
</script>

<style>
.button {
  border: none;
  border-radius: 2px;
  background-color: var(--bg-primary-color);
  width: 80px;
  height: 30px;
}

.button--primary {
  background-color: var(--bg-primary-color);
}

.button--success {
  background-color: var(--bg-success-color);
}

.button--danger {
  background-color: var(--bg-danger-color);
}

.button--secondary {
  background-color: var(--bg-secondary-color);
}

.button--warning {
  background-color: var(--bg-warning-color);
}
</style>
