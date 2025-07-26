import User, { UserRole } from '../../models/User';
import { GraphQLError } from 'graphql';

export const userMutations = {
  // Register a new user
  register: async (_: any, { input }: any) => {
    const { name, email, password } = input;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new GraphQLError('Email already in use', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: UserRole.USER, // Use enum value
    });
    
    // Save the user
    await user.save();
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    return {
      token,
      user,
    };
  },
  
  // Login a user
  login: async (_: any, { input }: any) => {
    const { email, password } = input;
    
    // Find the user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new GraphQLError('Invalid email or password', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new GraphQLError('Invalid email or password', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
    
    // Generate token
    const token = user.generateAuthToken();
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    return {
      token,
      user,
    };
  },
  
  // Logout (client-side only, but we'll still implement it)
  logout: async () => {
    return true;
  },

  /**
   * Update user role - handles both case formats for roles
   */
  updateUserRole: async (
    _: any,
    { id, role }: { id: string; role: string },
    context: any
  ) => {
    // Verify permissions
    if (!context.user || context.user.role !== UserRole.ADMIN) {
      throw new GraphQLError('Not authorized to update user roles', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    // Prevent admins from changing their own role
    if (context.user.id === id) {
      throw new GraphQLError('Cannot change your own role', {
        extensions: { code: 'FORBIDDEN' }
      });
    }

    // Normalize role to uppercase
    const normalizedRole = (role || '').toUpperCase() as UserRole;
    
    try {
      const targetUser = await User.findById(id);
      if (!targetUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      targetUser.role = normalizedRole;
      await targetUser.save();
      return targetUser;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new GraphQLError('Failed to update user role', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      });
    }
  },
  
  // Delete user (admin only)
  deleteUser: async (_: any, { id }: { id: string }, context: any) => {
    // Check if user is authenticated and is an admin
    if (!context.user) {
      throw new GraphQLError('Authentication required', {
        extensions: { code: 'UNAUTHENTICATED' }
      });
    }
    
    if (context.user.role !== UserRole.ADMIN) {
      throw new GraphQLError('Not authorized to delete users', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    
    // Prevent admins from deleting themselves
    if (context.user.id === id) {
      throw new GraphQLError('Cannot delete your own account', {
        extensions: { code: 'FORBIDDEN' }
      });
    }
    
    // Find and delete the user
    const result = await User.findByIdAndDelete(id);
    
    if (!result) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }
    
    return true;
  }
}