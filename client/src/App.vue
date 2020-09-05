<template>
  <div id="app" class="app">
    <app-modal v-show="modalIs" :title="modalTitle">
      <app-form :message="formMessage">
        <app-input
          name="clientName"
          label="Название компани клиента"
          :required="modalIs === 'create'"
          v-model="form.clientName"
        />
        <app-input
          name="firstName"
          label="Имя перевозчика"
          :required="modalIs === 'create'"
          v-model="form.firstName"
        />
        <app-input
          name="patronymic"
          label="Отчество перевозчика"
          :required="modalIs === 'create'"
          v-model="form.patronymic"
        />
        <app-input
          name="lastName"
          label="Фамилия перевозчика"
          :required="modalIs === 'create'"
          v-model="form.lastName"
        />
        <app-input
          name="phone"
          label="Телефон перевозчика"
          placeholder="Пример: +79092024343"
          :required="modalIs === 'create'"
          v-model="form.phone"
        />
        <app-input
          name="ati"
          label="ATI перевозчика"
          :required="modalIs === 'create'"
          v-model="form.ati"
        />
        <app-input
          name="comments"
          label="Комментарий"
          type="textarea"
          :required="false"
          v-model="form.comments"
        />
        <template v-slot:button-group>
          <app-button
            type="button"
            color="warning"
            @on-click="hideModal"
          >Отмена</app-button>
          <app-button
            type="submit"
            :color="modalIs === 'create' ? 'success' : 'primary'"
            @on-click="onSubmit"
          >{{ modalIs === 'create' ? 'Создать' : 'Изменить' }}</app-button>
        </template>
      </app-form>
    </app-modal>
    <header class="header">
      <h1 class="header__title">Заявки</h1>
      <div class="header__rigth">
        <app-button
          class="header__rigth-item"
          color="secondary"
          @on-click="getRequisitions"
        >Обновить</app-button>
        <app-button
          class="header__rigth-item"
          @on-click="showModalCreate"
        >Новая</app-button>
      </div>
    </header>
    <main v-show="loaded" class="content">
      <app-table
        class="content__table"
        :columns="columns"
        :data="formatedRequisitions"
        data-key-field="_id"
        @update-item="showModalUpdate"
        @remove-item="removeRequisition"
      />
    </main>
    <footer class="footer">
      <app-pagination
        :all="requisitionsAll"
        :perPage="perPage"
        :currentPage="currentPage"
        :quanityPage="quanityPage"
        @change-per-page="changePerPage"
        @to-first-page="toFirstPage"
        @to-back-page="toBackPage"
        @to-next-page="toNextPage"
        @to-last-page="toLastPage"
        @change-page="changePage"
      />
    </footer>
  </div>
</template>

<script>
import Joi from 'joi/dist/joi-browser.min';
import api from '@/api';
import AppTable from '@/components/appTable.vue';
import AppPagination from '@/components/appPagination.vue';
import AppModal from '@/components/appModal.vue';
import AppForm from '@/components/appForm.vue';
import AppInput from '@/components/appInput.vue';
import AppButton from '@/components/appButton.vue';

const createScheme = Joi.object({
  clientName: Joi.string().trim().empty('').required()
    .error(new Error('Название компани клиента обязательное поле.')),
  firstName: Joi.string().trim().empty('').required()
    .error(new Error('Имя перевозчика клиента обязательное поле.')),
  lastName: Joi.string().trim().empty('').required()
    .error(new Error('Фамилия перевозчика клиента обязательное поле.')),
  patronymic: Joi.string().trim().empty('').required()
    .error(new Error('Отчество перевозчика клиента обязательное поле..')),
  phone: Joi.string().trim()
    .pattern(/^[+\d]{1,3}[+\d]{10}$/)
    .required()
    .error(new Error([
      'Телефон перевозчика клиента обязательное поле.',
      'Формат телефона должен быть +79092024343.',
    ].join(' '))),
  ati: Joi.number().integer().positive().required()
    .error(new Error('ATI перевозчика обязательное поле.')),
  comments: Joi.string().empty('').trim(),
});

const updateScheme = Joi.object({
  clientName: Joi.string().trim().empty(''),
  firstName: Joi.string().trim().empty(''),
  lastName: Joi.string().trim().empty(''),
  patronymic: Joi.string().trim().empty(''),
  phone: Joi.string().trim()
    .pattern(/^[+\d]{1,3}[+\d]{10}$/)
    .required()
    .error(new Error('Формат телефона должен быть +79092024343.')),
  ati: Joi.number().integer().positive(),
  comments: Joi.string().empty('').trim(),
});

