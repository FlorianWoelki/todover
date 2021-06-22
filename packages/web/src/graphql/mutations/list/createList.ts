import gql from 'graphql-tag';

export const createList = gql`
  mutation createList($name: String!) {
    createList(name: $name) {
      id
      name
    }
  }
`;
