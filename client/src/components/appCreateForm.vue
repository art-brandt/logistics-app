<template>
  <div class="form">
    <p v-show="message" class="form__message">{{ message }}</p>
    <div class="form__item">
      <label for="clientName">Название компани клиента*:</label>
      <input name="client" v-model="requisition.clientName" type="text" />
    </div>
    <div class="form__item">
      <label for="firstName">Имя перевозчика*:</label>
      <input name="firstName" v-model="requisition.firstName" type="text" />
    </div>
    <div class="form__item">
      <label for="patronymic">Отчество перевозчика*:</label>
      <input name="patronymic" v-model="requisition.patronymic" type="text" />
    </div>
    <div class="form__item">
      <label for="lastName">Фамилия перевозчика*:</label>
      <input name="lastName" v-model="requisition.lastName" type="text" />
    </div>
    <div class="form__item">
      <label for="phone">Телефон перевозчика*:</label>
      <input
        name="phone"
        v-model="requisition.phone"
        type="text"
        placeholder="Пример: +79092024343"
      />
    </div>
    <div class="form__item">
      <label for="ati">ATI перевозчика*:</label>
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
        class="button button--success form__bottom-item"
        type="button"
        @click.prevent="submit"
      >Создать</button>
    </div>
  </div>
</template>

<script>
import Joi from 'joi/dist/joi-browser.min';

const validationScheme = Joi.object({
  clientName: Joi.string().trim().empty('').required()
    .error(new Error('Название компани клиента обязательное поле.')),
  firstName: Joi.string().empty('').trim().required()
    .error(new Error('Имя перевозчика клиента обязательное поле.')),
  lastName: Joi.string().empty('').trim().required()
    .error(new Error('Отчество перевозчика клиента обязательное поле.')),
  patronymic: Joi.string().empty('').trim().required()
    .error(new Error('Фамилия перевозчика клиента обязательное поле.')),
  phone: Joi
    .string()
    .trim()
    .empty('')
    .pattern(/^[+\d]{1,3}[+\d]{10}$/)
    .required()
    .error(new Error([
      'Телефон перевозчика клиента обязательное поле.',
      'Формат телефона должен быть +79092024343.',
    ].join(' '))),
  ati: Joi.number().integer().required().positive()
    .error(new Error('ATI перевозчика обязательное поле.')),
  comments: Joi.string().empty('').trim(),
});

const defaultRequisition = {
  clientName: '',
  firstName: '',
  lastName: '',
  patronymic: '',
  phone: '',
  ati: '',
  comments: '',
};

export default {
  name: 'appCreateForm',
  data: () => ({
    requisition: { ...defaultRequisition },
    message: null,
  }),
  methods: {
    reset() {
      this.requisition = { ...defaultRequisition };
    },
    submit() {
      const { value, error } = validationScheme.validate(this.requisition);
      if (error) {
        this.message = error;
      } else {
        this.$emit('on-submit', value);
      }
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
