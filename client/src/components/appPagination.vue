<template>
  <div class="pagination">
    <div class="pagination__per-page">
      <label>Показывать: </label>
      <input
        type="number"
        min="5" max="20" step="5"
        :value="perPage"
        @input="$emit('change-per-page', $event.target.value)"
      />
    </div>
    <div class="pagination__button-group">
      <button
        type="button"
        class="pagination__button-group-item"
        @click.prevent="$emit('to-first-page')">Начало</button>
      <button
        type="button"
        class="pagination__button-group-item"
        @click.prevent="$emit('to-back-page')">Назад</button>
      <button
        type="button"
        v-for="page in pages"
        :class="{
          'pagination__button-group-item': true,
          'pagination__button-group-item--active': page.isActive,
        }"
        :key="page.number"
        @click.prevent="$emit('change-page', page.number)"
      >{{page.number}}</button>
      <button
        type="button"
        class="pagination__button-group-item"
        @click.prevent="$emit('to-next-page')"
      >Вперёд</button>
      <button
        type="button"
        class="pagination__button-group-item"
        @click.prevent="$emit('to-last-page')"
      >Конец</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',
  props: {
    all: { type: Number, required: true },
    perPage: { type: Number, required: true },
    currentPage: { type: Number, required: true },
    quanityPage: { type: Number, required: true },
  },
  computed: {
    pages() {
      const pages = [];
      for (let number = 1; number <= this.quanityPage; number += 1) {
        const isActive = number === this.currentPage;
        const isShow = number < 3
          || number > this.quanityPage - 2
          || number === this.currentPage
          || (this.currentPage <= 3 && number <= 3)
          || (this.currentPage >= this.quanityPage - 2 && number >= this.quanityPage - 2);
        if (isShow) pages.push({ number, isActive });
      }
      return pages;
    },
  },
};
</script>

<style>
  .pagination {
    display: flex;
    align-items: center;
  }

  .pagination__per-page {
    margin-right: 10px;
  }

  .pagination__per-page input {
    width: 60px;
    margin-right: 10px;
    padding: 10px 12px;
  }

  .pagination__button-group {
    display: flex;
    justify-content: flex-end;
    min-width: 530px;
  }

  .pagination__button-group-item {
    font-family: inherit;
    background-color: var(--bg-secondary-color);
    border: none;
    border-radius: 2px;
    padding: 10px 12px;
    margin-right: 10px;
  }

  .pagination__button-group-item:last-child {
    margin-right: 0;
  }

  .pagination__button-group-item--active {
    background-color: var(--bg-primary-color);
  }
</style>
