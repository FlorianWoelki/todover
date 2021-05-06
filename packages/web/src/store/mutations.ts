import { MutationTree } from 'vuex';
import { List, State, Todo } from './state';

export enum Mutation {
  ADD_TODO = 'ADD_TODO',
  UPDATE_LIST_TITLE = 'UPDATE_LIST_TITLE',
  UPDATE_TODO = 'UPDATE_TODO',
  TOGGLE_TODO_STATUS = 'TOGGLE_TODO_STATUS',
  CREATE_LIST = 'CREATE_LIST',
  REMOVE_TODO = 'REMOVE_TODO',
}

export type Mutations<S = State> = {
  [Mutation.REMOVE_TODO](state: S, { id }: { id: string }): void;
  [Mutation.ADD_TODO](state: S, { value }: { value: Todo }): void;
  [Mutation.UPDATE_LIST_TITLE](
    state: S,
    { newValue, listId }: { newValue: string; listId: string }
  ): void;
  [Mutation.UPDATE_TODO](state: S, { id, value }: { id: string; value: Partial<Todo> }): void;
  [Mutation.TOGGLE_TODO_STATUS](state: S, { id }: { id: string }): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.REMOVE_TODO](state: State, { id }) {
    const index = state.todos.findIndex((todo) => todo.id === id);
    if (index > -1) {
      state.todos.splice(index, 1);
    }
  },
  [Mutation.ADD_TODO](state: State, { value }) {
    state.todos.push(value);
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
  [Mutation.TOGGLE_TODO_STATUS](state: State, { id }) {
    const filteredTodosWithId = state.todos.filter((todo) => todo.id === id);
    if (filteredTodosWithId.length === 1) {
      filteredTodosWithId[0].done = !filteredTodosWithId[0].done;
    }
  },
  [Mutation.CREATE_LIST](state: State) {
    state.lists.push({ id: `someid${state.lists.length + 1}`, name: 'Unnamed' } as List);
  },
};
