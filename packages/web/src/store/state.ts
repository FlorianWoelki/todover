export interface ListType {
  [key: string]: Todo[];
}

export interface Todo {
  id: string;
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
      id: 'specific_id',
      name: 'First todo item',
      date: new Date(2021, 3, 9),
    },
    {
      id: 'specific_id_123',
      name: 'Second today item',
      date: new Date(2021, 3, 11),
    },
    {
      id: 'specific_id_123_345',
      name: 'Third today item',
      date: new Date(2021, 3, 11),
    },
    {
      id: 'todayitem',
      name: 'Today Item',
      date: new Date(2021, 3, 24),
    },
    {
      id: 'HelloWorld',
      name: 'Hello World Item',
      list: 'Other Things',
    },
    {
      id: '1234',
      name: 'Todo item in a other list',
      list: 'Things',
    },
  ],
};
