import { GetterTree } from 'vuex';
import { List, State } from './state';

export type Getters = {
  sortedLists(state: State): any;
};

export const getters: GetterTree<State, State> & Getters = {
  sortedLists(state) {
    const lists: List[] = [...state.lists];
    lists.sort((a, b) => a.position - b.position);
    return lists;
  },
};
