<template>
  <table class="table">
    <thead class="table__header">
      <tr class="table__row">
        <th
          class="table__header-cell table__cell"
          v-for="(column, index) in columns"
          :key="index"
        >{{column.title}}</th>
        <th class="table__actions">Действия</th>
      </tr>
    </thead>
    <tbody class="table__body">
      <tr class="table__row" v-for="item in data" :key="item['_id']">
        <td
          class="table__cell"
          v-for="(column, index) in columns"
          :key="index"
          v-html="item[column.field]"
        ></td>
        <td class="table__cell table__actions-item">
          <app-button
            class="table__actions-item-btn"
            type="button"
            @on-click="$emit('update-item', item['_id'])"
          >Изменить</app-button>
          <app-button
            class="table__actions-item-btn"
            type="button"
            color="danger"
            @on-click="$emit('remove-item', item['_id'])"
          >Удалить</app-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import AppButton from '@/components/appButton.vue';

export default {
  name: 'AppTable',
  components: {
    AppButton,
  },
  props: {
    columns: { type: Array, required: true },
    data: { type: Array, required: true },
    dataKeyField: { type: String, required: true },
  },
};
</script>

<style>
.table {
  max-width: 100%;
}

.table__header {
  background-color: var(--bg-dark-color);
  color: var(--text-light-color);
}

.table__cell {
  text-align: center;
  padding: 5px 10px;
}

.table__header,
.table__row {
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.22);
}

.table__body {
  background-color: var(--bg-light-color);
}

.table__actions-item {
  padding: 10px 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.table__actions-item-btn {
  margin-left: 8px;
}

.table__actions-item-btn:first-child {
  margin-left: 0px
}

</style>
