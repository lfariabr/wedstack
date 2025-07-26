// TypeScript interfaces for User data

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UsersData {
  users: User[];
}

export interface UserData {
  user: User;
}

export interface UserVars {
  id: string;
}

/**
 * Input type for updating user roles
 * Matches the GraphQL UpdateUserRoleInput type from the backend
 */
export interface UpdateUserRoleInput {
  userId: string;
  role: UserRole;
}

/**
 * Response from user mutations
 */
export interface UserMutationResponse {
  success: boolean;
  user?: User;
  message?: string;
}
