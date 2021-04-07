import { MutationTree } from 'vuex';
import { State, Todo } from './state';

export enum Mutation {
  ADD_DAY_TODO = 'ADD_DAY_TODO',
  ADD_LIST_TODO = 'ADD_LIST_TODO',
  UPDATE_DAY_TODO = 'UPDATE_DAY_TODO',
  UPDATE_LIST_TODO = 'UPDATE_LIST_TODO',
  TOGGLE_TODO_STATUS = 'TOGGLE_TODO_STATUS',
}

export type Mutations<S = State> = {
  [Mutation.ADD_DAY_TODO](state: S, { value, dayIndex }: { value: string; dayIndex: number }): void;
  [Mutation.ADD_LIST_TODO](
    state: S,
    { value, listIndex }: { value: string; listIndex: number }
  ): void;
  [Mutation.UPDATE_DAY_TODO](
    state: S,
    { value, dayIndex, todoIndex }: { value: Todo; dayIndex: number; todoIndex: number }
  ): void;
  [Mutation.UPDATE_LIST_TODO](
    state: S,
    { value, listIndex, todoIndex }: { value: Todo; listIndex: number; todoIndex: number }
  ): void;
  [Mutation.TOGGLE_TODO_STATUS](
    state: S,
    {
      listType,
      listIndex,
      todoIndex,
    }: { listType: 'day' | 'list'; listIndex: number; todoIndex: number }
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.ADD_DAY_TODO](state: State, { value, dayIndex }) {
    state.days[dayIndex].todos.push({ name: value });
  },
  [Mutation.ADD_LIST_TODO](state: State, { value, listIndex }) {
    state.lists[listIndex].todos.push({ name: value });
  },
  [Mutation.UPDATE_DAY_TODO](state: State, { value, dayIndex, todoIndex }) {
    state.days[dayIndex].todos[todoIndex] = value;
  },
  [Mutation.UPDATE_LIST_TODO](state: State, { value, listIndex, todoIndex }) {
    state.lists[listIndex].todos[todoIndex] = value;
  },
  [Mutation.TOGGLE_TODO_STATUS](state: State, { listType, listIndex, todoIndex }) {
    if (listType === 'day') {
      state.days[listIndex].todos[todoIndex].done = !state.days[listIndex].todos[todoIndex].done;
    } else {
      state.lists[listIndex].todos[todoIndex].done = !state.lists[listIndex].todos[todoIndex].done;
    }
  },
};
