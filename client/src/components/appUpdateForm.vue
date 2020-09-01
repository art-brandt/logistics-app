<template>
  <div class="form">
    <p v-show="message" class="form__message">{{ message }}</p>
    <div class="form__item">
      <label for="clientName">Название компани клиента:</label>
      <input name="client" v-model="requisition.clientName" type="text"/>
    </div>
    <div class="form__item">
      <label for="firstName">Имя перевозчика:</label>
      <input name="firstName" v-model="requisition.firstName" type="text"/>
    </div>
    <div class="form__item">
      <label for="patronymic">Отчество перевозчика:</label>
      <input name="patronymic" v-model="requisition.patronymic" type="text"/>
    </div>
    <div class="form__item">
      <label for="lastName">Фамилия перевозчика:</label>
      <input name="lastName" v-model="requisition.lastName" type="text"/>
    </div>
    <div class="form__item">
      <label for="phone">Телефон перевозчика:</label>
      <input
        name="phone"
        v-model="requisition.phone"
        type="text"
        placeholder="Пример: +79092024343"
      />
    </div>
    <div class="form__item">
      <label for="ati">ATI перевозчика:</label>
      <input name="ati" v-model="requisition.ati" type="text" />
    </div>
    <div class="form__item">
      <label for="comments">Комментарий:</label>
      <textarea name="firstName" v-model="requisition.comments"></textarea>
    </div>
    <div class="form__bottom">
      <button
        class="button button--warning form__bottom-item"
        type="button"
        @click.prevent="$emit('close-modal')"
      >Отмена</button>
      <button
        class="button form__bottom-item"
        type="button"
        @click.prevent="$emit('on-submit')"
      >Изменить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'appCreateForm',
  props: {
    requisition: {
      type: Object,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
}

.form__item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.form__item label {
  margin-bottom: 0.2em;
}

.form__item input {
  font-family: inherit;
  height: 30px;
  padding: 5px 10px;
}

.form__item textarea {
  font-family: inherit;
  height: 80px;
  padding: 5px 10px;
}

.form__bottom {
  display: flex;
  flex-direction: row;
  margin-left: auto;
}

.form__bottom-item {
  margin-left: 10px;
}
</style>
