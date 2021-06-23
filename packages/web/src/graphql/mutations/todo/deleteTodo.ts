import gql from 'graphql-tag';

export const deleteTodo = gql`
  mutation removeTodo($id: String!) {
    removeTodo(id: $id) {
      id
    }
  }
`;
