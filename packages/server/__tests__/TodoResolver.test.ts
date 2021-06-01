import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { Request } from 'express';
import { constructTestServer } from './util/server';
import { cleanupUser, createUser } from './util/user';

const prisma = new PrismaClient();
let request: Partial<Request>;
let server: ApolloServer;
let todoId = '';

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

beforeAll(async () => {
  server = (await constructTestServer(prisma)).server;
  await createUser(prisma);
});

afterAll(async () => {
  const todo = await prisma.todo.findUnique({ where: { id: todoId } });
  if (todo) {
    await prisma.todo.delete({ where: { id: todoId } });
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
    expect(res.data?.addTodo.title).toBe('Test Todo');
    expect(res.data?.addTodo.done).toBe(false);
    expect(res.data?.addTodo.date).toBe(null);
    expect(res.data?.addTodo.repetition).toBe(null);
    expect(res.data?.addTodo.listId).toBe(null);
    expect(res.data?.addTodo.description).toBe(null);
    todoId = res.data?.addTodo.id;
    console.log(todoId);
  });
});

describe('Queries', () => {});
