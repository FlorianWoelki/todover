import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { Request } from 'express';
import { Todo } from '../src/entities/Todo';
import { constructTestServer } from './util/server';
import { cleanupUser, createUser, login } from './util/user';

const prisma = new PrismaClient();
let request: Partial<Request>;
let server: ApolloServer;

let todo: Partial<Todo> = {};

const ADD_TODO_WITH_DATE = gql`
  mutation addTodoWithDate($data: AddTodoWithDateInput!) {
    addTodoWithDate(data: $data) {
      id
      name
      done
      date
      repetition
      listId
      description
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: String!, $data: UpdateTodoInput!) {
    updateTodo(id: $id, data: $data) {
      id
      name
      done
      date
      repetition
      listId
      description
    }
  }
`;

const TODOS = gql`
  query todos {
    todos {
      id
      name
      done
      date
      repetition
      listId
      description
    }
  }
`;

beforeAll(async () => {
  server = (await constructTestServer(prisma)).server;
  await createUser(prisma);

  request = await login(server);
});

afterAll(async () => {
  const toDeleteTodo = await prisma.todo.findUnique({ where: { id: todo.id } });
  if (toDeleteTodo) {
    await prisma.todo.delete({ where: { id: toDeleteTodo.id } });
  }

  await cleanupUser(prisma);
  await prisma.$disconnect();
});

describe('Mutations', () => {
  it('addTodoWithDate', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;
    const date = new Date();

    const res = await mutate({
      mutation: ADD_TODO_WITH_DATE,
      variables: {
        data: {
          name: 'Test Todo',
          date: date.toISOString(),
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.addTodoWithDate.id).not.toBeUndefined();
    expect(res.data?.addTodoWithDate.name).toBe('Test Todo');
    expect(res.data?.addTodoWithDate.done).toBe(false);
    expect(res.data?.addTodoWithDate.date).toBe(date.toISOString());
    expect(res.data?.addTodoWithDate.repetition).toBe(null);
    expect(res.data?.addTodoWithDate.listId).toBe(null);
    expect(res.data?.addTodoWithDate.description).toBe(null);
    todo = res.data?.addTodoWithDate;
    todo.date = date;
  });

  it('updateTodo - change name', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;
    const name = 'updated todo name';

    const res = await mutate({
      mutation: UPDATE_TODO,
      variables: {
        id: todo.id,
        data: {
          name,
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.updateTodo.id).toBe(todo.id);
    expect(res.data?.updateTodo.name).toBe(name);
    expect(res.data?.updateTodo.done).toBe(false);
    expect(res.data?.updateTodo.date).toBe(todo.date?.toISOString());
    expect(res.data?.updateTodo.repetition).toBe(null);
    expect(res.data?.updateTodo.listId).toBe(null);
    expect(res.data?.updateTodo.description).toBe(null);
    todo.name = name;
  });

  it('updateTodo - change done', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: UPDATE_TODO,
      variables: {
        id: todo.id,
        data: {
          done: true,
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.updateTodo.id).toBe(todo.id);
    expect(res.data?.updateTodo.name).toBe(todo.name);
    expect(res.data?.updateTodo.done).toBe(true);
    expect(res.data?.updateTodo.date).toBe(todo.date?.toISOString());
    expect(res.data?.updateTodo.repetition).toBe(null);
    expect(res.data?.updateTodo.listId).toBe(null);
    expect(res.data?.updateTodo.description).toBe(null);
    todo.done = true;
  });

  it('updateTodo - change date', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;
    const date = new Date();

    const res = await mutate({
      mutation: UPDATE_TODO,
      variables: {
        id: todo.id,
        data: {
          date: date.toISOString(),
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.updateTodo.id).toBe(todo.id);
    expect(res.data?.updateTodo.name).toBe(todo.name);
    expect(res.data?.updateTodo.done).toBe(todo.done);
    expect(res.data?.updateTodo.date).toBe(date.toISOString());
    expect(res.data?.updateTodo.repetition).toBe(null);
    expect(res.data?.updateTodo.listId).toBe(null);
    expect(res.data?.updateTodo.description).toBe(null);
    todo.date = date;
  });

  it('updateTodo - change repetition', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: UPDATE_TODO,
      variables: {
        id: todo.id,
        data: {
          repetition: 'weekly',
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.updateTodo.id).toBe(todo.id);
    expect(res.data?.updateTodo.name).toBe(todo.name);
    expect(res.data?.updateTodo.done).toBe(todo.done);
    expect(res.data?.updateTodo.date).toBe(todo.date?.toISOString());
    expect(res.data?.updateTodo.repetition).toBe('weekly');
    expect(res.data?.updateTodo.listId).toBe(null);
    expect(res.data?.updateTodo.description).toBe(null);
    todo.repetition = 'weekly';
  });

  it('updateTodo - change description', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;
    const description = 'Hello World Description';

    const res = await mutate({
      mutation: UPDATE_TODO,
      variables: {
        id: todo.id,
        data: {
          description,
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.updateTodo.id).toBe(todo.id);
    expect(res.data?.updateTodo.name).toBe(todo.name);
    expect(res.data?.updateTodo.done).toBe(todo.done);
    expect(res.data?.updateTodo.date).toBe(todo.date?.toISOString());
    expect(res.data?.updateTodo.repetition).toBe(todo.repetition);
    expect(res.data?.updateTodo.listId).toBe(null);
    expect(res.data?.updateTodo.description).toBe(description);
    todo.description = description;
  });
});

describe('Queries', () => {
  it('todos', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const query = createTestClient(server).query;

    const res = await query({
      query: TODOS,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.todos).toHaveLength(1);
    expect(res.data?.todos[0].id).toBe(todo.id);
    expect(res.data?.todos[0].name).toBe(todo.name);
    expect(res.data?.todos[0].done).toBe(todo.done);
    expect(res.data?.todos[0].date).toBe(todo.date?.toISOString());
    expect(res.data?.todos[0].repetition).toBe(todo.repetition);
    expect(res.data?.todos[0].listId).toBe(null);
    expect(res.data?.todos[0].description).toBe(todo.description);
  });
});
