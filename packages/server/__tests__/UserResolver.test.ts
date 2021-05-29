import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { sign } from 'jsonwebtoken';
import { Request } from 'express';
import { cleanupUser } from './util/user';
import { constructTestServer } from './util/server';

const prisma = new PrismaClient();
let request: Partial<Request>;
let server: ApolloServer;

const randomAccessToken = sign({ userId: 1 }, process.env.ACCESS_TOKEN_SECRET!, {
  expiresIn: '15m',
});
const unauthorizedRequest = {
  headers: {
    authorization: `bearer ${randomAccessToken}`,
  },
};

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

const ME = gql`
  query me {
    me {
      email
    }
  }
`;

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

  it('cannot return user without being logged in', async () => {
    const query = createTestClient(server).query;

    const res = await query({
      query: ME,
    });

    expect(res.data).toBeNull();
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

    const token = res.data?.login.accessToken;
    expect(res.errors).toBeUndefined();
    expect(token).not.toBeUndefined();
    request = { headers: { authorization: `bearer ${token}` } };
  });

  it('unauthorized user cannot get user data', async () => {
    server = (await constructTestServer(prisma, unauthorizedRequest)).server;

    const query = createTestClient(server).query;

    const res = await query({
      query: ME,
    });

    expect(res.data).toBeNull();
    expect(res.errors).toHaveLength(1);
  });

  it('should return user object', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const query = createTestClient(server).query;

    const res = await query({
      query: ME,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.me.email).toBe('test@test.de');
  });
});
