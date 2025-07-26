import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { GET_USERS, GET_USER } from '../../graphql/queries/user.queries';
import { UPDATE_USER_ROLE, DELETE_USER } from '../../graphql/mutations/user.mutations';
import { useUsers, useUser, useUserMutations } from '../useUsers';
import { act } from 'react-dom/test-utils';
import { toast } from 'sonner';

// Mock the toast library
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'ADMIN' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'USER' },
];

const mockSingleUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'ADMIN',
};

describe('useUsers Hook', () => {
  // Test for useUsers - getting all users
  it('returns all users correctly', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_USERS,
        },
        result: {
          data: {
            users: mockUsers,
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUsers(), { wrapper });

    // Initially should be loading with empty users array
    expect(result.current.loading).toBe(true);
    expect(result.current.users).toEqual([]);

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Check that users array has the correct length
    expect(result.current.users.length).toBe(mockUsers.length);
    
    // Verify users exist in the array
    expect(result.current.users).toBeTruthy();
    expect(result.current.error).toBeUndefined();
  });

  // Test for useUsers - when there's an error
  it('handles errors when fetching users', async () => {
    const errorMessage = 'Failed to fetch users';
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_USERS,
        },
        error: new Error(errorMessage),
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUsers(), { wrapper });

    // Wait for the query to resolve with error
    await waitFor(() => expect(result.current.error).toBeTruthy());

    expect(result.current.loading).toBe(false);
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });
});

describe('useUser Hook', () => {
  // Test for useUser - getting a single user
  it('returns a single user correctly', async () => {
    const userId = '1';
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_USER,
          variables: { id: userId },
        },
        result: {
          data: {
            user: mockSingleUser,
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUser(userId), { wrapper });

    // Initially should be loading with null user
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify user object exists
    expect(result.current.user).toBeTruthy();
    expect(result.current.error).toBeUndefined();
    expect(result.current.notFound).toBe(false);
  });

  // Test for useUser - when user is not found
  it('handles case when user is not found', async () => {
    const userId = '999'; // Non-existent ID
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_USER,
          variables: { id: userId },
        },
        result: {
          data: {
            user: null,
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUser(userId), { wrapper });

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.notFound).toBe(true);
  });
});

describe('useUserMutations Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for updateUserRole mutation
  it('updates user role successfully', async () => {
    const userId = '1';
    const newRole = 'EDITOR';
    const updatedUser = { ...mockSingleUser, role: newRole };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: UPDATE_USER_ROLE,
          variables: { id: userId, role: newRole.toUpperCase() },
        },
        result: {
          data: {
            updateUserRole: updatedUser,
          },
        },
      },
      {
        request: {
          query: GET_USERS,
        },
        result: {
          data: {
            users: [updatedUser, mockUsers[1]],
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUserMutations(), { wrapper });

    await act(async () => {
      const response = await result.current.updateUserRole(userId, newRole);
      // Verify response exists
      expect(response).toBeTruthy();
    });

    expect(toast.success).toHaveBeenCalledWith('User role updated successfully!');
  });

  // Test for deleteUser mutation
  it('deletes a user successfully', async () => {
    const userId = '2';

    const mocks: MockedResponse[] = [
      {
        request: {
          query: DELETE_USER,
          variables: { id: userId },
        },
        result: {
          data: {
            deleteUser: true,
          },
        },
      },
      {
        request: {
          query: GET_USERS,
        },
        result: {
          data: {
            users: [mockUsers[0]],
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUserMutations(), { wrapper });

    await act(async () => {
      const success = await result.current.deleteUser(userId);
      expect(success).toBe(true);
    });

    expect(toast.success).toHaveBeenCalledWith('User deleted successfully!');
  });

  // Test for error handling in mutations
  it('handles errors when updating user role', async () => {
    const userId = '1';
    const newRole = 'EDITOR';
    const errorMessage = 'Permission denied';

    const mocks: MockedResponse[] = [
      {
        request: {
          query: UPDATE_USER_ROLE,
          variables: { id: userId, role: newRole.toUpperCase() },
        },
        error: new Error(errorMessage),
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    );

    const { result } = renderHook(() => useUserMutations(), { wrapper });

    await act(async () => {
      const response = await result.current.updateUserRole(userId, newRole);
      expect(response).toBeNull();
    });

    expect(toast.error).toHaveBeenCalledWith(`Failed to update user role: ${errorMessage}`);
  });
});
