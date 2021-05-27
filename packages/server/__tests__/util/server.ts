import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { createSchema } from '../../src/utils/createSchema';

export const constructTestServer = async (prisma: PrismaClient, request?: Partial<Request>) => {
  const schema = await createSchema();
  const server = new ApolloServer({
    schema,
    playground: true,
    context: ({ req = request }) => ({ req, prisma }),
  });
  return { server, prisma };
};
