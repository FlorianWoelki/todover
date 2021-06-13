export interface ListType {
  [key: string]: Todo[];
}

export interface List {
  id: string;
  name: string;
}

export type TodoRepetition = 'weekly' | 'daily';

export interface Todo {
  id: string;
  name: string;
  date?: Date;
  repetition?: TodoRepetition;
  done?: boolean;
  listId?: string;
  description?: string;
}

interface User {
  accessToken?: string;
}

export interface State {
  user: User;
  todos: Todo[];
  lists: List[];
}

export const state: State = {
  user: {
    accessToken: undefined,
  },
  todos: [
    {
      id: 'weekly_todo_item',
      name: 'My weekly todo',
      date: new Date(),
      repetition: 'weekly',
    },
    {
      id: 'today_item',
      name: 'My today item',
      date: new Date(),
      repetition: 'daily',
    },
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
      id: '1234',
      name: 'Todo item in another list',
      listId: '123456789',
    },
    {
      id: 'HelloWorld',
      name: 'Hello World Item',
      listId: 'awesomelistid',
      description: 'Hello World this is a little description',
    },
  ],
  lists: [
    {
      id: 'awesomelistid',
      name: 'Other Things',
    },
    {
      id: '123456789',
      name: 'Things',
    },
  ],
};
