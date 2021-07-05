import gql from 'graphql-tag';

export const login = gql`
  mutation login($data: UserInput!) {
    login(data: $data) {
      accessToken
    }
  }
`;
