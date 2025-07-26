'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  FolderKanban, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  
  // Backup check to ensure we have user data from localStorage
  useEffect(() => {
    if (!initialized && !loading && !user) {
      // Double-check localStorage directly as a fallback
      try {
        const storedUser = localStorage.getItem('user');
        console.log('Checking localStorage directly:', storedUser);
        if (storedUser) {
          // Force page reload to ensure AuthContext picks up the localStorage data
          window.location.reload();
        }
      } catch (err) {
        console.error('Error checking localStorage:', err);
      }
      setInitialized(true);
    }
  }, [initialized, loading, user]);

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin');
      } else if (isAuthenticated && user?.role !== 'ADMIN') {
        console.log('User is not admin, redirecting to home');
        router.push('/');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // If still loading or user not authenticated, show loading state
  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/articles', label: 'Articles', icon: FileText },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your content</p>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    {
                      "bg-accent text-accent-foreground": 
                        typeof window !== 'undefined' && window.location.pathname === item.href ||
                        (item.href !== '/admin' && typeof window !== 'undefined' && window.location.pathname.startsWith(item.href))
                    }
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
            
            <li className="mt-8 pt-6 border-t">
              <button 
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
