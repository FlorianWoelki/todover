import { buildSchema } from 'type-graphql';
import { ListResolver } from '../resolvers/ListResolver';
import { TodoResolver } from '../resolvers/TodoResolver';
import { UserResolver } from '../resolvers/UserResolver';

export const createSchema = () => {
  return buildSchema({
    resolvers: [UserResolver, TodoResolver, ListResolver],
  });
};
