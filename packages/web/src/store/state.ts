export interface ListType {
  [key: string]: Todo[];
}

export interface List {
  id: string;
  name: string;
}

export interface Todo {
  id: string;
  name: string;
  date?: Date;
  done?: boolean;
  listId?: string;
}

export interface State {
  todos: Todo[];
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
    {
      id: '1234',
      name: 'Todo item in another list',
      listId: '123456789',
    },
    {
      id: 'HelloWorld',
      name: 'Hello World Item',
      listId: 'awesomelistid',
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
