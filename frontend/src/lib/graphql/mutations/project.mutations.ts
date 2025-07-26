import { gql } from '@apollo/client';
import { PROJECT_FRAGMENT } from '../queries/project.queries';

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectInput!) {
    createProject(input: $input) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) {
    updateProject(id: $id, input: $input) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;
