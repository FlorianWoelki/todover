import { ApolloServer } from 'apollo-server-express';
import express from 'express';

(() => {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
      }
    `,
    resolvers: {
      Query: {
        hello: (): string => {
          return 'Hello GraphQL';
        },
      },
    },
  });

  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.listen(4000, () => {
    console.log('server started on port 4000');
  });
})();
