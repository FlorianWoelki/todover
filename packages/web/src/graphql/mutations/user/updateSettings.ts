import gql from 'graphql-tag';

export const updateSettings = gql`
  mutation updateSettings($data: UpdateSettingsInput!) {
    updateSettings(data: $data) {
      language
    }
  }
`;
