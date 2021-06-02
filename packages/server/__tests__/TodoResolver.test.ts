import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { Request } from 'express';
import { Todo } from '../src/entities/Todo';
import { constructTestServer } from './util/server';
import { cleanupUser, createUser } from './util/user';

const prisma = new PrismaClient();
let request: Partial<Request>;
let server: ApolloServer;

let todo: Partial<Todo> = {};

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($name: String!) {
    addTodo(name: $name) {
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
});

afterAll(async () => {
  const toDeleteTodo = await prisma.todo.findUnique({ where: { id: todo.id } });
  if (toDeleteTodo) {
    await prisma.todo.delete({ where: { id: todo.id } });
  }

  await cleanupUser(prisma);
  await prisma.$disconnect();
});

describe('Mutations', () => {
  it('login', async () => {
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        email: 'test@test.de',
        password: '123',
      },
    });

    const token = res.data?.login.accessToken;
    expect(res.errors).toBeUndefined();
    expect(token).not.toBeUndefined();
    request = { headers: { authorization: `bearer ${token}` } };
  });

  it('addTodo', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: ADD_TODO,
      variables: {
        name: 'Test Todo',
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.addTodo.id).not.toBeUndefined();
    expect(res.data?.addTodo.name).toBe('Test Todo');
    expect(res.data?.addTodo.done).toBe(false);
    expect(res.data?.addTodo.date).toBe(null);
    expect(res.data?.addTodo.repetition).toBe(null);
    expect(res.data?.addTodo.listId).toBe(null);
    expect(res.data?.addTodo.description).toBe(null);
    todo.id = res.data?.addTodo.id;
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
    expect(res.data?.updateTodo.date).toBe(null);
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
    expect(res.data?.updateTodo.date).toBe(null);
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
    expect(res.data?.todos[0].description).toBe(null);
  });
});
