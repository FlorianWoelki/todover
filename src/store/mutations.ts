import { MutationTree } from 'vuex';
import { State, Todo } from './state';

export enum Mutation {
  ADD_TODO = 'ADD_TODO',
  UPDATE_TODO = 'UPDATE_TODO',
  TOGGLE_TODO_STATUS = 'TOGGLE_TODO_STATUS',
}

export type Mutations<S = State> = {
  [Mutation.ADD_TODO](state: S, { value }: { value: Todo }): void;
  [Mutation.UPDATE_TODO](state: S, { value, todoIndex }: { value: Todo; todoIndex: number }): void;
  [Mutation.TOGGLE_TODO_STATUS](state: S, { todoIndex }: { todoIndex: number }): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.ADD_TODO](state: State, { value }) {
    state.todos.push(value);
  },
  [Mutation.UPDATE_TODO](state: State, { value, todoIndex }) {
    state.todos[todoIndex] = value;
  },
  [Mutation.TOGGLE_TODO_STATUS](state: State, { todoIndex }) {
    state.todos[todoIndex].done = !state.todos[todoIndex].done;
  },
};
