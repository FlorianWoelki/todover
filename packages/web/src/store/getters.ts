import { GetterTree } from 'vuex';
import { List, State, Todo } from './state';

export type Getters = {
  sortedLists(state: State): any;
  mappedTodos(state: State): any;
};

export const getters: GetterTree<State, State> & Getters = {
  sortedLists(state) {
    const lists: List[] = [...state.lists];
    lists.sort((a, b) => a.position - b.position);
    return lists;
  },
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
