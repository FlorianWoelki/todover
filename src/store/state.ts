export interface DayList {
  todos: string[];
}

export interface List {
  name: string;
  todos: string[];
}

export interface State {
  days: DayList[];
  lists: List[];
}

export const state: State = {
  days: [
    {
      todos: ['First day todo'],
    },
    {
      todos: ['Second day todo'],
    },
    {
      todos: ['Third day todo'],
    },
    {
      todos: ['Fourth day todo'],
    },
    {
      todos: ['Fifth day todo'],
    },
  ],
  lists: [
    {
      name: 'List One',
      todos: [],
    },
    {
      name: 'Watchlist',
      todos: ['Harry Potter'],
    },
  ],
};
