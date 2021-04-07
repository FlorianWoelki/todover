import { MutationTree } from 'vuex';
import { State } from './state';

export enum Mutation {
  ADD_DAY_TODO = 'ADD_DAY_TODO',
  ADD_LIST_TODO = 'ADD_LIST_TODO',
  UPDATE_DAY_TODO = 'UPDATE_DAY_TODO',
  UPDATE_LIST_TODO = 'UPDATE_LIST_TODO',
}

export type Mutations<S = State> = {
  [Mutation.ADD_DAY_TODO](state: S, { value, dayIndex }: { value: string; dayIndex: number }): void;
  [Mutation.ADD_LIST_TODO](
    state: S,
    { value, listIndex }: { value: string; listIndex: number }
  ): void;
  [Mutation.UPDATE_DAY_TODO](
    state: S,
    { value, dayIndex, todoIndex }: { value: string; dayIndex: number; todoIndex: number }
  ): void;
  [Mutation.UPDATE_LIST_TODO](
    state: S,
    { value, listIndex, todoIndex }: { value: string; listIndex: number; todoIndex: number }
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.ADD_DAY_TODO](state: State, { value, dayIndex }) {
    state.days[dayIndex].todos.push(value);
  },
  [Mutation.ADD_LIST_TODO](state: State, { value, listIndex }) {
    state.lists[listIndex].todos.push(value);
  },
  [Mutation.UPDATE_DAY_TODO](state: State, { value, dayIndex, todoIndex }) {
    state.days[dayIndex].todos[todoIndex] = value;
  },
  [Mutation.UPDATE_LIST_TODO](state: State, { value, listIndex, todoIndex }) {
    state.lists[listIndex].todos[todoIndex] = value;
  },
};
