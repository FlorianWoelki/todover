import gql from 'graphql-tag';

export const moveToList = gql`
  mutation moveToList($todoId: String!, $listId: String!) {
    moveToList(todoId: $todoId, listId: $listId) {
      id
      name
    }
  }
`;
