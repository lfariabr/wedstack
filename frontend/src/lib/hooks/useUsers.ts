import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { GET_USERS, GET_USER } from '../graphql/queries/user.queries';
import { UPDATE_USER_ROLE, DELETE_USER } from '../graphql/mutations/user.mutations';
import { 
  User, 
  UsersData, 
  UserData, 
  UserVars, 
  UpdateUserRoleInput, 
  UserRole 
} from '../graphql/types/user.types';

/**
 * Hook for fetching all users
 * Intended for admin use only
 */
export const useUsers = () => {
  const { data, loading, error } = useQuery<UsersData>(GET_USERS);
  
  return {
    users: data?.users || [],
    loading,
    error: error?.message
  };
};

/**
 * Hook for fetching a single user by ID
 */
export const useUser = (id: string) => {
  const { data, loading, error } = useQuery<UserData, UserVars>(
    GET_USER,
    { 
      variables: { id },
      skip: !id
    }
  );
  
  return {
    user: data?.user || null,
    loading,
    error: error?.message,
    notFound: !loading && !error && !data?.user
  };
};

/**
 * Hook for user management operations
 * Provides functions for updating user roles and deleting users
 */
export const useUserMutations = () => {
  // Update User Role Mutation
  const [updateUserRoleMutation, { loading: updateRoleLoading }] = useMutation(UPDATE_USER_ROLE, {
    refetchQueries: [{ query: GET_USERS }],
    onCompleted: () => {
      toast.success('User role updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  });

  // Delete User Mutation
  const [deleteUserMutation, { loading: deleteLoading }] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    onCompleted: () => {
      toast.success('User deleted successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  });

  /**
   * Update a user's role
   */
  const updateUserRole = async (userId: string, role: string): Promise<User | null> => {
    try {
      // Ensure role is in uppercase format for API
      const normalizedRole = role.toUpperCase();
      
      const { data } = await updateUserRoleMutation({
        variables: { 
          id: userId, 
          role: normalizedRole 
        }
      });
      return data?.updateUserRole || null;
    } catch (error) {
      console.error('Error updating user role:', error);
      return null;
    }
  };

  /**
   * Delete a user
   */
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteUserMutation({
        variables: { id }
      });
      return data?.deleteUser || false;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  return {
    updateUserRole,
    deleteUser,
    loading: {
      updateRole: updateRoleLoading,
      delete: deleteLoading,
      any: updateRoleLoading || deleteLoading
    }
  };
};
