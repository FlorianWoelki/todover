<template>
  <navbar />
  <div class="flex flex-col h-full space-y-4">
    <list-grid :current-date="new Date()" class="h-1/2">
      <list-column v-for="(day, i) in days" :key="i" :index="i" v-model="day.todos">
        <template #draggable>
          <todo-item
            v-for="(todo, j) in day.todos"
            :key="j"
            :value="todo"
            placeholder="Double click to edit todo"
            @update-item="updateTodoItem($event, i, j)"
          ></todo-item>
        </template>
        <todo-item
          no-dbl-click
          :value="newTodoItemInputField"
          @update-item="insertNewTodo($event, i)"
        ></todo-item>
      </list-column>
    </list-grid>

    <div class="p-4 bg-gray-500"></div>

    <list-grid class="h-1/2">
      <list-column
        v-for="(day, i) in days"
        :key="i"
        :index="i"
        v-model="day.todos"
        customTitle="Test"
      >
        <template #draggable>
          <todo-item
            v-for="(todo, j) in day.todos"
            :key="j"
            :value="todo"
            placeholder="Double click to edit todo"
            @update-item="updateTodoItem($event, i, j)"
          ></todo-item>
        </template>
        <todo-item
          no-dbl-click
          :value="newTodoItemInputField"
          @update-item="insertNewTodo($event, i)"
        ></todo-item>
      </list-column>
    </list-grid>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-core';
import ListGrid from '@/components/ListGrid.vue';
import ListColumn from '@/components/ListColumn.vue';
import TodoItem from '@/components/TodoItem.vue';
import Navbar from '@/components/Navbar.vue';

export default defineComponent({
  components: {
    ListGrid,
    ListColumn,
    TodoItem,
    Navbar,
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
