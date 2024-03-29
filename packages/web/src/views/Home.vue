<template>
  <div class="flex flex-col h-full font-sans antialiased">
    <div class="flex mb-4 h-1/2" style="min-height: calc(50% - 1.5rem)">
      <div class="flex flex-col items-center space-y-4">
        <button class="text-red-500 focus:outline-none hover:text-red-600" @click="goToPrevDayItem">
          <chevron-left-icon class="w-10 h-10" />
        </button>
        <button class="text-red-400 focus:outline-none hover:text-red-500" @click="goWeekBack">
          <chevron-double-left-icon class="w-6 h-6" />
        </button>
        <button
          class="text-red-400 focus:outline-none hover:text-red-500"
          @click="showSettingsModal = true"
        >
          <cog-icon class="w-6 h-6" />
        </button>
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
              :priority="todo.priority"
              :done="todo.done"
              :placeholder="$t('emptyTodoPlaceholder')"
              @update-item="updateTodoItem(todo.id, { name: $event })"
              @remove-item="removeTodoItem(todo.id)"
              @click="updateTodoItem(todo.id, { done: !todo.done })"
              @open-menu="selectedTodoItem = todo"
            ></todo-item>
            <todo-item
              v-for="(todo, j) in dailyTodos(day)"
              :todo-id="todo.id"
              :key="j"
              :priority="todo.priority"
              :value="todo.name"
              class="text-gray-400"
              no-dbl-click
              disabled
            >
              <refresh-icon class="self-center w-4 h-4 text-gray-300"></refresh-icon>
            </todo-item>
            <todo-item
              v-for="(todo, j) in weeklyTodos(day)"
              :todo-id="todo.id"
              :key="j"
              :priority="todo.priority"
              :value="todo.name"
              class="text-gray-400"
              no-dbl-click
              disabled
            >
              <refresh-icon class="w-5 h-5 text-gray-300"></refresh-icon>
            </todo-item>
          </template>
          <template #default="{ date }">
            <todo-item
              no-dbl-click
              :loading="isNewTodoItemInserting(date.toISOString())"
              @update-item="insertNewTodo($event, date)"
            ></todo-item>
          </template>
        </list-column>
      </list-grid>

      <div class="flex flex-col items-center space-y-4">
        <button class="text-red-500 focus:outline-none hover:text-red-600" @click="goToNextDayItem">
          <chevron-right-icon class="w-10 h-10" />
        </button>
        <button class="text-red-400 focus:outline-none hover:text-red-500" @click="goWeekForward">
          <chevron-double-right-icon class="w-6 h-6" />
        </button>
        <button
          class="relative text-red-400 focus:outline-none hover:text-red-500"
          @click="toggleCalendar"
        >
          <calendar-icon class="w-6 h-6" />
          <transition name="fade-in">
            <datepicker v-if="isCalendarVisible" class="right-0" @select-date="goToDate" />
          </transition>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between p-2 bg-gray-500">
      <a
        href="https://github.com/FlorianWoelki/todover"
        target="_blank"
        class="flex items-center justify-center text-gray-300 rounded-lg hover:text-gray-100 hover:text-gray-200 focus:outline-none"
      >
        <github-logo class="w-8 h-8"></github-logo>
      </a>
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
        <chevron-left-icon
          class="w-10 h-10"
          @click="goToPrevListItem"
          :class="{
            'text-red-500 cursor-pointer': currentListItem > 0,
            'text-gray-300 cursor-not-allowed': currentListItem <= 0,
          }"
        />
      </div>

      <p
        v-if="Object.keys(lists).length === 0"
        class="flex items-center justify-center w-full text-lg italic text-gray-300"
      >
        {{ $t('noLists') }}
      </p>
      <list-grid v-else class="w-full h-full">
        <list-column
          v-for="(list, i) in lists"
          :key="i"
          :index="i"
          :listId="list.id"
          :hide="i !== currentListItem && isSmallDevice"
          @end="updateListOfTodoItem"
          @remove-list="removeList(list.id)"
          @update-list-title="updateListTitle($event, list.id)"
          style="min-height: 300px"
        >
          <template #draggable>
            <todo-item
              v-for="(todo, j) in getSortedTodos(list.todos)"
              :todo-id="todo.id"
              :key="j"
              :value="todo.name"
              :priority="todo.priority"
              :done="todo.done"
              :placeholder="$t('emptyTodoPlaceholder')"
              @click="updateTodoItem(todo.id, { done: !todo.done })"
              @update-item="updateTodoItem(todo.id, { name: $event })"
              @remove-item="removeTodoItem(todo.id)"
              @open-menu="selectedTodoItem = todo"
            ></todo-item>
          </template>
          <template #default="{ date }">
            <todo-item
              no-dbl-click
              :loading="isNewTodoItemInserting(list.id)"
              @update-item="insertNewTodo($event, date, list.id)"
            ></todo-item>
          </template>
        </list-column>
      </list-grid>

      <div class="flex flex-col items-center space-y-4 lg:hidden">
        <chevron-right-icon
          class="w-10 h-10"
          @click="goToNextListItem"
          :class="{
            'text-red-500 cursor-pointer': currentListItem + 1 < sizeOfLists,
            'text-gray-300 cursor-not-allowed': currentListItem + 1 >= sizeOfLists,
          }"
        />
      </div>
    </div>
  </div>

  <transition name="fade-in">
    <todo-item-modal
      v-if="selectedTodoItem"
      :todo-item="selectedTodoItem"
      @hide-button="hideHideButton"
    ></todo-item-modal>
  </transition>

  <transition name="fade-in">
    <settings-modal v-if="showSettingsModal" @hide-button="hideHideButton"></settings-modal>
  </transition>

  <transition name="fade-in">
    <hide-button
      v-if="showSettingsModal || selectedTodoItem || isCalendarVisible"
      @click="hideHideButton"
    />
  </transition>
