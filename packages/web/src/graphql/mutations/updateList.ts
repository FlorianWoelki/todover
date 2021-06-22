import gql from 'graphql-tag';

export const updateList = gql`
  mutation updateList($id: String!, $data: UpdateListInput!) {
    updateList(id: $id, data: $data) {
      id
      name
    }
  }
`;
