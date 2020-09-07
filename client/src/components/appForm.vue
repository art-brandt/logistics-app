<template>
  <div class="form" @submit="$emit('submit', $event.target)">
    <p v-show="message" class="form__message">{{ message }}</p>
    <slot></slot>
    <div class="form__button-group">
      <slot name="button-group"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppInput',
  props: {
    message: { type: String, default: '' }
  }
}
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
}

.form > div {
  margin-bottom: 10px;
}

.form__button-group {
  display: flex;
  flex-direction: row;
  margin-left: auto;
}

.form__button-group * {
  margin-left: 10px;
}
</style>
