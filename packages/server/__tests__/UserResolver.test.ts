import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { Request } from 'express';
// import { MockContext, MyContext, createMockContext } from '../src/MyContext';
import { cleanupUser } from './util/testUser';
import { createSchema } from '../src/utils/createSchema';

const prisma = new PrismaClient();
// let mockCtx: MockContext;
// let ctx: MyContext;
// let request: Partial<Request>;

// TODO: refactor to jest setup file
const constructTestServer = async (request?: Partial<Request>) => {
  const schema = await createSchema();
  const server = new ApolloServer({
    schema,
    playground: true,
    context: ({ req = request }) => ({ req, prisma }),
  });
  return { server, prisma };
};

const REGISTER = gql`
  mutation register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      email
    }
  }
`;

beforeEach(() => {
  // mockCtx = createMockContext();
  // ctx = (mockCtx as unknown) as MyContext;
});

let server: ApolloServer;

beforeAll(async () => {
  // TODO: refactor to jest setup file
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5432/clean-todo-app?schema=public';
  process.env.ACCESS_TOKEN_SECRET = 'accesstokensecret';
  process.env.REFRESH_TOKEN_SECRET = 'refreshtokensecret';
  server = (await constructTestServer()).server;
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
});
