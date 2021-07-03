import gql from 'graphql-tag';

export const me = gql`
  query Me {
    me {
      email
      settings {
        language
      }
    }
  }
`;
