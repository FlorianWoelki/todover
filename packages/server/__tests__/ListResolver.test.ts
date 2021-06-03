import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { Request } from 'express';
import { constructTestServer } from './util/server';
import { cleanupUser, createUser, login } from './util/user';

const prisma = new PrismaClient();
let request: Partial<Request>;
let server: ApolloServer;

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

beforeAll(async () => {
  server = (await constructTestServer(prisma)).server;
  await createUser(prisma);

  request = await login(server);
  server = (await constructTestServer(prisma, request)).server;
});

afterAll(async () => {
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
  });
});
