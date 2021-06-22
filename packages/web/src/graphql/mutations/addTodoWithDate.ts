import gql from 'graphql-tag';

export const addTodoWithDate = gql`
  mutation addTodoWithDate($data: AddTodoWithDateInput!) {
    addTodoWithDate(data: $data) {
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
