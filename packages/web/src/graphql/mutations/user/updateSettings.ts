import gql from 'graphql-tag';

export const updateSettings = gql`
  mutation updateSettings($language: String!) {
    updateSettings(language: $language) {
      language
    }
  }
`;
