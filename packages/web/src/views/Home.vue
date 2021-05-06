<template>
  <div class="flex flex-col h-full font-sans antialiased">
    <div class="flex mb-4 h-1/2">
      <div class="flex flex-col items-center space-y-4">
        <button class="text-red-500 focus:outline-none hover:text-red-600" @click="goToPrevDayItem">
          <chevron-left class="w-10 h-10" />
        </button>
        <button class="text-red-400 focus:outline-none hover:text-red-500" @click="goWeekBack">
          <chevron-double-left class="w-6 h-6" />
        </button>
        <cog class="w-6 h-6 text-red-400" />
      </div>

      <list-grid :current-date="new Date()" class="w-full h-full">
        <list-column
          v-for="(day, i) in days"
          :key="i"
          :index="i"
          :hide="i !== 1 && isSmallDevice"
          :extra-day-index="extraDayIndex"
          @end="updateListOfTodoItem"
        >
          <template #draggable>
            <todo-item
              v-for="(todo, j) in todosAtDate(day)"
              :todo-id="todo.id"
              :key="j"
              :value="todo.name"
              :done="todo.done"
              placeholder="Double click to edit todo"
              @update-item="updateTodoItem(todo.id, { name: $event })"
              @remove-item="removeTodoItem(todo.id)"
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

      <div class="flex flex-col items-center space-y-4">
        <button class="text-red-500 focus:outline-none hover:text-red-600" @click="goToNextDayItem">
          <chevron-right class="w-10 h-10" />
        </button>
        <button class="text-red-400 focus:outline-none hover:text-red-500" @click="goWeekForward">
          <chevron-double-right class="w-6 h-6" />
        </button>
        <button
          class="relative text-red-400 focus:outline-none hover:text-red-500"
          @click="toggleCalendar"
        >
          <calendar class="w-6 h-6" />
          <date-picker v-if="isCalendarVisible" class="right-0" @select-date="goToDate" />
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between p-2 bg-gray-500">
      <div></div>
      <button
        class="flex items-center justify-center text-gray-300 rounded-lg hover:text-gray-100 hover:text-gray-200 focus:outline-none"
        @click="createNewList"
      >
        <plus-icon class="w-8 h-8"></plus-icon>
      </button>
    </div>

    <div class="flex mt-1 h-1/2">
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
          v-for="(todos, listId, i) in lists"
          :key="i"
          :index="i"
          :listId="listId"
          :hide="i !== currentListItem && isSmallDevice"
          @end="updateListOfTodoItem"
          @update-list-title="updateListTitle($event, listId)"
        >
          <template #draggable>
            <todo-item
              v-for="(todo, j) in todos"
              :todo-id="todo.id"
              :key="j"
              :value="todo.name"
              :done="todo.done"
              placeholder="Double click to edit todo"
              @click="toggleTodoStatus(todo.id)"
              @update-item="updateTodoItem(todo.id, { name: $event })"
              @remove-item="removeTodoItem(todo.id)"
            ></todo-item>
          </template>
          <template #default="{ date }">
            <todo-item
              no-dbl-click
              :value="newTodoItemInputField"
              @update-item="insertNewTodo($event, date, listId)"
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

  <hide-button v-if="isCalendarVisible" @click="hideCalendar" />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/runtime-core';
import { useStore } from 'vuex';
import ChevronLeft from '../assets/icons/chevron-left.svg';
import ChevronDoubleLeft from '../assets/icons/chevron-double-left.svg';
import ChevronRight from '../assets/icons/chevron-right.svg';
import PlusIcon from '../assets/icons/plus.svg';
import ChevronDoubleRight from '../assets/icons/chevron-double-right.svg';
import Cog from '../assets/icons/cog.svg';
import Calendar from '../assets/icons/calendar.svg';
import { Mutation } from '../store';
import { isSmallDevice, setupEventListener } from '../util/screen';
import { List, ListType, Todo } from '../store/state';
import HideButton from '../components/ui/HideButton';

export default defineComponent({
  components: {
    HideButton,
    ChevronLeft,
    ChevronRight,
    ChevronDoubleLeft,
    ChevronDoubleRight,
    PlusIcon,
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

    const setCurrentDate = (date: Date) => {
      currentDate.value = date;
    };

    const addCurrentDate = (add: number) => {
      setCurrentDate(
        new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth(),
          currentDate.value.getDate() + add
        )
      );
    };

    const goToNextDayItem = (): void => {
      extraDayIndex.value += 1;
      addCurrentDate(1);
    };

    const goToPrevDayItem = (): void => {
      extraDayIndex.value -= 1;
      addCurrentDate(-1);
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

    const updateTodoItem = (todoId: string, value: Partial<Todo>): void => {
      store.commit(Mutation.UPDATE_TODO, { id: todoId, value } as {
        id: string;
        value: Todo;
      });
    };

    const insertNewTodo = (value: string, date: Date, listId?: string): void => {
      newTodoItemInputField.value = '';

      store.commit(Mutation.ADD_TODO, {
        value: {
          id: 'someunqiueid' + value,
          name: value,
          date: !listId ? date : undefined,
          listId: listId,
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
        const date = new Date(day);
        date.setHours(0, 0, 0, 0);
        days.push(date);
      }

      return days;
    });

    const todosAtDate = (date: Date): Todo[] | undefined => {
      return store.getters.mappedTodos[date.toDateString()];
    };

    const sizeOfLists = computed((): number => Object.keys(lists.value).length);

    const toggleTodoStatus = (todoId: string): void => {
      store.commit(Mutation.TOGGLE_TODO_STATUS, { id: todoId });
    };

    const updateListOfTodoItem = (e: any) => {
      if (!isNaN(new Date(e.newListId).getTime())) {
        store.commit(Mutation.UPDATE_TODO, {
          id: e.todoItem.id,
          value: { date: new Date(e.newListId), listId: undefined },
        });
      } else {
        store.commit(Mutation.UPDATE_TODO, {
          id: e.todoItem.id,
          value: { date: undefined, listId: e.newListId },
        });
      }
    };

    const goWeekForward = (): void => {
      extraDayIndex.value += 7;
      addCurrentDate(7);
    };

    const goWeekBack = (): void => {
      extraDayIndex.value -= 7;
      addCurrentDate(-7);
    };

    const isCalendarVisible = ref(false);

    const toggleCalendar = (): void => {
      isCalendarVisible.value = !isCalendarVisible.value;
    };

    const hideCalendar = (): void => {
      isCalendarVisible.value = false;
    };

    const dayOfYear = (date: Date) =>
      Math.floor(
        (date.valueOf() - new Date(date.getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24
      );

    const goToDate = (dateStr: string): void => {
      const today = new Date();
      const currentDayOfYear = dayOfYear(today);
      const clickedDayOfYear = dayOfYear(new Date(dateStr));
      extraDayIndex.value = clickedDayOfYear - currentDayOfYear;
      setCurrentDate(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + extraDayIndex.value)
      );
    };

    const updateListTitle = (newValue: string, listId: string): void => {
      store.commit(Mutation.UPDATE_LIST_TITLE, {
        newValue,
        listId,
      });
    };

    const createNewList = (): void => {
      store.commit(Mutation.CREATE_LIST);
    };

    const lists = computed(() => store.getters.mappedLists);

    const removeTodoItem = (id: string): void => {
      store.commit(Mutation.REMOVE_TODO, { id });
    };

    return {
      removeTodoItem,
      createNewList,
      updateListTitle,
      goToDate,
      isCalendarVisible,
      hideCalendar,
      toggleCalendar,
      goWeekForward,
      goWeekBack,
      updateListOfTodoItem,
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
