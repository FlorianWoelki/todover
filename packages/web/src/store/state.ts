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
  repetition: TodoRepetition | null;
  done?: boolean;
  listId?: string;
  description?: string;
}

export interface Settings {
  language: string;
}

export interface Me {
  email?: string;
}

export interface State {
  todos: Todo[];
  lists: List[];
  loading: boolean;
  selectedTodoItem?: Todo;
  me?: Me;
  userSettings?: Settings;
}

export const state: State = {
  loading: true,
  me: undefined,
  todos: [],
  lists: [],
};
