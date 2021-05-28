import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from '../../src/utils/createSchema';

export const constructTestServer = async (prisma: PrismaClient, request?: Partial<Request>) => {
  const schema = await createSchema();
  const response = {
    cookie: jest.fn((_name: string, _token: string, _obj: any) => true),
  };

  const server = new ApolloServer({
    schema,
    playground: true,
    context: ({ req = request, res = response }) => ({ req, prisma, res }),
  });
  return { server, prisma };
};
