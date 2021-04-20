import { User } from '.prisma/client';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';

(() => {
  const prisma = new PrismaClient();
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs: `
      type Query {
        users: User
      }

      type User {
        id: Int
        email: String
      }
    `,
    resolvers: {
      Query: {
        users: (): Promise<User[]> => {
          return prisma.user.findMany();
        },
      },
    },
  });

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.listen(4000, () => {
    console.log('server started on port 4000');
  });
})();
