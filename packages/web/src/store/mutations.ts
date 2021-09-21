import { MutationTree } from 'vuex';
import { List, Me, Settings, State, Todo } from './state';

export enum Mutation {
  ADD_TODO = 'ADD_TODO',
  UPDATE_LIST_TITLE = 'UPDATE_LIST_TITLE',
  UPDATE_TODO = 'UPDATE_TODO',
  CREATE_LIST = 'CREATE_LIST',
  REMOVE_TODO = 'REMOVE_TODO',
  REMOVE_LIST = 'REMOVE_LIST',
  SET_ME = 'SET_ME',
  SET_LOADING = 'SET_LOADING',
  SET_LISTS = 'SET_LISTS',
  SET_TODOS = 'SET_TODOS',
  SET_SELECTED_TODO_ITEM = 'SET_SELECTED_TODO_ITEM',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
}

export type Mutations<S = State> = {
  [Mutation.CREATE_LIST](state: S, value: List): void;
  [Mutation.ADD_TODO](state: S, { value }: { value: Todo }): void;
  [Mutation.UPDATE_LIST_TITLE](
    state: S,
    { newValue, listId }: { newValue: string; listId: string }
  ): void;
  [Mutation.UPDATE_TODO](state: S, { id, value }: { id: string; value: Partial<Todo> }): void;
  [Mutation.REMOVE_TODO](state: S, { id }: { id: string }): void;
  [Mutation.REMOVE_LIST](state: S, { id }: { id: string }): void;
  [Mutation.SET_ME](state: S, { value }: { value: Me | undefined }): void;
  [Mutation.SET_LOADING](state: S, value: boolean): void;
  [Mutation.SET_LISTS](state: S, value: List[]): void;
  [Mutation.SET_TODOS](state: S, value: Todo[]): void;
  [Mutation.SET_SELECTED_TODO_ITEM](state: S, value: Todo): void;
  [Mutation.UPDATE_SETTINGS](state: S, value: Settings): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.ADD_TODO](state: State, { value }) {
    state.todos.push(value);
    if (value.listId) {
      const list = state.lists.find((list) => list.id === value.listId);
      if (list) {
        list.todos.push(value);
      }
    }
  },
  [Mutation.UPDATE_LIST_TITLE](state: State, { newValue, listId }) {
    const list = state.lists.find((list) => list.id === listId);
    if (list) {
      const newList = { ...list, name: newValue };
      state.lists = [...state.lists.filter((list) => list.id !== listId), newList];
    }
  },
  [Mutation.UPDATE_TODO](state: State, { id, value }) {
    const filteredTodosWithId = state.todos.filter((todo) => todo.id === id);
    if (filteredTodosWithId.length === 1) {
      const newTodo = { ...filteredTodosWithId[0], ...value };
      state.todos = [...state.todos.filter((todo) => todo.id !== id), newTodo];
    }
  },
  [Mutation.CREATE_LIST](state: State, value) {
    const newValue = { ...value, todos: [] };
    state.lists = state.lists.concat(newValue);
  },
  [Mutation.REMOVE_TODO](state: State, { id }) {
    const index = state.todos.findIndex((todo) => todo.id === id);
    if (index > -1) {
      const todo = state.todos[index];
      const list = state.lists.find((list) => list.id === todo.listId);
      state.todos.splice(index, 1);

      if (todo.listId && list) {
        const indexInList = list.todos.findIndex((todo) => todo.id === id);
        if (indexInList > -1) {
          list.todos.splice(indexInList, 1);
        }
      }
    }
  },
  [Mutation.REMOVE_LIST](state: State, { id }): void {
    const index = state.lists.findIndex((list) => list.id === id);
    const notInListTodos = state.todos.filter((todo) => todo.listId !== id);
    state.todos = notInListTodos;
    if (index > -1) {
      state.lists = [...state.lists];
      state.lists.splice(index, 1);
    }
  },
  [Mutation.SET_ME](state: State, value) {
    state.me = value?.value ?? undefined;
  },
  [Mutation.SET_LOADING](state: State, value) {
    state.loading = value;
  },
  [Mutation.SET_LISTS](state: State, value) {
    state.lists = value;
  },
  [Mutation.SET_TODOS](state: State, value) {
    const newValue = value.map((todo) => {
      // need to parse string because date comes in the format of a string from the backend
      if (todo.date && typeof todo.date === 'string') {
        const newTodo = {
          ...todo,
          date: new Date(todo.date),
        };
        return newTodo;
      }

      return todo;
    });
    state.todos = newValue;
  },
  [Mutation.SET_SELECTED_TODO_ITEM](state: State, value) {
    state.selectedTodoItem = value;
  },
  [Mutation.UPDATE_SETTINGS](state: State, value) {
    state.userSettings = value;
  },
};
