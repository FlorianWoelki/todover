import { GetterTree } from 'vuex';
import { ListType, State, Todo } from './state';

export type Getters = {
  mappedLists(state: State): any;
  mappedTodos(state: State): any;
};

export const getters: GetterTree<State, State> & Getters = {
  mappedLists(state) {
    const todos = state.todos as Todo[];
    const listIds: string[] = state.lists.map((list) => list.id);
    const lists: ListType = {};
    listIds.forEach((list) => {
      lists[list] = [];
    });

    todos
      .filter((todo) => todo.listId)
      .forEach((todo) => {
        if (lists[todo.listId!]) {
          lists[todo.listId!].push(todo);
        }
      });

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
