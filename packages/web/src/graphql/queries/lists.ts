import gql from 'graphql-tag';

export const lists = gql`
  query lists {
    lists {
      id
      name
      todos {
        listId
        name
      }
    }
  }
`;
