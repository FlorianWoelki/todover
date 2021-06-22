import gql from 'graphql-tag';

export const addTodoToList = gql`
  mutation addTodoToList($data: AddTodoToListInput!) {
    addTodoToList(data: $data) {
      id
      name
    }
  }
`;
