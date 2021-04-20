import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import { UserResolver } from './resolvers/UserResolver';
import { MyContext } from './MyContext';

(async () => {
  const prisma = new PrismaClient();
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: (): MyContext => ({ prisma }),
  });

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.listen(4000, () => {
    console.log('server started on port 4000');
  });
})();
