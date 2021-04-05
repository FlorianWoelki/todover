<template>
  <day-grid :current-date="new Date()" class="h-screen">
    <day-column v-for="(day, i) in days" :key="i" :index="i" v-model="day.todos">
      <template #draggable>
        <todo-item
          v-for="(todo, j) in day.todos"
          :key="j"
          :value="todo"
          placeholder="Double click to edit todo"
          @update-item="updateTodoItem($event, i, j)"
        ></todo-item>
      </template>
      <todo-item :value="newTodoItemInputField" @update-item="insertNewTodo($event, i)"></todo-item>
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
    const newTodoItemInputField = ref('');
    const days = ref<any>([
      {
        todos: ['Some test item', 'Hello World'],
      },
      {
        todos: [],
      },
      {
        todos: [],
      },
      {
        todos: ['Some test item'],
      },
      {
        todos: ['Hello World'],
      },
    ]);

    const updateTodoItem = (value: string, dayIndex: number, todoIndex: number): void => {
      days.value[dayIndex].todos[todoIndex] = value;
    };

    const insertNewTodo = (value: string, dayIndex: number): void => {
      newTodoItemInputField.value = '';
      days.value[dayIndex].todos.push(value);
    };

    return {
      days,
      insertNewTodo,
      updateTodoItem,
      newTodoItemInputField,
    };
  },
});
</script>
