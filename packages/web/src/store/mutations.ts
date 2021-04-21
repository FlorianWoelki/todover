import { MutationTree } from 'vuex';
import { State, Todo } from './state';

export enum Mutation {
  ADD_TODO = 'ADD_TODO',
  UPDATE_TODO = 'UPDATE_TODO',
  TOGGLE_TODO_STATUS = 'TOGGLE_TODO_STATUS',
}

export type Mutations<S = State> = {
  [Mutation.ADD_TODO](state: S, { value }: { value: Todo }): void;
  [Mutation.UPDATE_TODO](state: S, { id, value }: { id: string; value: Partial<Todo> }): void;
  [Mutation.TOGGLE_TODO_STATUS](state: S, { id }: { id: string }): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.ADD_TODO](state: State, { value }) {
    state.todos.push(value);
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
};
