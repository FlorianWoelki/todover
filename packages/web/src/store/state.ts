export interface ListType {
  [key: string]: Todo[];
}

export interface List {
  id: string;
  name: string;
  todos: Todo[];
}

export interface Todo {
  id: string;
  name: string;
  done?: boolean;
}

export interface DayTodo extends Todo {
  date: Date;
}

export interface State {
  todos: DayTodo[];
  lists: List[];
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
  ],
  lists: [
    {
      id: 'myawesomelist',
      name: 'Things',
      todos: [
        {
          id: '1234',
          name: 'Todo item in another list',
        },
      ],
    },
    {
      id: '123ListId',
      name: 'Other Things',
      todos: [
        {
          id: 'HelloWorld',
          name: 'Hello World Item',
        },
      ],
    },
  ],
};
