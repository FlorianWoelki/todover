import gql from 'graphql-tag';

export const todos = gql`
  query todos {
    todos {
      id
      name
      done
      createdAt
      date
      repetition
      listId
      description
    }
  }
`;
