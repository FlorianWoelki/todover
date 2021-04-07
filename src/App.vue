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
import { computed, defineComponent, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { Mutation } from './store';

enum ListType {
  DAY = 'day',
  LIST = 'list',
}

export default defineComponent({
  setup() {
    const store = useStore();

    const newTodoItemInputField = ref('');

    const updateTodoItem = (
      type: ListType,
      value: string,
      dayIndex: number,
      todoIndex: number
    ): void => {
      if (type === ListType.DAY) {
        store.commit(Mutation.UPDATE_DAY_TODO, { value, dayIndex, todoIndex });
      } else {
        store.commit(Mutation.UPDATE_LIST_TODO, { value, listIndex: dayIndex, todoIndex });
      }
    };

    const insertNewTodo = (type: ListType, value: string, dayIndex: number): void => {
      newTodoItemInputField.value = '';

      if (type === ListType.DAY) {
        store.commit(Mutation.ADD_DAY_TODO, { value, dayIndex });
      } else {
        store.commit(Mutation.ADD_LIST_TODO, { value, listIndex: dayIndex });
      }
    };

    const days = computed(() => store.state.days);
    const lists = computed(() => store.state.lists);

    return {
      insertNewTodo,
      updateTodoItem,
      newTodoItemInputField,
      days,
      lists,
    };
  },
});
</script>
