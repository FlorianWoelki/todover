import { GetterTree } from 'vuex';
import { State, Todo } from './state';

export type Getters = {
  mappedTodos(state: State): any;
};

export const getters: GetterTree<State, State> & Getters = {
  mappedTodos(state) {
    const result: Record<string, Todo[]> = {};
    const todosWithDate = state.todos.filter((todo) => todo.date);
    todosWithDate.forEach((todo) => {
      if (result[todo.date!.toDateString()]) {
        result[todo.date!.toDateString()].push(todo);
      } else {
        result[todo.date!.toDateString()] = [todo];
      }
    });
    return result;
  },
};
