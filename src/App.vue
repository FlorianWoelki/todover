<template>
  <day-grid :current-date="new Date()" class="h-screen">
    <day-column v-for="(day, i) in days" :key="i" :index="i">
      <todo-item
        v-for="(todo, j) in day.todos"
        :key="j"
        :value="todo"
        placeholder="Type your Todo here"
        @keydown.enter="addNewTodo($event, i, j)"
      ></todo-item>
    </day-column>
  </day-grid>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-core';
import DayGrid from '@/components/DayGrid.vue';
import DayColumn from '@/components/DayColumn.vue';
import TodoItem from '@/components/TodoItem.vue';

export default defineComponent({
  components: {
    DayGrid,
    DayColumn,
    TodoItem,
  },
  setup() {
    const days = ref<any>([
      {
        todos: ['Some test item', 'Hello World'],
      },
      {
        todos: [''],
      },
      {
        todos: [''],
      },
      {
        todos: ['Some test item'],
      },
      {
        todos: ['Hello World'],
      },
    ]);

    const updateCurrentItem = (value: string, dayIndex: number, todoIndex: number): void => {
      days.value[dayIndex].todos[todoIndex] = value;
    };

    const addNewTodo = (event: KeyboardEvent, dayIndex: number, todoIndex: number): void => {
      const value = (event.target as HTMLInputElement).value;
      updateCurrentItem(value, dayIndex, todoIndex);
      days.value[dayIndex].todos.push('');
    };

    return {
      days,
      addNewTodo,
    };
  },
});
</script>
