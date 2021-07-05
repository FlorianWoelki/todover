import gql from 'graphql-tag';

export const register = gql`
  mutation register($data: UserInput!) {
    register(data: $data) {
      id
    }
  }
`;
