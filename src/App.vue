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
            @update-item="updateTodoItem('day', $event, i, j)"
          ></todo-item>
        </template>
        <todo-item
          no-dbl-click
          :value="newTodoItemInputField"
          @update-item="insertNewTodo('day', $event, i)"
        ></todo-item>
      </list-column>
    </list-grid>

    <div class="p-4 bg-gray-500"></div>

    <list-grid class="h-1/2">
      <list-column
        v-for="(list, i) in lists"
        :key="i"
        :index="i"
        v-model="list.todos"
        :customTitle="list.name"
      >
        <template #draggable>
          <todo-item
            v-for="(todo, j) in list.todos"
            :key="j"
            :value="todo"
            placeholder="Double click to edit todo"
            @update-item="updateTodoItem('list', $event, i, j)"
          ></todo-item>
        </template>
        <todo-item
          no-dbl-click
          :value="newTodoItemInputField"
          @update-item="insertNewTodo('list', $event, i)"
        ></todo-item>
      </list-column>
    </list-grid>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/runtime-core';

enum ListType {
  DAY = 'day',
  LIST = 'list',
}

export default defineComponent({
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
    const lists = ref<any>([
      {
        name: 'List One',
        todos: ['My list one item'],
      },
      {
        name: 'Things',
        todos: ['Buy some milk'],
      },
      {
        name: 'Watchlist',
        todos: ['Harry Potter'],
      },
    ]);

    const updateTodoItem = (
      type: ListType,
      value: string,
      dayIndex: number,
      todoIndex: number
    ): void => {
      if (type === ListType.DAY) {
        days.value[dayIndex].todos[todoIndex] = value;
      } else {
        lists.value[dayIndex].todos[todoIndex] = value;
      }
    };

    const insertNewTodo = (type: ListType, value: string, dayIndex: number): void => {
      newTodoItemInputField.value = '';

      if (type === ListType.DAY) {
        days.value[dayIndex].todos.push(value);
      } else {
        lists.value[dayIndex].todos.push(value);
      }
    };

    return {
      days,
      insertNewTodo,
      updateTodoItem,
      newTodoItemInputField,
      lists,
    };
  },
});
</script>
