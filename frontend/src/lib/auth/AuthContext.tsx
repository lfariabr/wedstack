'use client';

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode 
} from 'react';
import { useRouter } from 'next/navigation';
import { gql, useMutation, ApolloError } from '@apollo/client';
import Cookies from 'js-cookie';
import { UserRole } from '../graphql/types/user.types';

// GraphQL Mutations  
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (credentials: { name: string, email: string, password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Format error message for better UX
const formatError = (err: any): string => {
  // Check if it's an Apollo error with GraphQL errors
  if (err.graphQLErrors && err.graphQLErrors.length > 0) {
    const graphQLError = err.graphQLErrors[0];
    
    // Handle specific error codes with user-friendly messages
    if (graphQLError.extensions?.code === 'UNAUTHENTICATED') {
      return 'Invalid email or password. Please try again.';
    }
    
    if (graphQLError.extensions?.code === 'BAD_USER_INPUT') {
      return 'Please check your information and try again.';
    }
    
    // Return the message from the GraphQL error if available
    return graphQLError.message || 'An error occurred. Please try again.';
  }
  
  // Handle network errors
  if (err.networkError) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Default error message
  return err.message || 'An unexpected error occurred. Please try again.';
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Cookie options for security
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/'
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  // Check for existing token on startup
  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      try {
        // First try to get from cookies (for SSR compatibility)
        let storedToken = Cookies.get('token');
        let storedUser: string | null = null;
        
        // If not in cookies, fall back to localStorage
        if (!storedToken) {
          storedToken = localStorage.getItem('token');
          storedUser = localStorage.getItem('user');
        } else {
          storedUser = localStorage.getItem('user');
        }
        
        // If we have data, set the state
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Ensure token is stored in both places
          Cookies.set('token', storedToken, cookieOptions);
          localStorage.setItem('token', storedToken);
        }
      } catch (err) {
        console.error('Failed to load user data from storage', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserFromLocalStorage();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
  
    try {
      console.log('Login attempt with:', { email });
      const { data, errors } = await loginMutation({
        variables: {
          input: { email, password }
        },
        errorPolicy: 'all'  // ✅ This is crucial!
      });
  
      // ✅ Check if login was successful
      if (data?.login) {
        setUser(data.login.user);
        setToken(data.login.token);
  
        // Store in both localStorage and cookies
        localStorage.setItem('token', data.login.token);
        localStorage.setItem('user', JSON.stringify(data.login.user));
        Cookies.set('token', data.login.token, cookieOptions);
  
        router.push('/');
      } else {
        // ✅ Login failed, show the first GraphQL error if available
        const errorMessage =
          errors?.[0]?.message || 'Login failed. Please try again.';
        setError(errorMessage);
        console.warn('[Login Error]', errorMessage);
      }
    } catch (err) {
      // ✅ Catch network or unexpected errors
      const formatted = formatError(err);
      setError(formatted);
      console.error('[Login Exception]', formatted);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await registerMutation({
        variables: { 
          input: { name, email, password }
        },
      }); 
      
      if (data?.register) {
        setUser(data.register.user);
        setToken(data.register.token);
        
        // Store in both localStorage and cookies
        localStorage.setItem('token', data.register.token);
        localStorage.setItem('user', JSON.stringify(data.register.user));
        Cookies.set('token', data.register.token, cookieOptions);
        
        router.push('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Extract the error message directly from GraphQL error
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        setError(err.graphQLErrors[0].message);
      } else if (err.networkError) {
        setError(`Network error: ${err.networkError.message}`);
      } else {
        setError(err.message || 'An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear from both localStorage and cookies
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);