</template>

<script lang="ts">
import '@/assets/styles/transitions.css';
import { computed, defineComponent, ref, watch } from '@vue/runtime-core';
import { useStore } from 'vuex';
import ChevronLeftIcon from '../assets/icons/chevron-left.svg?component';
import ChevronDoubleLeftIcon from '../assets/icons/chevron-double-left.svg?component';
import ChevronRightIcon from '../assets/icons/chevron-right.svg?component';
import PlusIcon from '../assets/icons/plus.svg?component';
import GithubLogo from '../assets/github-logo.svg?component';
import ChevronDoubleRightIcon from '../assets/icons/chevron-double-right.svg?component';
import CogIcon from '../assets/icons/cog.svg?component';
import CalendarIcon from '../assets/icons/calendar.svg?component';
import RefreshIcon from '../assets/icons/refresh.svg?component';
import { Mutation } from '../store';
import { isSmallDevice, setupEventListener } from '../util/screen';
import { List, mapTodoPriorityToNumber, State, Todo } from '../store/state';
import { useMutation, useQuery } from '@vue/apollo-composable';
import queries from '@/graphql/queries';
import mutations from '../graphql/mutations';

export default defineComponent({
  components: {
    GithubLogo,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    PlusIcon,
    CogIcon,
    CalendarIcon,
    RefreshIcon,
  },
  setup() {
    setupEventListener();

    const store = useStore<State>();

    const newTodoItemInputField = ref<string>('');
    const newTodoInsertingInput = ref<string>('');
    const currentListItem = ref(0);
    const currentDate = ref(new Date());
    const extraDayIndex = ref(0);
    const showSettingsModal = ref<boolean>(false);

    const { mutate: updateTodoMutation } = useMutation(mutations.updateTodo);
    const {
      result: fetchedTodos,
      loading: fetchedTodosLoading,
      onError: onFetchedTodosError,
    } = useQuery(queries.todos);
    const { result: fetchedLists, onError: onFetchedListsError } = useQuery(queries.lists);
    const { mutate: addTodoWithDateMutation } = useMutation(mutations.addTodoWithDate);
    const { mutate: addTodoToListMutation } = useMutation(mutations.addTodoToList);
    const { mutate: moveToListMutation } = useMutation(mutations.moveToList);
    const { mutate: updateListMutation } = useMutation(mutations.updateList);
    const { mutate: createListMutation } = useMutation(mutations.createList);
    const { mutate: deleteTodoMutation } = useMutation(mutations.deleteTodo);
    const { mutate: deleteListMutation } = useMutation(mutations.deleteList);

    // handle error of fetched todos to set them to an empty arry
    onFetchedTodosError(() => {
      fetchedTodos.value = { todos: [] };
    });

    // handle error of fetched lists to set them to an empty arry
    onFetchedListsError(() => {
      fetchedLists.value = { lists: [] };
    });

    const selectedTodoItem = computed<Todo | undefined>({
      set(newTodo) {
        store.commit(Mutation.SET_SELECTED_TODO_ITEM, newTodo);
      },
      get() {
        return store.state.selectedTodoItem;
      },
    });

    watch(
      () => store.state.selectedTodoItem,
      (newValue) => {
        selectedTodoItem.value = newValue;
      }
    );

    // watch selected todo item in modal and update repetition if it was changed
    watch(
      () => selectedTodoItem.value?.repetition,
      (newValue) => {
        if (newValue !== undefined && store.state.me) {
          updateTodoMutation({ id: selectedTodoItem.value?.id, data: { repetition: newValue } });
        }
      }
    );

    // watch selected todo item in modal and update priority if it was changed
    watch(
      () => selectedTodoItem.value?.priority,
      (newValue) => {
        if (newValue !== undefined && store.state.me) {
          updateTodoMutation({ id: selectedTodoItem.value?.id, data: { priority: newValue } });
        }
      }
    );

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
      if (store.state.me) {
        updateTodoMutation({ id: todoId, data: value });
      }

      store.commit(Mutation.UPDATE_TODO, { id: todoId, value } as {
        id: string;
        value: Todo;
      });
    };

    // inserts a new todo item wether in a specific list or date column
    const insertNewTodo = (value: string, date: Date, listId?: string): void => {
      // if `listId` is defined then create it in a specific list
      // else it will be created in the selected date column
      if (!listId) {
        newTodoInsertingInput.value = date.toISOString();
        if (!store.state.me) {
          newTodoItemInputField.value = '';
          newTodoInsertingInput.value = '';
          store.commit(Mutation.ADD_TODO, {
            value: {
              id: `todo-${Math.random()}`,
              name: value,
              date,
            } as Todo,
          });
          return;
        }

        addTodoWithDateMutation({ data: { name: value, date } }).then((result) => {
          if (result?.data) {
            newTodoItemInputField.value = '';
            newTodoInsertingInput.value = '';
            store.commit(Mutation.ADD_TODO, {
              value: {
                id: result.data.addTodoWithDate.id,
                name: value,
                date,
              } as Todo,
            });
          }
        });
      } else {
        newTodoInsertingInput.value = listId;
        if (!store.state.me) {
          newTodoItemInputField.value = '';
          newTodoInsertingInput.value = '';
          store.commit(Mutation.ADD_TODO, {
            value: {
              id: `todo-${Math.random()}`,
              name: value,
              listId: listId,
            } as Todo,
          });
          return;
        }

        addTodoToListMutation({ data: { name: value, listId } }).then((result) => {
          if (result?.data) {
            newTodoItemInputField.value = '';
            newTodoInsertingInput.value = '';
            store.commit(Mutation.ADD_TODO, {
              value: {
                id: result.data.addTodoToList.id,
                name: value,
                listId: listId,
              } as Todo,
            });
          }
        });
      }
    };

    // returns a boolean which determine if this new todo item is inserting
    const isNewTodoItemInserting = (input: string): boolean => {
      return newTodoInsertingInput.value === input;
    };

    // computes the days of a specific week
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
      // add all dates in the range of a previousDate and the maxDate
      for (let day = clonedDate; day < maxDate; day.setDate(day.getDate() + 1)) {
        const date = new Date(day);
        date.setHours(0, 0, 0, 0);
        days.push(date);
      }

      return days;
    });

    const todosAtDate = (date: Date): Todo[] => {
      return store.state.todos
        .filter((todo) => todo.date?.toString() === date.toString())
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .sort((a, b) => mapTodoPriorityToNumber(b.priority) - mapTodoPriorityToNumber(a.priority));
    };

    const sizeOfLists = computed((): number => Object.keys(lists.value).length);

    // updates the list of a specific todo item
    const updateListOfTodoItem = (e: any) => {
      // check if the `newListId` is a date -> todo moved into date column
      // if it is not a date -> moving todo into a list
      if (!isNaN(new Date(e.newListId).getTime())) {
        if (store.state.me) {
          updateTodoMutation({
            id: e.todoItem.id,
            data: { date: new Date(e.newListId), listId: null },
          });
        }

        store.commit(Mutation.UPDATE_TODO, {
          id: e.todoItem.id,
          value: { date: new Date(e.newListId), listId: undefined },
        });

        // check past repeated todos because todo can be moved to the past
        checkPastRepeatedTodo();
      } else {
        if (store.state.me) {
          moveToListMutation({
            todoId: e.todoItem.id,
            listId: e.newListId,
          });
        }

        store.commit(Mutation.UPDATE_TODO, {
          id: e.todoItem.id,
          value: { date: undefined, repetition: undefined, listId: e.newListId },
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

    const hideHideButton = (): void => {
      isCalendarVisible.value = false;
      showSettingsModal.value = false;

      if (selectedTodoItem.value) {
        updateTodoItem(selectedTodoItem.value.id, {
          name: selectedTodoItem.value.name,
          description: selectedTodoItem.value.description,
        });
      }
      selectedTodoItem.value = undefined;
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
      if (store.state.me) {
        updateListMutation({ id: listId, data: { name: newValue } });
      }

      store.commit(Mutation.UPDATE_LIST_TITLE, {
        newValue,
        listId,
      });
    };

    const createNewList = (): void => {
      const listsLength = Object.entries(lists.value).length;
      let position = 0;
      if (listsLength !== 0) {
        position = Object.values(lists.value)[Object.keys(lists.value).length - 1].position + 1;
      }

      if (!store.state.me) {
        store.commit(Mutation.CREATE_LIST, { id: `list-${position}`, name: 'Unnamed', position });
        return;
      }

      createListMutation({ name: 'Unnamed', position }).then((result) => {
        if (result?.data) {
          store.commit(Mutation.CREATE_LIST, result.data.createList);
        }
      });
    };

    const lists = computed((): List[] => store.getters.sortedLists);

    const removeTodoItem = (id: string): void => {
      if (store.state.me) {
        deleteTodoMutation({ id });
      }

      store.commit(Mutation.REMOVE_TODO, { id });
    };

    const removeList = (id: string): void => {
      if (store.state.me) {
        deleteListMutation({ id });
      }

      store.commit(Mutation.REMOVE_LIST, { id });
    };

    const dailyTodos = (day: string): Todo[] => {
      const date = new Date(day);
      const todos = store.state.todos;

      return todos.filter(
        (todo) => todo.repetition === 'daily' && todo.date && todo.date.getTime() < date.getTime()
      );
    };

    const weeklyTodos = (day: string): Todo[] => {
      const date = new Date(day);
      const todos = store.state.todos;

      return todos.filter(
        (todo) =>
          todo.repetition === 'weekly' &&
          todo.date &&
          todo.date.getDay() === date.getDay() &&
          todo.date.getTime() < date.getTime()
      );
    };

    watch(fetchedLists, () => {
      const newLists: List[] = fetchedLists.value.lists.map((list: List) => ({
        ...list,
        todos: [],
      }));
      const todos: Todo[] = fetchedTodos.value.todos;
      todos
        .filter((todo) => todo.listId)
        .forEach((todo) => {
          const list = newLists.find((list) => list.id === todo.listId);
          if (list) {
            list.todos.push({
              ...todo,
              createdAt: new Date(todo.createdAt),
            });
          }
        });

      store.commit(Mutation.SET_LISTS, newLists);
    });

    watch(fetchedTodosLoading, () => {
      store.commit(Mutation.SET_TODOS, fetchedTodos.value.todos);
      checkPastRepeatedTodo();
    });

    const checkPastRepeatedTodo = (): void => {
      // check wether a todo is in the yesterday column
      const today = new Date();
      const todos = store.state.todos;
      const pastRepeatedTodos = todos.filter((todo) => {
        return (
          todo.date &&
          todo.date.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0) < 0 &&
          (todo.repetition === 'daily' || todo.repetition === 'weekly')
        );
      });

      pastRepeatedTodos.forEach((todo) => {
        // update yesterday todo item to have no repetition
        updateTodoItem(todo.id, { repetition: null });

        // calculate next week date
        const nextWeekDate = new Date();
        nextWeekDate.setDate(today.getDate() + 7);
        // set new inserted todo date based on repetition
        const date = todo.repetition === 'daily' ? today : nextWeekDate;

        if (!store.state.me) {
          store.commit(Mutation.ADD_TODO, {
            value: {
              ...todo,
              date,
            },
          });
          return;
        }

        addTodoWithDateMutation({
          data: {
            name: todo.name,
            date,
            description: todo.description,
            repetition: todo.repetition,
          },
        }).then((result) => {
          if (result?.data) {
            store.commit(Mutation.ADD_TODO, {
              value: {
                ...(result.data.addTodoWithDate as Todo),
                date,
              },
            });
          }
        });
      });
    };

    const getSortedTodos = (todos: Todo[]): Todo[] => {
      const newTodos = [...todos];
      return newTodos
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .sort((a, b) => mapTodoPriorityToNumber(b.priority) - mapTodoPriorityToNumber(a.priority));
    };

    return {
      showSettingsModal,
      getSortedTodos,
      isNewTodoItemInserting,
      weeklyTodos,
      dailyTodos,
      selectedTodoItem,
      removeList,
      removeTodoItem,
      createNewList,
      updateListTitle,
      goToDate,
      isCalendarVisible,
      hideHideButton,
      toggleCalendar,
      goWeekForward,
      goWeekBack,
      updateListOfTodoItem,
      insertNewTodo,
      updateTodoItem,
      newTodoItemInputField,
      days,
      lists,
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
