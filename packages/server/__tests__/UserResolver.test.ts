import 'reflect-metadata';
import { PrismaClient } from '.prisma/client';
import { User } from '.prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { Request } from 'express';
import { MockContext, MyContext, createMockContext } from '../src/MyContext';
import { createSchema } from '../src/utils/createSchema';

const prisma = new PrismaClient();
let mockCtx: MockContext;
let ctx: MyContext;
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

const createUser = async (user: User, ctx: MyContext) => {
  return await ctx.prisma.user.create({ data: user });
};

beforeEach(() => {
  // TODO: refactor to jest setup file
  process.env.DATABASE_URL =
    'postgresql://postgres:postgres@localhost:5432/clean-todo-app?schema=public';
  process.env.ACCESS_TOKEN_SECRET = 'accesstokensecret';
  process.env.REFRESH_TOKEN_SECRET = 'refreshtokensecret';

  mockCtx = createMockContext();
  ctx = (mockCtx as unknown) as MyContext;
});

describe('Mutations', () => {
  it('should create new user', async () => {
    const { server } = await constructTestServer();
    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: REGISTER,
      variables: {
        email: 'test@test.de',
        password: '123',
      },
    });
    console.log(res);

    const user: User = {
      id: 1,
      email: 'test@test.de',
      password: '123',
      tokenVersion: null,
    };

    mockCtx.prisma.user.create.mockResolvedValue(user);

    await expect(createUser(user, ctx)).resolves.toEqual({
      id: 1,
      email: 'test@test.de',
      password: '123',
      tokenVersion: null,
    });
  });
});
