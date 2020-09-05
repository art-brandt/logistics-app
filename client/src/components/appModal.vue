<template>
  <div class="modal">
    <div class="modal__mask">
      <div class="modal__container">
        <div class="modal__header">
          <h2 class="modal__tittle">{{title}}</h2>
        </div>
        <div class="modal__content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
  },
};
</script>

<style>
.modal__mask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.modal__container {
  width: 500px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

</style>
