<template>
  <div class="grid grid-cols-5">
    <day-grid :current-date="new Date()">
      <day-column>
        <todo-item></todo-item>
      </day-column>
    </day-grid>
  </div>
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
