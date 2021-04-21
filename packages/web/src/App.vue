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
              v-for="(todo, j) in todosAtDate(day)"
              :key="j"
              :value="todo.name"
              :done="todo.done"
              placeholder="Double click to edit todo"
              @update-item="updateTodoItem($event, j)"
              @click="toggleTodoStatus(todo.id)"
            ></todo-item>
          </template>
          <template #default="{ date }">
            <todo-item
              no-dbl-click
              :value="newTodoItemInputField"
              @update-item="insertNewTodo($event, date)"
            ></todo-item>
          </template>
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
          v-for="(todos, list, i) in lists"
          :key="i"
          :index="i"
          :customTitle="list"
          :hide="i !== currentListItem && isSmallDevice"
        >
          <template #draggable>
            <todo-item
              v-for="(todo, j) in todos"
              :key="j"
              :value="todo.name"
              :done="todo.done"
              placeholder="Double click to edit todo"
              @update-item="updateTodoItem($event, j)"
              @click="toggleTodoStatus(todo.id)"
            ></todo-item>
          </template>
          <template #default="{ date }">
            <todo-item
              no-dbl-click
              :value="newTodoItemInputField"
              @update-item="insertNewTodo($event, date, list)"
            ></todo-item>
          </template>
        </list-column>
      </list-grid>

      <div class="flex flex-col items-center space-y-4 lg:hidden">
        <chevron-right
          class="w-10 h-10"
          @click="goToNextListItem"
          :class="{
            'text-red-500': currentListItem + 1 < sizeOfLists,
            'text-gray-400': currentListItem + 1 >= sizeOfLists,
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
import { ListType, Todo } from './store/state';

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
    const currentDate = ref(new Date());
    const extraDayIndex = ref(0);

    const goToNextDayItem = () => {
      extraDayIndex.value += 1;
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth(),
        currentDate.value.getDate() + 1
      );
    };

    const goToPrevDayItem = () => {
      extraDayIndex.value -= 1;
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth(),
        currentDate.value.getDate() - 1
      );
    };

    const goToNextListItem = () => {
      if (currentListItem.value + 1 >= sizeOfLists.value) {
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

    const updateTodoItem = (value: Todo, todoIndex: number): void => {
      store.commit(Mutation.UPDATE_TODO, { value, todoIndex } as {
        value: Todo;
        todoIndex: number;
      });
    };

    const insertNewTodo = (value: string, date: Date, listName?: string): void => {
      newTodoItemInputField.value = '';

      store.commit(Mutation.ADD_TODO, {
        value: {
          id: 'someunqiueid' + value,
          name: value,
          date: !listName ? date : undefined,
          list: listName,
        } as Todo,
      });
    };

    const days = computed((): any[] => {
      const previousDate = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth(),
        currentDate.value.getDate() - 1
      );
      const maxDate = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth(),
        currentDate.value.getDate() + 4
      );
      const clonedDate = new Date(currentDate.value.getTime());

      let days: Date[] = [previousDate];
      for (let day = clonedDate; day < maxDate; day.setDate(day.getDate() + 1)) {
        days.push(new Date(day));
      }

      return days;
    });

    const filteredTodos = computed(
      (): Map<String, Todo[]> => {
        const map = new Map<String, Todo[]>();
        const todos = store.state.todos as Todo[];
        todos
          .filter((todo) => todo.date)
          .forEach((todo) => {
            const dateStr = todo.date!.toDateString();
            if (map.has(dateStr)) {
              map.get(dateStr)!.push(todo);
            } else {
              map.set(dateStr, [todo]);
            }
          });

        return map;
      }
    );

    const todosAtDate = (date: Date): Todo[] | undefined => {
      return filteredTodos.value.get(date.toDateString());
    };

    const lists = computed(
      (): ListType => {
        const todos = store.state.todos as Todo[];
        const lists: ListType = {};
        todos
          .filter((todo) => todo.list)
          .forEach((todo) => {
            if (lists[todo.list!]) {
              lists[todo.list!].push(todo);
            } else {
              lists[todo.list!] = [todo];
            }
          });
        return lists;
      }
    );

    const sizeOfLists = computed((): number => Object.keys(lists.value).length);

    const toggleTodoStatus = (todoId: string): void => {
      store.commit(Mutation.TOGGLE_TODO_STATUS, { id: todoId });
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
      sizeOfLists,
      todosAtDate,
    };
  },
});
</script>
