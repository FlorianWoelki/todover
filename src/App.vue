<template>
  <day-grid :current-date="new Date()">
    <day-column v-for="i in 5" :key="i" :index="i - 1">
      <todo-item></todo-item>
    </day-column>
  </day-grid>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import DayGrid from '@/components/DayGrid.vue';
import DayColumn from '@/components/DayColumn.vue';
import TodoItem from '@/components/TodoItem.vue';

export default defineComponent({
  components: {
    DayGrid,
    DayColumn,
    TodoItem,
  },
});
</script>
