import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function middleware(request: NextRequest) {
  // Get token from authorization header or cookie
  const authHeader = request.headers.get('authorization');
  const token = request.cookies.get('token')?.value || 
                (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);
  
  // Check if the path is an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    // No token - redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      // Decode and verify the token
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        console.log('Middleware: Token expired');
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
      
      // Check for admin role - must be explicitly 'admin'
      if (decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
    } catch (error) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Configure which paths this middleware applies to
export const config = {
  matcher: ['/admin/:path*']
};
