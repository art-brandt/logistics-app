<template>
  <div id="app" class="app">
    <app-modal v-show="modalIsShow" :title="modalTitle">
      <app-create-form
        v-show="createFormIsShow"
        ref="createForm"
        @close-modal="hideModalCreate"
        @on-submit="createNewRequisition"
      />
      <app-update-form
        v-show="updateFormIsShow"
        :requisition="updateForm"
        :message="updateFormMessage"
        @close-modal="hideModalUpdate"
        @on-submit="updateRequisition"
      />
    </app-modal>
    <header class="header">
      <h1 class="header__title">Заявки</h1>
      <div class="header__rigth">
        <button
          class="header__rigth-item button button--secondary"
          type="button"
          @click.prevent="getRequisitions"
        >Обновить</button>
        <button
          class="header__rigth-item button button--success"
          type="button"
          @click.prevent="showModalCreate"
        >Новая</button>
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
      <div class="content__bottom">

      </div>
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
import AppCreateForm from '@/components/appCreateForm.vue';
import AppUpdateForm from '@/components/appUpdateForm.vue';
import AppPagination from '@/components/appPagination.vue';
import AppModal from '@/components/appModal.vue';

const updateScheme = Joi.object({
  clientName: Joi.string().trim().empty(''),
  firstName: Joi.string().empty('').trim(),
  lastName: Joi.string().empty('').trim(),
  patronymic: Joi.string().empty('').trim(),
  phone: Joi
    .string()
    .trim()
    .pattern(/^[+\d]{1,3}[+\d]{10}$/)
    .error(new Error('Формат телефона должен быть +79092024343.')),
  ati: Joi.number().integer().positive(),
  comments: Joi.string().empty('').trim(),
});

const defaultUpdateForm = {
  clientName: '',
  firstName: '',
  lastName: '',
  patronymic: '',
  phone: '',
  ati: '',
  comments: '',
};

export default {
  name: 'App',
  components: {
    AppTable,
    AppCreateForm,
    AppPagination,
    AppModal,
    AppUpdateForm,
  },
  data: () => ({
    loaded: false,
    currentPage: 1,
    perPage: 15,
    requisitionsAll: 0,
    createFormIsShow: false,
    updateFormIsShow: false,
    modalTitle: '',
    modalIsShow: false,
    updateFormMessage: '',
    columns: [
      { title: '№', field: '_id' },
      { title: 'Дата', field: 'createdAt' },
      { title: 'Клиент', field: 'clientName' },
      { title: 'Перевозчик ФИО', field: 'fullName' },
      { title: 'Перевозчик тел.', field: 'phone' },
      { title: 'Перевозчик ATI', field: 'ati' },
      { title: 'Комментарий', field: 'comments' },
    ],
    requisitions: [],
    updateForm: { ...defaultUpdateForm },
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
  },
  methods: {
    showModalCreate() {
      this.modalTitle = 'Новая Заявка';
      this.createFormIsShow = true;
      this.updateFormIsShow = false;
      this.modalIsShow = true;
    },
    hideModalCreate() {
      this.createFormIsShow = false;
      this.modalIsShow = false;
    },
    showModalUpdate(requisition) {
      this.modalTitle = 'Изменение Заявки';
      /* eslint-disable no-underscore-dangle */
      const [candidate] = this.requisitions
        .filter((item) => item._id === requisition._id);
      this.updateForm = {
        id: candidate._id,
        clientName: candidate.clientName,
        firstName: candidate.carrier.firstName,
        lastName: candidate.carrier.lastName,
        patronymic: candidate.carrier.patronymic,
        phone: candidate.carrier.phone,
        ati: candidate.carrier.ati,
        comments: candidate.comments,
      };
      this.createFormIsShow = false;
      this.updateFormIsShow = true;
      this.modalIsShow = true;
    },
    hideModalUpdate() {
      this.updateFormIsShow = false;
      this.modalIsShow = false;
      this.updateFormMessage = '';
      this.updateForm = { ...defaultUpdateForm };
    },
    async getRequisitions() {
      this.loaded = false;
      const response = await api.getRequisitions(this.currentPage, this.perPage);
      const { data } = response;
      this.requisitionsAll = response.pagination.all;
      this.loaded = true;
      return data;
    },
    async createNewRequisition(requisition) {
      const data = {
        clientName: requisition.clientName,
        carrier: {
          firstName: requisition.firstName,
          lastName: requisition.lastName,
          patronymic: requisition.patronymic,
          phone: requisition.phone,
          ati: parseInt(requisition.ati, 10),
        },
        comments: requisition.comments,
      };
      await api.createRequisition(data);
      this.hideModalCreate();
      this.$refs.createForm.reset();
      this.requisitions = await this.getRequisitions();
    },
    async removeRequisition(requisition) {
      /* eslint-disable no-underscore-dangle */
      await api.removeRequisition(requisition._id);
      this.requisitions = await this.getRequisitions();
    },
    async updateRequisition() {
      let data = { ...this.updateForm };
      const { id } = this.updateForm;
      delete data.id;
      const { value, error } = updateScheme.validate(data);
      if (error) {
        this.updateFormMessage = error;
      } else {
        data = {
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
        await api.updateRequisition(id, data);
        this.requisitions = await this.getRequisitions();
        this.hideModalUpdate();
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

.button {
  border: none;
  border-radius: 2px;
  background-color: var(--bg-primary-color);
  width: 80px;
  height: 30px;
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
