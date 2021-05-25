import { graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../../src/utils/createSchema';

let schema: GraphQLSchema;

export const graphqlTestCall = async (
  query: any,
  variables?: any,
  userId?: string,
  accessToken?: string
) => {
  if (!schema) {
    schema = await createSchema();
  }

  return graphql(
    schema,
    query,
    undefined,
    {
      req: {
        headers: {
          authorization: `bearer ${accessToken}`,
        },
      },
      res: {
        cookie: jest.fn((_name: string, _token: string, _obj: any) => true),
      },
      payload: {
        userId,
      },
    },
    variables
  );
};
