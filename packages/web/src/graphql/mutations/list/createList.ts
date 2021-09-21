import gql from 'graphql-tag';

export const createList = gql`
  mutation createList($name: String!, $position: Int!) {
    createList(name: $name, position: $position) {
      id
      name
      position
    }
  }
`;
