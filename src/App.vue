<template>
  <navbar />
  <div class="flex flex-col h-full space-y-4">
    <div class="flex h-1/2">
      <div class="flex flex-col items-center space-y-4 text-red-400">
        <chevron-left class="w-10 h-10 text-red-500" @click="goToPrevDayItem" />
        <chevron-double-left class="w-6 h-6" />
        <cog class="w-6 h-6" />
      </div>

      <list-grid :current-date="new Date()" class="w-full h-full">
        <list-column
          v-for="(day, i) in days"
          :key="i"
          :index="i"
          :hide="i !== 1 && isSmallDevice"
          :extra-day-index="extraDayIndex"
        >
          <template #draggable>
            <todo-item
              v-for="(todo, j) in day.todos"
              :key="j"
              :value="todo.name"
              :done="todo.done"
              placeholder="Double click to edit todo"
              @update-item="updateTodoItem('day', $event, i, j)"
              @click="toggleTodoStatus('day', i, j)"
            ></todo-item>
          </template>
          <todo-item
            no-dbl-click
            :value="newTodoItemInputField"
            @update-item="insertNewTodo('day', $event, i)"
          ></todo-item>
        </list-column>
      </list-grid>

      <div class="flex flex-col items-center space-y-4 text-red-400">
        <chevron-right class="w-10 h-10 text-red-500" @click="goToNextDayItem" />
        <chevron-double-right class="w-6 h-6" />
        <calendar class="w-6 h-6" />
      </div>
    </div>

    <div class="p-4 bg-gray-500"></div>

    <div class="flex h-1/2">
      <div class="flex flex-col items-center space-y-4 lg:hidden">
        <chevron-left
          class="w-10 h-10"
          @click="goToPrevListItem"
          :class="{
            'text-red-500': currentListItem > 0,
            'text-gray-400': currentListItem <= 0,
          }"
        />
      </div>

      <list-grid class="w-full h-full">
        <list-column
          v-for="(list, i) in lists"
          :key="i"
          :index="i"
          :customTitle="list.name"
          :hide="i !== currentListItem && isSmallDevice"
        >
          <template #draggable>
            <todo-item
              v-for="(todo, j) in list.todos"
              :key="j"
              :value="todo.name"
              :done="todo.done"
              placeholder="Double click to edit todo"
              @update-item="updateTodoItem('list', $event, i, j)"
              @click="toggleTodoStatus('list', i, j)"
            ></todo-item>
          </template>
          <todo-item
            no-dbl-click
            :value="newTodoItemInputField"
            @update-item="insertNewTodo('list', $event, i)"
          ></todo-item>
        </list-column>
      </list-grid>

      <div class="flex flex-col items-center space-y-4 lg:hidden">
        <chevron-right
          class="w-10 h-10"
          @click="goToNextListItem"
          :class="{
            'text-red-500': currentListItem + 1 < lists.length,
            'text-gray-400': currentListItem + 1 >= lists.length,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import ChevronLeft from './assets/icons/chevron-left.svg';
import ChevronDoubleLeft from './assets/icons/chevron-double-left.svg';
import ChevronRight from './assets/icons/chevron-right.svg';
import ChevronDoubleRight from './assets/icons/chevron-double-right.svg';
import Cog from './assets/icons/cog.svg';
import Calendar from './assets/icons/calendar.svg';
import { Mutation } from './store';
import { isSmallDevice, setupEventListener } from './util/screen';
import { DayList, List } from './store/state';

enum ListType {
  DAY = 'day',
  LIST = 'list',
}

export default defineComponent({
  components: {
    ChevronLeft,
    ChevronRight,
    ChevronDoubleLeft,
    ChevronDoubleRight,
    Cog,
    Calendar,
  },
  setup() {
    setupEventListener();

    const store = useStore();

    const newTodoItemInputField = ref('');
    const currentListItem = ref(0);
    const extraDayIndex = ref(0);

    const goToNextDayItem = () => {
      extraDayIndex.value += 1;
    };

    const goToPrevDayItem = () => {
      extraDayIndex.value -= 1;
    };

    const goToNextListItem = () => {
      if (currentListItem.value + 1 >= lists.value.length) {
        return;
      }

      currentListItem.value += 1;
    };

    const goToPrevListItem = () => {
      if (currentListItem.value - 1 < 0) {
        return;
      }

      currentListItem.value -= 1;
    };

    const updateTodoItem = (
      type: ListType,
      value: string,
      dayIndex: number,
      todoIndex: number
    ): void => {
      if (type === ListType.DAY) {
        store.commit(Mutation.UPDATE_DAY_TODO, { value: { name: value }, dayIndex, todoIndex });
      } else {
        store.commit(Mutation.UPDATE_LIST_TODO, {
          value: { name: value },
          listIndex: dayIndex,
          todoIndex,
        });
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

    const days = computed((): DayList[] => store.state.days);
    const lists = computed((): List[] => store.state.lists);

    const toggleTodoStatus = (listType: ListType, listIndex: number, todoIndex: number): void => {
      store.commit(Mutation.TOGGLE_TODO_STATUS, { listType, listIndex, todoIndex });
    };

    return {
      insertNewTodo,
      updateTodoItem,
      newTodoItemInputField,
      days,
      lists,
      toggleTodoStatus,
      isSmallDevice,
      currentListItem,
      goToNextListItem,
      goToPrevListItem,
      goToNextDayItem,
      goToPrevDayItem,
      extraDayIndex,
    };
  },
});
</script>
