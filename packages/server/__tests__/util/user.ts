import { PrismaClient } from '@prisma/client';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { hash } from 'bcryptjs';
import { Request } from 'express';
import { SALT } from '../../src/auth';

const email = 'test@test.de';
const password = '123';

export const createUser = async (prisma: PrismaClient): Promise<void> => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    await prisma.user.delete({ where: { email } });
  }

  await prisma.user.create({
    data: {
      email,
      password: await hash(password, SALT),
    },
  });
};

export const cleanupUser = async (prisma: PrismaClient): Promise<void> => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    await prisma.user.delete({ where: { email } });
  }
};

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

export const login = async (server: ApolloServer): Promise<Partial<Request>> => {
  const mutate = createTestClient(server).mutate;

  const res = await mutate({
    mutation: LOGIN,
    variables: {
      email,
      password,
    },
  });

  const token = res.data?.login.accessToken;
  return { headers: { authorization: `bearer ${token}` } };
};
