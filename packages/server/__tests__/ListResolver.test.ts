import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { Request } from 'express';
import { List } from '../src/entities/List';
import { Todo } from '../src/entities/Todo';
import { constructTestServer } from './util/server';
import { cleanupUser, createUser, login } from './util/user';

const prisma = new PrismaClient();
let request: Partial<Request>;
let server: ApolloServer;
let list: Partial<List> = {};

let createdTodoInList: Partial<Todo> = {};

const CREATE_LIST = gql`
  mutation createList($name: String!) {
    createList(name: $name) {
      id
      name
      todos {
        name
      }
    }
  }
`;

const DELETE_LIST = gql`
  mutation deleteList($id: String!) {
    deleteList(id: $id) {
      id
      name
    }
  }
`;

const LISTS = gql`
  query lists {
    lists {
      id
      name
      todos {
        listId
        name
      }
    }
  }
`;

const ADD_TODO_TO_LIST = gql`
  mutation addTodoToList($data: AddTodoToListInput!) {
    addTodoToList(data: $data) {
      id
      name
      listId
    }
  }
`;

beforeAll(async () => {
  server = (await constructTestServer(prisma)).server;
  await createUser(prisma);

  request = await login(server);
  server = (await constructTestServer(prisma, request)).server;
});

afterAll(async () => {
  const toDeleteList = await prisma.list.findUnique({ where: { id: list.id } });
  if (toDeleteList) {
    await prisma.list.delete({ where: { id: toDeleteList.id } });
  }

  const toDeleteTodo = await prisma.todo.findUnique({ where: { id: createdTodoInList.id } });
  if (toDeleteTodo) {
    await prisma.todo.delete({ where: { id: toDeleteTodo.id } });
  }

  await cleanupUser(prisma);
  await prisma.$disconnect();
});

describe('Mutations', () => {
  it('createList', async () => {
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: CREATE_LIST,
      variables: {
        name: 'Test List',
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.createList.name).toBe('Test List');
    expect(res.data?.createList.todos).toHaveLength(0);
    list = res.data?.createList;
  });

  it('deleteList', async () => {
    const mutate = createTestClient(server).mutate;

    const createListRes = await mutate({
      mutation: CREATE_LIST,
      variables: {
        name: 'Delete list test',
      },
    });
    const list: List = createListRes.data?.createList;

    const res = await mutate({
      mutation: DELETE_LIST,
      variables: {
        id: list.id,
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.deleteList.id).toBe(list.id);
    expect(res.data?.deleteList.name).toBe(list.name);
  });

  it('addTodoToList', async () => {
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: ADD_TODO_TO_LIST,
      variables: {
        data: {
          name: 'test todo',
          listId: list.id,
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.addTodoToList.name).toBe('test todo');
    expect(res.data?.addTodoToList.listId).toBe(list.id);
    createdTodoInList = res.data?.addTodoToList;
  });
});

describe('Queries', () => {
  it('lists', async () => {
    const query = createTestClient(server).query;

    const res = await query({
      query: LISTS,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.lists).toHaveLength(1);
    expect(res.data?.lists[0].id).toBe(list.id);
    expect(res.data?.lists[0].name).toBe(list.name);
    expect(res.data?.lists[0].todos).toHaveLength(1);
    expect(res.data?.lists[0].todos[0].name).toBe(createdTodoInList.name);
  });
});
