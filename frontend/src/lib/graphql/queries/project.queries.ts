import { gql } from '@apollo/client';

// Fragment for consistent project data shape
export const PROJECT_FRAGMENT = gql`
  fragment ProjectFields on Project {
    id
    title
    description
    imageUrl
    githubUrl
    technologies
    createdAt
    updatedAt
  }
`;

// Query to get all projects
export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

// Query to get featured projects (for homepage)
export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects {
    featuredProjects {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;

// Query to get a single project by ID
export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      ...ProjectFields
    }
  }
  ${PROJECT_FRAGMENT}
`;
