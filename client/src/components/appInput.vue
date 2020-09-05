<template>
  <div class="input">
    <label v-if="label" :for="name">
      {{ label.concat(required ? '*' : '') }}:
    </label>
    <input
      v-if="type !== 'textarea'"
      type="type"
      :name="name"
      :value="value"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
    />
    <textarea
      v-if="type === 'textarea'"
      :name="name"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'appInput',
  props: {
    name: { type: String, required: true },
    value: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    required: { type: Boolean, default: false },
    label: { type: String },
  },
};
</script>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
}

.input label {
  margin-bottom: 0.2em;
}

.input input {
  font-family: inherit;
  height: 30px;
  padding: 5px 10px;
}

.input textarea {
  font-family: inherit;
  height: 80px;
  padding: 5px 10px;
}
</style>
