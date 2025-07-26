import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Utility function to check if the current user has admin role
 * @returns Boolean indicating if user is admin
 */
export function isAdmin(): boolean {
  try {
    // Check for token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) return false;
    
    // Decode the token
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log('Token expired');
      return false;
    }
    
    // Check if user has admin role
    return decoded.role === 'ADMIN';
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }
}
