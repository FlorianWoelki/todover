import gql from 'graphql-tag';

export const updateTodo = gql`
  mutation updateTodo($id: String!, $data: UpdateTodoInput!) {
    updateTodo(id: $id, data: $data) {
      id
      name
      done
      date
      repetition
      listId
      description
    }
  }
`;