export default {
  name: 'App',
  components: {
    AppTable,
    AppPagination,
    AppModal,
    AppForm,
    AppInput,
    AppButton,
  },
  data: () => ({
    requisitions: [],
    loaded: false,
    currentPage: 1,
    perPage: 15,
    requisitionsAll: 0,
    modalIs: null,
    formMessage: '',
    columns: [
      { title: '№', field: '_id' },
      { title: 'Дата', field: 'createdAt' },
      { title: 'Клиент', field: 'clientName' },
      { title: 'Перевозчик ФИО', field: 'fullName' },
      { title: 'Перевозчик тел.', field: 'phone' },
      { title: 'Перевозчик ATI', field: 'ati' },
      { title: 'Комментарий', field: 'comments' },
    ],
    form: {
      clientName: '',
      firstName: '',
      patronymic: '',
      lastName: '',
      phone: '',
      ati: '',
      comments: '',
    },
    updateId: null,
  }),
  computed: {
    quanityPage() {
      return Math.ceil(this.requisitionsAll / this.perPage);
    },
    formatedRequisitions() {
      const requisitions = this.requisitions.map((requisition) => {
        const newRequisition = { ...requisition, ...requisition.carrier };
        delete newRequisition.carrier;
        delete newRequisition.ok;
        const { firstName, patronymic, lastName } = newRequisition;
        newRequisition.fullName = [lastName, firstName, patronymic].join(' ');
        newRequisition.createdAt = [
          new Date(newRequisition.createdAt).toLocaleDateString(),
          new Date(newRequisition.createdAt).toLocaleTimeString(),
        ].join('\n');
        newRequisition.ati = `
          <a 
            href="https://ati.su/firms/${newRequisition.ati}/info"
            target="_blank"
          >${newRequisition.ati}</a>
        `;
        return newRequisition;
      });
      return requisitions;
    },
    modalIsShow() {
      return (this.modalIs === 'create') || (this.modalIs === 'update');
    },
    modalTitle() {
      let modalTitle = '';
      if (this.modalIs === 'create') {
        modalTitle = 'Новая Заявка';
      } else if (this.modalIs === 'update') {
        modalTitle = 'Изменение Заявки';
      }
      return modalTitle;
    },
  },
  methods: {
    hideModal() {
      this.modalIs = null;
    },
    showModalCreate() {
      this.modalIs = 'create';
    },
    showModalUpdate(id) {
      /* eslint-disable no-underscore-dangle */
      this.modalIs = 'update';
      this.updateId = id;
      const [requisition] = this.requisitions
        .filter((item) => item._id === this.updateId);
      this.form.clientName = requisition.clientName;
      this.form.firstName = requisition.carrier.firstName;
      this.form.patronymic = requisition.carrier.patronymic;
      this.form.lastName = requisition.carrier.lastName;
      this.form.phone = requisition.carrier.phone;
      this.form.ati = requisition.carrier.ati.toString();
      this.form.comments = requisition.comments;
    },
    onSubmit() {
      if (this.modalIs === 'create') {
        this.createRequisition();
      } else if (this.modalIs === 'update') {
        this.updateRequisition();
      }
    },
    async getRequisitions() {
      this.loaded = false;
      const response = await api.getRequisitions(this.currentPage, this.perPage);
      const { data } = response;
      this.requisitionsAll = response.pagination.all;
      this.loaded = true;
      return data;
    },
    async createRequisition() {
      const { value, error } = createScheme.validate(this.form);
      if (error) {
        this.formMessage = error.message;
      } else {
        const requisition = {
          clientName: value.clientName,
          carrier: {
            firstName: value.firstName,
            lastName: value.lastName,
            patronymic: value.patronymic,
            phone: value.phone,
            ati: value.ati,
          },
          comments: value.comments,
        };
        await api.createRequisition(requisition);
        this.hideModal();
        this.requisitions = await this.getRequisitions();
      }
    },
    async removeRequisition(id) {
      /* eslint-disable no-underscore-dangle */
      await api.removeRequisition(id);
      this.requisitions = await this.getRequisitions();
    },
    async updateRequisition() {
      const { value, error } = updateScheme.validate(this.form);
      if (error) {
        this.formMessage = error.message;
      } else {
        const requisition = {
          clientName: value.clientName,
          carrier: {
            firstName: value.firstName,
            lastName: value.lastName,
            patronymic: value.patronymic,
            phone: value.phone,
            ati: value.ati,
          },
          comments: value.comments,
        };
        await api.updateRequisition(this.updateId, requisition);
        this.hideModal();
        this.requisitions = await this.getRequisitions();
      }
    },
    async toFirstPage() {
      this.currentPage = 1;
      this.requisitions = await this.getRequisitions();
    },
    async toBackPage() {
      if (this.currentPage === 1) return;
      this.currentPage -= 1;
      this.requisitions = await this.getRequisitions();
    },
    async toNextPage() {
      if (this.currentPage === this.quanityPage) return;
      this.currentPage += 1;
      this.requisitions = await this.getRequisitions();
    },
    async toLastPage() {
      this.currentPage = this.quanityPage;
      this.requisitions = await this.getRequisitions();
    },
    async changePage(pageNumber) {
      this.currentPage = pageNumber;
      this.requisitions = await this.getRequisitions();
    },
    async changePerPage(value) {
      this.perPage = parseInt(value, 10);
      this.currentPage = 1;
      this.requisitions = await this.getRequisitions();
    },
  },
  async mounted() {
    this.requisitions = await this.getRequisitions();
  },
};
</script>

<style>
:root {
  --bg-primary-color: #007bff;
  --bg-success-color: #28a745;
  --bg-danger-color: #dc3545;
  --bg-secondary-color: #6c757d;
  --bg-warning-color: #ffc107;
  --bg-dark-color: #343a40;
  --text-light-color: #f8f9fa;
  --text-white-color: #fff;
  --text-dark-color: #343a40;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}

body {
  margin: 0;
  overflow-y: scroll;
}

.app {
  position: relative;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  grid-template-areas: "header" "main" "footer";
  grid-template-rows: 100px 1fr 120px;
  margin: 0 auto;
  max-width: 1200px;
  height: 100vh;
  color: var(--text-dark-color);
}

.header {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 100;
  grid-area: header;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: var(--text-light-color);
}

.content {
  grid-area: main;
}

.footer{
  position: sticky;
  bottom: 0;
  display: flex;
  grid-area: footer;
  flex-direction: row;
  justify-content: flex-end;
  height: 120px;
  margin-right: 10px;
  padding: 20px 0px 20px 0px;
  background-color: var(--text-light-color);
}

.content__table {
  margin-bottom: 40px;
}

.header__rigth {
  padding: 10px 10px;
}

.header__rigth-item {
  margin-left: 10px;
}
</style>
