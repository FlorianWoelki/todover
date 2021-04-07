export interface Todo {
  name: string;
  done?: boolean;
}

export interface DayList {
  todos: Todo[];
}

export interface List {
  name: string;
  todos: Todo[];
}

export interface State {
  days: DayList[];
  lists: List[];
}

export const state: State = {
  days: [
    {
      todos: [{ name: 'First day todo' }],
    },
    {
      todos: [{ name: 'Second day todo' }],
    },
    {
      todos: [{ name: 'Third day todo' }],
    },
    {
      todos: [{ name: 'Fourth day todo' }],
    },
    {
      todos: [{ name: 'Fifth day todo' }],
    },
  ],
  lists: [
    {
      name: 'List One',
      todos: [],
    },
    {
      name: 'Watchlist',
      todos: [{ name: 'Harry Potter' }],
    },
  ],
};
