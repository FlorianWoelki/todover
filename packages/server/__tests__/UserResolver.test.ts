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

const randomAccessToken = sign({ userId: -1 }, process.env.ACCESS_TOKEN_SECRET!, {
  expiresIn: '15m',
});
const unauthorizedRequest = {
  headers: {
    authorization: `bearer ${randomAccessToken}`,
  },
};

const REGISTER = gql`
  mutation register($data: UserInput!) {
    register(data: $data) {
      email
    }
  }
`;

const LOGIN = gql`
  mutation login($data: UserInput!) {
    login(data: $data) {
      accessToken
    }
  }
`;

const ME = gql`
  query me {
    me {
      email
      settings {
        language
      }
    }
  }
`;

const UPDATE_SETTINGS = gql`
  mutation updateSettings($data: UpdateSettingsInput!) {
    updateSettings(data: $data) {
      userId
      language
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
  it('register', async () => {
    // clean up user for new registering
    await cleanupUser(prisma);

    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: REGISTER,
      variables: {
        data: {
          email: 'test@test.de',
          password: '123',
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.register.email).toBe('test@test.de');
  });

  it('login', async () => {
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: LOGIN,
      variables: {
        data: {
          email: 'test@test.de',
          password: '123',
        },
      },
    });

    const token = res.data?.login.accessToken;
    expect(res.errors).toBeUndefined();
    expect(token).not.toBeUndefined();
    request = { headers: { authorization: `bearer ${token}` } };
  });

  it('updateSettings - change language to de', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: UPDATE_SETTINGS,
      variables: {
        data: {
          language: 'de',
        },
      },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.updateSettings.userId).toBeDefined();
    expect(res.data?.updateSettings.language).toBe('de');
  });

  it('updateSettings - change language to invalid slug', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const mutate = createTestClient(server).mutate;

    const res = await mutate({
      mutation: UPDATE_SETTINGS,
      variables: {
        data: {
          language: 'hello',
        },
      },
    });

    expect(res.errors).toBeDefined();
    expect(res.data).toBeNull();
  });
});

describe('Queries', () => {
  it('me - without being logged in', async () => {
    server = (await constructTestServer(prisma)).server;
    const query = createTestClient(server).query;

    const res = await query({
      query: ME,
    });

    expect(res.data).toBeNull();
  });

  it('me - unauthorized token', async () => {
    server = (await constructTestServer(prisma, unauthorizedRequest)).server;

    const query = createTestClient(server).query;

    const res = await query({
      query: ME,
    });

    expect(res.data).toBeNull();
    expect(res.errors).toHaveLength(1);
  });

  it('me', async () => {
    server = (await constructTestServer(prisma, request)).server;
    const query = createTestClient(server).query;

    const res = await query({
      query: ME,
    });

    expect(res.errors).toBeUndefined();
    expect(res.data?.me.settings).toMatchObject({ language: 'de' });
    expect(res.data?.me.email).toBe('test@test.de');
  });
});
