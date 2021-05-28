import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
// import { MockContext, MyContext, createMockContext } from '../src/MyContext';
import { Request } from 'express';
import { cleanupUser } from './util/user';
import { constructTestServer } from './util/server';

const prisma = new PrismaClient();
// let mockCtx: MockContext;
// let ctx: MyContext;
let request: Partial<Request>;

const REGISTER = gql`
  mutation register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      email
    }
  }
`;

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

beforeEach(() => {
  // mockCtx = createMockContext();
  // ctx = (mockCtx as unknown) as MyContext;
});

let server: ApolloServer;

beforeAll(async () => {
  server = (await constructTestServer(prisma)).server;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Mutations', () => {
  it('should register a new user', async () => {
    // clean up user for new registering
    await cleanupUser(prisma);

    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        email: 'test@test.de',
        password: '123',
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.register.email).toBe('test@test.de');
  });

  it('should login a new user', async () => {
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        email: 'test@test.de',
        password: '123',
      },
    });

    console.log(res.data);
    const token = res.data?.login.accessToken;
    expect(res.errors).toBeUndefined();
    expect(token).not.toBeUndefined();
    request = { headers: { authorization: `bearer ${token}` } };
    console.log(request);
  });
});
