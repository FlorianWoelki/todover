export interface ListType {
  [key: string]: {
    position: number;
    todos: Todo[];
  };
}

export interface List {
  id: string;
  name: string;
  position: number;
  todos: Todo[];
}

export type TodoRepetition = 'weekly' | 'daily';
export type TodoPriority = 'high' | 'normal' | 'low';

export const mapTodoPriorityToNumber = (priority: TodoPriority): number => {
  if (priority === 'high') {
    return 1;
  } else if (priority === 'low') {
    return -1;
  }
  return 0;
};

export interface Todo {
  id: string;
  name: string;
  repetition: TodoRepetition | null;
  priority: TodoPriority;
  createdAt: Date;
  date?: Date;
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
