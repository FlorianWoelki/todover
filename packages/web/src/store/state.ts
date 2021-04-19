export interface ListType {
  [key: string]: Todo[];
}

export interface Todo {
  name: string;
  date?: Date;
  list?: string;
  done?: boolean;
}

export interface State {
  todos: Todo[];
}

export const state: State = {
  todos: [
    {
      name: 'First todo item',
      date: new Date(2021, 3, 9),
    },
    {
      name: 'Second today item',
      date: new Date(2021, 3, 11),
    },
    {
      name: 'Third today item',
      date: new Date(2021, 3, 11),
    },
    {
      name: 'Todo item in a other list',
      list: 'Things',
    },
  ],
};
