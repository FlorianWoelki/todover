import gql from 'graphql-tag';

export const deleteList = gql`
  mutation deleteList($id: String!) {
    deleteList(id: $id) {
      id
      name
    }
  }
`;
