import { login } from './user/login';
import { register } from './user/register';
import { logout } from './user/logout';
import { createList } from './list/createList';
import { deleteList } from './list/deleteList';
import { updateList } from './list/updateList';
import { updateTodo } from './todo/updateTodo';
import { moveToList } from './list/moveToList';
import { addTodoWithDate } from './todo/addTodoWithDate';
import { addTodoToList } from './todo/addTodoToList';
import { deleteTodo } from './todo/deleteTodo';

export default {
  login,
  logout,
  register,
  createList,
  deleteList,
  updateList,
  updateTodo,
  moveToList,
  addTodoWithDate,
  addTodoToList,
  deleteTodo,
};
